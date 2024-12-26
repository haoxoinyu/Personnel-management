<?php
namespace app\index\controller;

use think\Controller;
use think\Request;
use app\common\model\User;
use think\Db;

class UserController extends controller
{
    public function index() {
        try {
            $page = (int)$this->request->get('page', 1);
            $size = (int)$this->request->get('size', 10);
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            // 将字符串 "null" 转换为 null
            $data = array_map(function($value) {
                return $value === 'null' ? null : $value;
            }, $data);
            
            // 定制查询信息
            $condition = [];
            
            // 获取用户名
            $username = $data['username'];

            if ($username !== null && $username !== '') {
                $condition['user.username'] = ['like', '%' . $username . '%'];
            }
          
            $user = new User();
            
            $list = User::where($condition)
                    ->page($page, $size)
                    ->select();
            $total = User::where($condition)
                    ->page($page, $size)
                    ->count();
            
            $pageData = [
              'content' => $list,
              'number' => $page, // ThinkPHP的分页参数是从1开始的
              'size' => $size,
              'totalPages' => ceil($total / $size),
              'numberOfElements' => $total
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
            $result = User::where('username', $data['username'])->find();

            if ($result) {
                return json(['error' => '用户已存在'], 401);
            }
           
            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'name is required']);
            }
            if (!isset($data['username']) || empty($data['username'])){
                return json(['status' => 'error', 'message' => 'username is required']);
            }
            
            // 创建班级对象并保存
            $user = new User();
            
            $user->name = $data['name'];
            $user->username = $data['username'];
            $user->password = '123456';
            $user->save();

            return json(['status' => 'success']);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function edit() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
        
            $list = User::where('user.id', $data)->select();
            
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
            
            // 获取传入的班级信息
            $user = User::get($id);
            if (is_null($user)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }
            // 获取相应账号的数据
            $users = User::where('username', $data['username'])
                            ->where('id', '<>', $id) // 排除当前用户ID
                            ->select();
            if (count($users) > 0) {
                return json(['error' => '用户已存在'], 401);
            }

            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'name is required']);
            }
            if (!isset($data['username']) || empty($data['username'])){
                return json(['status' => 'error', 'message' => 'username is required']);
            }
            if ($data['password'] === null && $data['password'] === '') {
                $data['password'] = '123456';
            }
            
            // 创建班级对象并保存
            $user->name = $data['name'];
            $user->username = $data['username'];
            $user->password = $data['password'];
            $user->save();

            return json(['status' => 'success']);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 删除班级
    public function delete()
    {
        try {
            $user = UserController::getUser();
            if (!$user) {
                return json(['status' => 'error', 'message' => '用户不存在']);
            }
        
            // 删除用户
            if ($user->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getUser() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $user = User::where('id', $id)->find();
        
        return $user;
    }
}
