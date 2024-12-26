<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use think\Route;
use app\common\model\Investors;

class InvestorsController extends Controller
{
    public function all() {
        $list = Investors::where('')->select();
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
            $num = $data['num'];

            if ($num !== null && $num !== '') {
                $condition['num'] = ['like', '%' . $num . '%'];
            }

            // 获取投资方名称
            $name = $data['name'];

            if ($name !== null && $name !== '') {
                $condition['name'] = ['like', '%' . $name . '%'];
            }
           
            $list = Investors::where($condition)
                    ->page($page, $size)
                    ->select();
            $total = Investors::where($condition)
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
            $Investors = Investors::where('num', $data['num'])->find();

            if ($Investors) {
                return json(['error' => '投资方已存在'], 401);
            }

            
            // 创建投资方对象并保存
            $Investors = new Investors();
            $Investors->num = $data['num'];
            $Investors->name = $data['name'];
            $Investors->phone = $data['phone'];
            
            $Investors->save();

            return json(['status' => 'success', 'num' => $Investors->num]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function edit() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
        
            $list = Investors::where('id', $data)->select();
            
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
            
            // 获取传入的投资方信息
            $Investors = Investors::get($id);
            if (is_null($Investors)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            $results = Investors::where('num', $data['num'])->select();

            if ($results) {
                foreach ($results as $result) {
                    if ($result->id !== $data['id']) {
                        return json(['error' => '该投资方已存在'], 401);
                    } 
                }
            }
            
            // 创建学期对象并保存
            $Investors->num = $data['num'];
            $Investors->name = $data['name'];
            $Investors->phone = $data['phone'];
            
            $Investors->save();

            return json(['status' => 'success', 'num' => $Investors->num]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 删除投资方
    public function delete()
    {
        try {
            $Investors = InvestorsController::getInvestors();
            if (!$Investors) {
                return json(['status' => 'error', 'message' => '投资方不存在']);
            }

            // 删除投资方
            if ($Investors->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getInvestors() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $Investors = Investors::get($id);
        return $Investors;
    }
}
