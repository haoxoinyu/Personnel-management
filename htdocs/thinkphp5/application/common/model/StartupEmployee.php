<?php
namespace app\common\model;
use think\Model;

class StartupEmployee extends Model
{
    protected $table = 'startup_employees';

    public function employees()
    {
       return $this->belongsTo('Employees');
    }

    public function startup()
    {
       return $this->belongsTo('Startup');
    }
}
