<?php
namespace app\index\controller;

use app\common\model\User;
use think\Request;

class IndexController
{
  public static function getParamId($request) {
      $path = $request->path();
      // 用/作为分割符
      $parts = explode('/', $path);
      // 获取数组中的最后一个元素
      return (int)end($parts);
  }
}

