<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use think\Route;
use app\common\model\Startup;

class StartupController extends Controller
{
    public function all() {
        $list = Startup::where('')->select();
        return json($list);
    }

    public function index() {
        try {
            $page = (int)$this->request->get('page', 1);
            $size = (int)$this->request->get('size', 10);
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            // 定制查询信息
            $condition = [];
            
            $sno = $data['sno'];

            if ($sno !== null && $sno !== '') {
                $condition['sno'] = ['like', '%' . $sno . '%'];
            }

            // 获取创业公司名称
            $name = $data['name'];

            if ($name !== null && $name !== '') {
                $condition['name'] = ['like', '%' . $name . '%'];
            }
           
            $list = Startup::where($condition)
                    ->page($page, $size)
                    ->select();
            $total = Startup::where($condition)
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
            $Startup = Startup::where('sno', $data['sno'])->find();

            if ($Startup) {
                return json(['error' => '创业公司已存在'], 401);
            }

            
            // 创建创业公司对象并保存
            $Startup = new Startup();
            $Startup->sno = $data['sno'];
            $Startup->name = $data['name'];
            $Startup->phone = $data['phone'];
            
            $Startup->save();

            return json(['status' => 'success', 'sno' => $Startup->sno]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function edit() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
        
            $list = Startup::where('id', $data)->select();
            
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
            
            // 获取传入的创业公司信息
            $Startup = Startup::get($id);
            if (is_null($Startup)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            $results = Startup::where('sno', $data['sno'])->select();

            if ($results) {
                foreach ($results as $result) {
                    if ($result->id !== $data['id']) {
                        return json(['error' => '该创业公司已存在'], 401);
                    } 
                }
            }
            
            // 创建对象并保存
            $Startup->sno = $data['sno'];
            $Startup->name = $data['name'];
            $Startup->phone = $data['phone'];
            
            $Startup->save();

            return json(['status' => 'success', 'sno' => $Startup->sno]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 删除创业公司
    public function delete()
    {
        try {
            $Startup = StartupController::getStartup();
            if (!$Startup) {
                return json(['status' => 'error', 'message' => '创业公司不存在']);
            }

            // 删除创业公司
            if ($Startup->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getStartup() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $Startup = Startup::get($id);
        return $Startup;
    }
}
