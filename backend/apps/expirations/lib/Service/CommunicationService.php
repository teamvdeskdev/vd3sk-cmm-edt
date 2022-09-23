<?php
namespace OCA\Expirations\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCP\Mail\IMailer;
use OCA\VdeskIntegration\Service\UsersService;
use OCA\VdeskIntegration\Helper\VDeskUtils;

class CommunicationService {


	/** @var UsersService */
	protected $usersService;

	/** @var ILogger */
	private $logger;

	/** @var IMailer */
    private $mailer;
	
	public function __construct(
			UsersService $usersService,
			IMailer $mailer) {

		$this->usersService = $usersService;
		$this->mailer = $mailer;
		$this->logger = \OC::$server->getLogger();
	}



	public function sendMail($toEmail, $title, $expiration){
        
        $this->logger->info("Sending email to ". $toEmail);
        
        try {
            $template = $this->mailer->createEMailTemplate('expirations.RemiderEmail', []);
    
            $template->setSubject("Reminder: ". $title);
            $template->addHeader();
            $template->addHeading($title);

            $template->addBodyText("Scadenza: " . $expiration["datetime"] );
            $template->addBodyText("Tipologia scadenza: " . $expiration["type"]["label"] );
            $template->addBodyText("Descrizione scadenza: " . $expiration["description"] );
            //$template->addBodyText("Priorità : MEDIA");

            $template->addBodyText("Assegnatari");
            $assignees = $expiration["assignees"];
            foreach($assignees as $assignee){
                $displayName = $this->getUserDisplayName($assignee["id_assignee"], true);
                if($displayName==""){
                    $displayName = $this->getUserDisplayName($assignee["id_assignee"], false);
                }
                $template->addBodyListItem($displayName);
            }

            
            $supervisors = $expiration["supervisors"];
            if(count($supervisors) > 0){
                $template->addBodyText("Responsabili");
                foreach($supervisors as $supervisor){
                    $displayName = $this->getUserDisplayName($supervisor["id_supervisor"], true);
                    if($displayName==""){
                        $displayName = $this->getUserDisplayName($supervisor["id_supervisor"], false);
                    }
                    $template->addBodyListItem($displayName);
                }
            }
                    
            $template->addFooter();
    
            $message = $this->mailer->createMessage();
            $message->setTo([$toEmail => $toEmail]);
            $message->useTemplate($template); 
            $errors = $this->mailer->send($message);
            if (!empty($errors)) {
                throw new \RuntimeException('Email could not be sent. Check your mail server log');
            }
            
        } catch (\Exception $e) {
            $this->logger->info("Error sending mail: " . $e->getMessage());
        }
        
    }	

	
	private function getUserDisplayName($idUser, $saml){
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
                        $result = $user->displayName;
                    }
                }
            } else {
                throw new \Exception("Format error in service response.", 600);
            }
        } catch (\Throwable $th) {
            $this->logger->info("Error getting user email: ".$th->getMessage());
        }
        return $result;
    }
}
