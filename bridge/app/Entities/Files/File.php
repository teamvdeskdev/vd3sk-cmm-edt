<?php

namespace App\Entities\Files;

                                                                                                                                                                                                                                    
use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property string $name
 * @property string $created_at
 * @property string $updated_at
 */
class File extends Model
{
   
    protected $keyType = 'integer';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'created_at', 'updated_at'];

      
 
    
 
}
