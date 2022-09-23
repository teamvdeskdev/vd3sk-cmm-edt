<?php

namespace OCA\WorkflowManager\Entity;

use JsonSerializable;

class BaseModel implements JsonSerializable
{
  public $Skip; //: number;
  public $Take; //: number;
  public $Count; //: number;
  public $Search; //: string;
  public $Filter; //: TFilter;
  public $Order; //: BaseOrder;
  public $Dtos; //: TDto[];
  public $Dto; //: TDto;
  public $Entity; //: TEntity;
  public $Performed; //: boolean;
  public $Properties; //: List<string>
  public $Error;
  
  public function __construct()
  {
    $this->Skip = 0;
    $this->Take = 10;
    $this->Count = 0;
    $this->Dtos = array();
    $this->Dto = null;
    $this->Entity = null;
    $this->Performed = false;
    $this->Search = null;
    $this->Order = null;
    $this->Filter = null;
    $this->Properties = null;
    $this->Error = null;
  }

  public function jsonSerialize()
  {
    return [
      'Performed' => $this->Performed,
      'Skip' => $this->Skip,
      'Take' => $this->Take,
      'Count' => $this->Count,
      'Dtos' => $this->Dtos,
      'Dto' => $this->Dto,
      'Entity' => $this->Entity,
      'Search' => $this->Search,
      'Order' => $this->Order,
      'Filter' => $this->Filter,
      'Properties' => $this->Properties,
      'Error' => $this->Error,
    ];
  }
}



class BaseOrder
{
  public $Direction; //: string;
  public $Name; //: string;
}
class TEntity 
{ }

class TDto extends TEntity
{ }

class TFilter extends TDto //implements JsonSerializable
{
}
