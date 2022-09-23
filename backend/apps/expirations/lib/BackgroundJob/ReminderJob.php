<?php

namespace OCA\Expirations\BackgroundJob;

use OC\BackgroundJob\TimedJob;
use OCA\Expirations\Service\ReminderService;
use OCP\ILogger;

class ReminderJob extends TimedJob{

    private $logger;
    protected $reminderService;

    public function __construct(ReminderService $reminderService, ILogger $logger){
        $this->setInterval(60*15);
        $this->reminderService = $reminderService;
        $this->logger = $logger;
    }

    protected function run($argument){
        $this->logger = \OC::$server->getLogger();
        $this->logger->info("[EXPIRATIONS] Reminder");
        $this->reminderService->checkForReminders();
    }
}
