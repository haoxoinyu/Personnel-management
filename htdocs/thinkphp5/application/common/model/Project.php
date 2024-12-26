<?php
namespace app\common\model;
use think\Model;

class Project extends Model
{
    protected $table = 'startup_projects';

    public function investors()
    {
       return $this->belongsTo('Investors');
    }

    public function startup()
    {
       return $this->belongsTo('Startup');
    }

    public function incubatorEmployee()
    {
        return $this->belongsTo('IncubatorEmployee');
    }
}
