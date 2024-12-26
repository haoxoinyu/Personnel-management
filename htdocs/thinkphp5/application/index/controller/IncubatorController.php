<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use think\Route;
use app\common\model\Incubator;

class IncubatorController extends Controller
{
    public function all() {
        $list = Incubator::where('')->select();
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
            
            // 获取学校ID
            $ino = $data['ino'];

            if ($ino !== null && $ino !== '') {
                $condition['ino'] = ['like', '%' . $ino . '%'];
            }

            // 获取孵化公司名称
            $name = $data['name'];

            if ($name !== null && $name !== '') {
                $condition['name'] = ['like', '%' . $name . '%'];
            }

            // 获取孵化公司名称
            $legal_name = $data['legal_name'];

            if ($legal_name !== null && $legal_name !== '') {
                $condition['legal_name'] = ['like', '%' . $legal_name . '%'];
            }
           
            $list = Incubator::where($condition)
                    ->page($page, $size)
                    ->select();
            $total = Incubator::where($condition)
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
            $Incubator = Incubator::where('ino', $data['ino'])->find();

            if ($Incubator) {
                return json(['error' => '孵化公司已存在'], 401);
            }

            
            // 创建孵化公司对象并保存
            $Incubator = new Incubator();
            $Incubator->ino = $data['ino'];
            $Incubator->name = $data['name'];
            $Incubator->legal_name = $data['legal_name'];
            $Incubator->address = $data['address'];
            $Incubator->phone = $data['phone'];
            
            $Incubator->save();

            return json(['status' => 'success', 'ino' => $Incubator->ino]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function edit() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
        
            $list = Incubator::where('id', $data)->select();
            
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
            
            // 获取传入的孵化公司信息
            $Incubator = Incubator::get($id);
            if (is_null($Incubator)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            $results = Incubator::where('ino', $data['ino'])->select();

            if ($results) {
                foreach ($results as $result) {
                    if ($result->id !== $data['id']) {
                        return json(['error' => '该孵化公司已存在'], 401);
                    } 
                }
            }
            
            // 创建学期对象并保存
            $Incubator->ino = $data['ino'];
            $Incubator->name = $data['name'];
            $Incubator->legal_name = $data['legal_name'];
            $Incubator->address = $data['address'];
            $Incubator->phone = $data['phone'];
            
            $Incubator->save();

            return json(['status' => 'success', 'ino' => $Incubator->ino]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 删除孵化公司
    public function delete()
    {
        try {
            $Incubator = IncubatorController::getIncubator();
            if (!$Incubator) {
                return json(['status' => 'error', 'message' => '孵化公司不存在']);
            }

            // 删除孵化公司
            if ($Incubator->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getIncubator() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $Incubator = Incubator::get($id);
        return $Incubator;
    }
}
