<?php
namespace app\common\model;
use think\Model;

class IncubatorEmployee extends Model
{
    protected $table = 'incubator_employees';

    public function employees()
    {
       return $this->belongsTo('Employees');
    }

    public function incubator()
    {
       return $this->belongsTo('Incubator');
    }

}
