<?php
namespace app\common\model;
use think\Model;

class Employees extends Model
{
    protected $table = 'employees';

    // 定义关联到 IncubatorEmployee 的方法
    public function incubatorEmployee()
    {
        return $this->hasMany('IncubatorEmployee', 'employees_id', 'id');
    }

    // 定义关联到 StartupEmployee 的方法
    public function startupEmployee()
    {
        return $this->hasMany('StartupEmployee', 'employees_id', 'id');
    }

}
