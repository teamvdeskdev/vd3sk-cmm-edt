<?php
namespace OCA\WorkflowManager\Cron;

use \OCA\WorkflowManager\Service\WorkflowService;
use OCP\AppFramework\Utility\ITimeFactory;
use \OCP\BackgroundJob\TimedJob;

class NotificaRitardi extends TimedJob {

    private $Service;

    public function __construct(ITimeFactory $time, WorkflowService $service) {
        parent::__construct($time);
        $this->Service = $service;
        // Run once an hour (43200 = 12H)
        parent::setInterval(86300);
    }

    public  function run($arguments) {        
         $this->Service->CheckRitardoEsecuzione($arguments);
    }

}