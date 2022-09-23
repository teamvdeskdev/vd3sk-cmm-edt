<?php

namespace OCA\Expirations\Service;

use OCP\Notification\IManager;
use OCP\AppFramework\Utility\ITimeFactory;
use OCA\VdeskIntegration\Service\UsersService;
use OCA\VdeskIntegration\Helper\VDeskUtils;
use OCP\Mail\IMailer;

abstract class ReminderType{
    const SINGLE = 0;
    const DAILY = 1;
    const WEEKLY = 2;
}


class ReminderService{

    private static $TAG = "EXPIRATIONS";

    private static $REMINDER_DAILY_HOUR = "03:00";
    private static $REMINDER_WEEKLY_DAY = 7;
    private static $REMINDER_TITLE = "Attività in scadenza";
    private static $REMINDER_TITLE_EXPIRED = "Attività scaduta";
    
    /** @var IMailer */
    private $mailer;

    /** @var ITimeFactory */
    protected $timeFactory;
    
    /** @var IManager */
    protected $notificationManager;

    /** @var UsersService */
    protected $usersService;

    /** @var CommunicationService */
    protected $communicationService;

    /** @var ILogger */
    private $logger;

    private $apiLog;

    public function __construct(ExpirationService $expirationService, 
                                IMailer $mailer,
                                ITimeFactory $timeFactory, 
                                IManager $notificationManager, 
                                UsersService $usersService,
                                CommunicationService $communicationService) {

        $this->expirationService = $expirationService;
        $this->notificationManager = $notificationManager;
        $this->timeFactory = $timeFactory;
        $this->usersService = $usersService;
        $this->communicationService = $communicationService;
        $this->logger = \OC::$server->getLogger();
        $this->mailer = $mailer;
    }

    private function log($message){
        $text = "[".ReminderService::$TAG."] ".$message;
        array_push($this->apiLog, $text);
        $this->logger->info($text);
    }

    public function checkForReminders(){
        $this->apiLog = [];
        $this->log("Searching for reminders..");
        
        //TODO: verificare timezone
        $now = new \DateTime();
        $nowHour = $now->format('H');
        $nowDay = $now->format('N');

        $dailyDateHour = new \DateTime(ReminderService::$REMINDER_DAILY_HOUR);
        $dailyHour = $dailyDateHour->format('H');

        if($nowHour==$dailyHour && $nowDay==ReminderService::$REMINDER_WEEKLY_DAY){
            $this->send(ReminderType::WEEKLY, $now);
        }
        
        if($nowHour==$dailyHour){
            $this->send(ReminderType::DAILY, $now);
        }
        $this->send(ReminderType::SINGLE, $now);

        $result = $this->apiLog;
        $this->apiLog = [];
        return $result;
    }

    private function send(int $reminderType, \Datetime $reminderDatetime=null){
        switch($reminderType){
            
            case ReminderType::SINGLE:
                $nowMinute = $reminderDatetime->format('i');
                $datetimeToSearch;
                if($nowMinute >= 0 && $nowMinute<30){
                    $datetimeToSearch = $reminderDatetime->format('Y-m-d H:00:00');
                }else{
                    $datetimeToSearch = $reminderDatetime->format('Y-m-d H:30:00');
                }
                $this->log("ReminderType SINGLE: Searching reminder (".$datetimeToSearch.")");
                
                $result = $this->expirationService->findByAlert(ReminderType::SINGLE, $datetimeToSearch);
                foreach($result as $expiration){
                    $this->processExpiration($expiration, $datetimeToSearch); 
                }
                break;

            case ReminderType::DAILY:
                $this->log("ReminderType DAILY");
                
                $result = $this->expirationService->findCreatedAndExpired();
                $this->log("Expired and not solved: ". json_encode($result));
                foreach($result as $expiration){
                    $this->processExpiration($expiration, $reminderDatetime->format('Y-m-d H:00:00'));
                }

                $result = $this->expirationService->findByAlert(ReminderType::DAILY);
                foreach($result as $expiration){
                    $this->processExpiration($expiration, $reminderDatetime->format('Y-m-d H:00:00'));
                }
                break;

            case ReminderType::WEEKLY:
                $this->log("ReminderType WEEKLY");
                
                $result = $this->expirationService->findByAlert(ReminderType::WEEKLY);
                foreach($result as $expiration){
                    $this->processExpiration($expiration, $reminderDatetime->format('Y-m-d H:00:00'));
                }
                break;
        }

    }

    private function processExpiration($expiration, string $datetime, bool $force=false){
        $assignees = $expiration["assignees"];
        foreach($assignees as $assignee){
            $this->process($expiration, $datetime, $assignee["id_assignee"], $force);
        }
        $supervisors = $expiration["supervisors"];
        foreach($supervisors as $supervisor){
            $this->process($expiration, $datetime, $supervisor["id_supervisor"], $force);
        }
    }

    private function process($expiration, string $alertDatetime, string $userId, bool $force=false){
        $this->log("Processing ".$userId. " - ".$alertDatetime);
        
        $expId = $expiration["id"];
  	    $hasSent = $this->expirationService->hasSentAlert($expId, $alertDatetime, $userId);
        
        if(!$hasSent or $force){
            $this->log("Sending to ".$userId);
            
            $reminderTitle = $this->getReminderTitle($expiration);
            $reminderDescription = $this->getReminderDescription($expiration);

            //VDESK NOTIFICATION
            $this->notify($userId, $reminderTitle, $reminderDescription);
        
            //EMAIL
            $userEmail = $this->getUserEmail($userId, true);
            if($userEmail==""){
                $userEmail = $this->getUserEmail($userId, false);
            }
            $title = $this->getReminderTitle($expiration);
            $this->log("Sending email to ". $userEmail);
            $this->communicationService->sendMail($userEmail, $title, $expiration);

            //TODO: verificare valori di ritorno di notify e sendMail prima di setSentAlert
            //set to sent
            if(!$hasSent){
                $this->expirationService->setSentAlert($expId, $alertDatetime, $userId);
            }
            
        }else{
            $this->log("Already sent to ".$userId);
        }
    }

    private function getReminderTitle($expiration) : string{
        $expDatetime = new \Datetime($expiration["datetime"]);
        $isExpired = $expDatetime < new \Datetime(); 
        return $isExpired? ReminderService::$REMINDER_TITLE_EXPIRED : ReminderService::$REMINDER_TITLE;   //"Attività scaduta" : "Attività in scadenza";
    }

    private function getReminderDescription($expiration): string{
        return "[".$expiration["datetime"]."] ". $expiration["type"]["label"] . ": ". $expiration["description"];
    }

    private function notify(string $userId, string $shortMessage, string $longMessage = '', string $link = '') {
        $this->log("Sending notification to ". $userId);
        
        $notification = $this->notificationManager->createNotification();
        $time = $this->timeFactory->getTime();
        $datetime = new \DateTime();
        $datetime->setTimestamp($time);

        try {
            if ($link!="")
            {
                $notification->setApp('admin_notifications')
                    ->setUser($userId)
                    ->setDateTime($datetime)
                    ->setObject('admin_notifications', dechex($time))
                    ->setSubject('ocs', [$shortMessage])
                    ->setLink($link);
            }
            else
            {
                $notification->setApp('admin_notifications')
                    ->setUser($userId)
                    ->setDateTime($datetime)
                    ->setObject('admin_notifications', dechex($time))
                    ->setSubject('ocs', [$shortMessage]);
            }

            if ($longMessage !== '') {
                $notification->setMessage('ocs', [$longMessage]);
            }

            $this->notificationManager->notify($notification);
            
        } catch (\InvalidArgumentException $e) {
            $this->log("Error sending notification: ".$e->getMessage());
        }
    }
 
    private function getUserEmail($idUser, $saml){
        $result = "";
        try {
            $params = [
                "active" => true,
                "skip" => 0,
                "take" => 9999999999999,
                "search" => $idUser
            ];
            if($saml){
                $params["samlOnly"] = true;
            }
	        if (is_array($params)) {
                $params = VDeskUtils::ToObject($params);
                if (property_exists($params, '_route')) {
                    unset($params->_route);
                }
            }

            $users = $this->usersService->getUsers($params);
            if ($users instanceof \Throwable)
                throw $users;
            if (is_array($users)) {
                foreach($users as $user){
                    if($user->uid==$idUser){
                        $result = $user->emailAddress;
                    }
                }
            } else {
                throw new \Exception("Format error in service response.", 600);
            }
        } catch (\Throwable $th) {
            $this->log("Error getting user email: ".$th->getMessage());
        }
        return $result;
    }

}
