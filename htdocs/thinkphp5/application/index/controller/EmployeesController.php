<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use think\Route;
use app\common\model\Employees;
use app\common\model\StartupEmployee;
use app\common\model\IncubatorEmployee;
use app\common\model\Startup;
use app\common\model\Incubator;

class EmployeesController extends Controller
{
    public function index() {
        try {
            $page = (int)$this->request->get('page', 1);
            $size = (int)$this->request->get('size', 10);
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            // 定制查询信息
            $condition = [];

            $eno = $data['eno'];
            if ($eno !== '') {
                $condition['eno'] = ['like', '%' . $eno . '%'];
            }

            $name = $data['name'];
            if ($name !== '') {
                $condition['name'] = ['like', '%' . $name . '%'];
            }

            $list = [];
            $total = 1;

            $employees = Employees::where($condition)->select();
            if (!empty($employees)) {
                $companyData = $data['company'];

                if ($companyData !== "" && $companyData !== null) {
                    // 检查company是incubator还是startup
                    $company = Startup::where('sno', $companyData)->find();
                    if (!$company) {
                        $company = Incubator::where('ino', $companyData)->find();
                    }

                    if ($company) {
                        $companyId = $company['id'];
                        // 根据company类型进行不同的查询
                        if ($company instanceof Startup) {
                            $companylist = StartupEmployee::with(['employees', 'startup'])
                                ->where('startup_id', $companyId)
                                ->select();
                        } else {
                            $companylist = IncubatorEmployee::with(['employees', 'incubator'])
                                ->where('incubator_id', $companyId)
                                ->select();
                        }

                        // 如果查询到相关的员工关系，提取员工ID
                        if (!empty($companylist)) {
                            // 初始化员工ID数组
                            $employeeIds = [];
                            // 遍历对象数组，提取每个对象的 employees_id 属性
                            foreach ($companylist as $item) {
                                // 确保属性存在且不为空
                                if (isset($item->employees_id) && !empty($item->employees_id)) {
                                    $employeeIds[] = $item->employees_id;
                                }
                            }
                            // 使用提取的员工ID去employees表进行查询
                            if (!empty($employeeIds)) {
                                $list = Employees::with(['incubatorEmployee', 'startupEmployee'])
                                    ->where('id', 'in', $employeeIds)
                                    ->page($page, $size)
                                    ->select();
                                $total = Employees::with(['incubatorEmployee', 'startupEmployee'])
                                    ->where('id', 'in', $employeeIds)
                                    ->page($page, $size)
                                    ->count();
                            } else {
                                // 如果没有员工数据，打印条件以调试
                                print_r($condition);
                                $list = [];
                                $total = 0; // 确保$total为0，如果没有员工数据
                            }
                        }
                    }
                } else {
                    $list = Employees::with(['incubatorEmployee', 'startupEmployee'])
                        ->where($condition)
                        ->page($page, $size)
                        ->select();
                    $total = Employees::with(['incubatorEmployee', 'startupEmployee'])
                        ->where($condition)
                        ->page($page, $size)
                        ->count();
                }
            } else {
                $list = Employees::with(['incubatorEmployee', 'startupEmployee'])
                    ->where($condition)
                    ->page($page, $size)
                    ->select();
                $total = Employees::with(['incubatorEmployee', 'startupEmployee'])
                    ->where($condition)
                    ->page($page, $size)
                    ->count();
            }

            $pageData = [
                'content' => $list,
                'number' => $page,
                'size' => $size,
                'totalPages' => ceil($total / $size),
                'totalElements' => $total,
            ];

            return json($pageData);
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }

    public function add() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
    
            // 获取相应账号的数据
            $Employees = Employees::where('eno', $data['eno'])->find();

            if ($Employees) {
                return json(['error' => '员工已存在'], 401);
            }
            if ($data['gender'] === 0) {
                $gender = '男';
            }
            if ($data['gender'] === 1) {
                $gender = '女';
            }

            // 创建员工对象并保存
            $Employees = new Employees();
            $Employees->eno = $data['eno'];
            $Employees->name = $data['name'];
            $Employees->cardid = $data['cardid'];
            $Employees->gender = $gender;
            $Employees->phone = $data['phone'];
            
            $Employees->save();

            $companyData = $data['company'];
            $employeeId = Employees::where('eno', $data['eno'])->find();
            if ($companyData !== "" && $companyData !== null) {
                // 检查company是incubator还是startup
                $company = Startup::where('sno', $companyData)->find();
                if (!$company) {
                    $company = Incubator::where('ino', $companyData)->find();
                }

                if($company) {
                    $companyId = $company['id'];
                    // 根据company类型进行不同的保存
                    if ($company instanceof Startup) {
                        $new = new StartupEmployee();
                        $new->employees_id = $employeeId['id'];
                        $new->startup_id = $companyId;

                        $new->save();
                    } else {
                        $new = new IncubatorEmployee();
                        $new->employees_id = $employeeId['id'];
                        $new->incubator_id = $companyId;

                        $new->save();
                    }
                }
            }

            return json(['status' => 'success', 'eno' => $Employees->eno]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function edit() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
        
            $list = Employees::with(['incubatorEmployee', 'startupEmployee'])->where('id', $data)->select();
            
            return json($list);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function update() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            
            $id = $data['id'];
            
            // 获取传入的员工信息
            $Employees = Employees::get($id);
            if (is_null($Employees)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            $results = Employees::where('eno', $data['eno'])->select();

            if ($results) {
                foreach ($results as $result) {
                    if ($result->id !== $data['id']) {
                        return json(['error' => '该员工已存在'], 401);
                    } 
                }
            }

            if ($data['gender'] === 0) {
                $gender = '男';
            }
            if ($data['gender'] === 1) {
                $gender = '女';
            }
            
            // 创建学期对象并保存
            $Employees->eno = $data['eno'];
            $Employees->name = $data['name'];
            $Employees->cardid = $data['cardid'];
            $Employees->gender = $gender;
            $Employees->phone = $data['phone'];
            
            $Employees->save();

            $list = StartupEmployee::where('employees_id', $Employees['id'])->select();
            if($list) {
                foreach($list as $list) {
                    $list->delete();
                }
            }
            $list = IncubatorEmployee::where('employees_id', $Employees['id'])->select();
            if($list) {
                foreach($list as $list) {
                    $list->delete();
                }
            }

            if (isset($data['incubatorEmployee']) && $data['incubatorEmployee'] !== null && $data['incubatorEmployee'] !== '') {
                $companyData = $data['incubatorEmployee'];
            }
            if (isset($data['startupEmployee']) && $data['startupEmployee'] !== null && $data['startupEmployee'] !== '') {
                $companyData = $data['startupEmployee'];
            }
            $employeeId = Employees::where('eno', $data['eno'])->find();
            if ($companyData !== "" && $companyData !== null) {
                // 检查company是incubator还是startup
                $company = Startup::where('sno', $companyData)->find();
                if (!$company) {
                    $company = Incubator::where('ino', $companyData)->find();
                }

                if($company) {
                    $companyId = $company['id'];
                    // 根据company类型进行不同的查询
                    if ($company instanceof Startup) {
                        $new = new StartupEmployee();
                        $new->employees_id = $employeeId->id;
                        $new->startup_id = $companyId;

                        $new->save();
                    } else {
                        $new = new IncubatorEmployee();
                        $new->employees_id = $employeeId->id;
                        $new->incubator_id = $companyId;

                        $new->save();
                    }
                }
            }

            return json(['status' => 'success', 'eno' => $Employees->eno]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 删除员工
    public function delete()
    {
        try {
            $Employees = EmployeesController::getEmployees();
            if (!$Employees) {
                return json(['status' => 'error', 'message' => '员工不存在']);
            }
            $list = StartupEmployee::where('employees_id', $Employees['id'])->select();
            if($list) {
                foreach($list as $list) {
                    $list->delete();
                }
            }
            $list = IncubatorEmployee::where('employees_id', $Employees['id'])->select();
            if($list) {
                foreach($list as $list) {
                    $list->delete();
                }
            }
            // 删除员工
            if ($Employees->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getEmployees() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $Employees = Employees::get($id);
        return $Employees;
    }
}
