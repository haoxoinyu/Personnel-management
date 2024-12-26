<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use think\Route;
use app\common\model\Project;

class ProjectController extends Controller
{
    public function index() {
        try {
            $page = (int)$this->request->get('page', 1);
            $size = (int)$this->request->get('size', 10);
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            // 定制查询信息
            $condition = [];
            
            $num = $data['num'];

            if ($num !== null && $num !== '') {
                $condition['project.num'] = ['like', '%' . $num . '%'];
            }

            $startup_id = $data['startup_id'];

            if ($startup_id !== null && $startup_id !== '') {
                $condition['startup_id'] = $startup_id;
            }

            $investor_id = $data['investor_id'];

            if ($investor_id !== null && $investor_id !== '') {
                $condition['investors_id'] = $investor_id;
            }

            $incubator_id = $data['incubator_id'];

            if ($incubator_id !== null && $incubator_id !== '') {
                $condition['project.incubator_employee_id'] = $incubator_id;
            }
           
            $list = Project::with(['startup', 'investors', 'incubatorEmployee'])
                    ->where($condition)
                    ->page($page, $size)
                    ->select();
            $total = Project::with(['startup', 'investors', 'incubatorEmployee'])
                    ->where($condition)
                    ->page($page, $size)
                    ->count();
          
            $pageData = [
              'content' => $list,
              'number' => $page, // ThinkPHP的分页参数是从1开始的
              'size' => $size,
              'totalPages' => ceil($total / $size),
              'numberOfElements' => $total,
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
            $Project = Project::where('num', $data['num'])
                            ->where('startup_id', $data['startup_id'])
                            ->where('investors_id', $data['investor_id'])
                            ->where('incubator_employee_id', $data['incubator_id'])
                            ->find();

            if ($Project) {
                return json(['error' => '项目已存在'], 401);
            }

            
            // 创建项目对象并保存
            $Project = new Project();
            $Project->num = $data['num'];
            $Project->startup_id = $data['startup_id'];
            $Project->investors_id = $data['investor_id'];
            $Project->incubator_employee_id = $data['incubator_id'];
            
            $Project->save();

            return json(['status' => 'success', 'num' => $Project->num]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function edit() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
        
            $list = Project::with(['startup', 'investors', 'incubatorEmployee'])->where('project.id', $data)->select();
            
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
            
            // 获取传入的项目信息
            $Project = Project::get($id);
            if (is_null($Project)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            $results = Project::where('num', $data['num'])
                            ->where('startup_id', $data['startup'])
                            ->where('investors_id', $data['investors'])
                            ->where('incubator_employee_id', $data['incubator'])
                            ->select();

            if ($results) {
                foreach ($results as $result) {
                    if ($result->id !== $data['id']) {
                        return json(['error' => '该项目已存在'], 401);
                    } 
                }
            }
            
            // 创建学期对象并保存
            $Project->num = $data['num'];
            $Project->startup_id = $data['startup'];
            $Project->investors_id = $data['investors'];
            $Project->incubator_employee_id = $data['incubator'];
            
            $Project->save();

            return json(['status' => 'success', 'num' => $Project->num]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 删除项目
    public function delete()
    {
        try {
            $Project = ProjectController::getProject();
            if (!$Project) {
                return json(['status' => 'error', 'message' => '项目不存在']);
            }

            // 删除项目
            if ($Project->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getProject() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $Project = Project::get($id);
        return $Project;
    }
}
