<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use think\Route;
use app\common\model\IncubatorEmployee;

class IncubatoremployeeController extends Controller
{
    public function all() {
        $list = IncubatorEmployee::with('employees')->where('')->select();
        return json($list);
    }
}