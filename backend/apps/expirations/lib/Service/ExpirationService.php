<?php
namespace OCA\Expirations\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Expirations\Db\Expiration;
use OCA\Expirations\Db\ExpirationMapper;
use OCA\Expirations\Db\ExpirationAssignee;
use OCA\Expirations\Db\ExpirationAssigneeMapper;

class ExpirationService {

	/** @var ExpirationMapper */
	private $mapper;

	private $asService;
	private $ssService;
	private $alertService;
	private $communicationService;
	
	public function __construct(ExpirationMapper $mapper, ExpirationAssigneeService $assigneeService, 
							    ExpirationSupervisorService $supervisorService,
							    ExpirationAlertService $alertService,
								CommunicationService $communicationService ) {
		$this->mapper = $mapper;
		$this->asService = $assigneeService;
		$this->ssService = $supervisorService;
		$this->alertService = $alertService;
		$this->communicationService = $communicationService;
	}

	
	public function findAll(string $userId): array {
		$result = array();
		$expirations = $this->mapper->findAll($userId);
		$expiration["assignees"] = array();
		$expiration["supervisors"] = array();
		foreach ($expirations as $expiration) {
			$expId = $expiration["id"];
			$expiration["assignees"] = $this->asService->findAll($expId);
			$expiration["supervisors"] = $this->ssService->findAll($expId);
			array_push($result, $expiration);
		}
		return $result;
	}

	private function handleException(Exception $e): void {
		if ($e instanceof DoesNotExistException ||
			$e instanceof MultipleObjectsReturnedException) {
			throw new ExceptionError($e->getMessage());
		} else {
			throw new ExceptionError(); //$e; 
		}
	}

	public function find($id) {
		try{
			$expiration = $this->mapper->find($id);

			if(count($expiration)>0){
				$expId = $expiration["id"];
				$expiration["assignees"] = $this->asService->findAll($expId);
				$expiration["supervisors"] = $this->ssService->findAll($expId);

				return $expiration;
			}else{
				throw new ExceptionError();				
			}

			
		}catch (Exception $e) {
			$this->handleException($e);
		}
	}

	public function getByVpecEmail(string $email): array {
		$result = array();
		$expirations = $this->mapper->getByVpecEmail($email);
		$expiration["assignees"] = array();
		$expiration["supervisors"] = array();
		foreach ($expirations as $expiration) {
			$expId = $expiration["id"];
			$expiration["assignees"] = $this->asService->findAll($expId);
			$expiration["supervisors"] = $this->ssService->findAll($expId);
			array_push($result, $expiration);
		}
		return $result;
	}

	public function findByAlert(int $alertType, $alertDatetime=null): array {
		$result = array();
		$expirations = $this->mapper->findByAlert($alertType, $alertDatetime);
		$expiration["assignees"] = array();
		$expiration["supervisors"] = array();
		foreach ($expirations as $expiration) {
			$expId = $expiration["id"];
			$expiration["assignees"] = $this->asService->findAll($expId);
			$expiration["supervisors"] = $this->ssService->findAll($expId);
			array_push($result, $expiration);
		}
		return $result;
	}

	public function findCreatedAndExpired(): array {
		$result = array();
		$expirations = $this->mapper->findCreatedAndExpired();
		$expiration["assignees"] = array();
		$expiration["supervisors"] = array();
		foreach ($expirations as $expiration) {
			$expId = $expiration["id"];
			$expiration["assignees"] = $this->asService->findAll($expId);
			$expiration["supervisors"] = $this->ssService->findAll($expId);
			array_push($result, $expiration);
		}
		return $result;
	}

	public function create(string $userId, string $link_to, int $id_type=-1, string $description=null, string $datetime=null, int $priority=-1, string $mode=null, string $status=null, int $alert_type=-1, string $alert_datetime=null, $assignees = null, $supervisors = null, $group_string = null, $repetition_type = null) {
		$item = new Expiration();
		$item->setUidOwner($userId);
		$item->setLinkTo($link_to);
		$item->setIdType($id_type);
		$item->setDescription($description);
		$item->setDatetime($datetime);
		$item->setPriority($priority);
		$item->setAlertType($alert_type);
		$item->setAlertDatetime($alert_datetime);
		$item->setMode($mode);
		$item->setStatus($status);
		$item->setRepetitionGroup($group_string);
		$item->setRepetitionType($repetition_type);
		$result = $this->mapper->insert($item);

		foreach($assignees as $idAssignee){
			$this->asService->create($result->id, $idAssignee);
		}

		foreach($supervisors as $supervisor){
			$this->ssService->create($result->id, $supervisor['type'], $supervisor['id']);
		}
		return $result;
	}

	public function bulkAdd($userId, $link_to, $id_type, $description, $datetime, $priority, $mode, $status, $alert_type, $alert_datetime, $assignees, $supervisors, $is_repeated, $repetition_type, $extend ) {
		$permitted_chars = '$*-?%abcdefghijklmnopqrstuvwxyz';
		$group_name = substr(str_shuffle($permitted_chars), 0, 10);
		$nDays = new \DateTime($datetime);
		$toReturn = ["message" => "empty"];
		for ($i=0; $i < $extend; $i++) { 
			$monthOrYear = null;
			if($repetition_type == "monthly") $monthOrYear = "months";
			if($repetition_type == "yearly") $monthOrYear = "years";
			$datetime = new \DateTime($datetime);
			$lastDay = $nDays->format('t');
			$selectedDay = $nDays->format('d');

			if($lastDay == $selectedDay && $i > 0 && $monthOrYear == 'months'){
				$datetime->modify('+1 day');
				$datetime = $datetime->format('Y-m-t H:i:s');

			} else {
				if($monthOrYear == 'months' && $i > 0) {
					$year = $datetime->format('Y');
					$month = $datetime->format('m');
					$storedDay = $nDays->format('d');
					$toStoreDay = $storedDay;
					$firstOfMonth = $datetime->setDate($year, $month, 1);
					$firstOfMonth = $firstOfMonth->modify('+1 month');
					$yearNextMonth = $firstOfMonth->format('Y');
					$monthNext = $firstOfMonth->format('m');
					$monthDays = $firstOfMonth->format('t');
					if($monthDays < $storedDay) $toStoreDay = $monthDays; 
					$datetime = $firstOfMonth->setDate($yearNextMonth, $monthNext, $toStoreDay);
				} 
				$datetime = $datetime->format('Y-m-d H:i:s');
			}

			$newDateTime = date('Y-m-d H:i:s', strtotime($datetime . ($monthOrYear == 'years' ? " + $i $monthOrYear" : "")));
			$newAlertTime = date('Y-m-d H:i:s', strtotime($alert_datetime . ($monthOrYear == 'years' ? " + $i $monthOrYear" : "")));
			$toReturn = $this->create( $userId, $link_to, $id_type, $description, $newDateTime, $priority, $mode, $status, $alert_type, $newAlertTime, $assignees, $supervisors, $group_name, $repetition_type);
		}

		return $toReturn;

	}

	public function update($id, $link_to, $id_type, $description, $datetime, $priority, $mode, $status, $alert_type, $alert_datetime, $assignees, $supervisors) {
		$itemRow = $this->mapper->find($id);
		if(count($itemRow)==0){
			throw new ExceptionError();
			return;
		}
		if($itemRow['repetition_group']) {
			$this->updateByGroup($itemRow, $link_to, $id_type, $description, $datetime, $priority, $mode, $status, $alert_type, $alert_datetime, $assignees, $supervisors, $is_repeated, $repetition_type, $extend);
			return $itemRow;
		} else {
			$item = new Expiration();
			$item->setId($itemRow['id']);
			$item->setLinkTo($link_to);
			$item->setIdType($id_type);
			$item->setDescription($description);
			$item->setDatetime($datetime);
			$item->setPriority($priority);
			$item->setAlertType($alert_type);
			$item->setAlertDatetime($alert_datetime);
			$item->setMode($mode);
			$item->setStatus($status);
			/* if($is_repeated === false) $item->setRepetitionGroup(null); */ 
			$item->setRepetitionType($repetition_type);
			$updateResult = $this->mapper->update($item);
			if($updateResult->id){
				$this->asService->delete($updateResult->id);
				foreach($assignees as $idAssignee){
					$this->asService->create((int)$updateResult->id, $idAssignee);
				}
	
				$this->ssService->delete($updateResult->id);
				foreach($supervisors as $supervisor){
					$this->ssService->create((int)$updateResult->id, (int)$supervisor['type'], $supervisor['id']);
				}
			}
			return $updateResult;
		}

	}

	public function updateByGroup($itemRow,$link_to, $id_type, $description, $datetime, $priority, $mode, $status, $alert_type, $alert_datetime, $assignees, $supervisors, $is_repeated, $repetition_type, $extend) {
		$items = $this->mapper->findByGroupId($itemRow['repetition_group']);

		//if user wants to extend expirations for a total of months/years in extend
		if($extend && count($items)) { 
			$itemToExtend = $items[count($items) -1];
			$datetimeToChange = $itemToExtend['datetime'];
			$alertDateTimeToChange = $itemToExtend['alert']['datetime'];

			for ($i=1; $i < (int)$extend+1; $i++) {
				$monthOrYear = null;
				if($repetition_type == "monthly") $monthOrYear = "months";
				if($repetition_type == "yearly") $monthOrYear = "years";

				$newDateTime = new \DateTime($datetimeToChange);
				$newDateTime = $newDateTime->modify("+$i $monthOrYear")->format('Y-m-d H:i:s');
				$newAlertTime = new \DateTime($alertDateTimeToChange);
				$newAlertTime = $newAlertTime->modify("+$i $monthOrYear")->format('Y-m-d H:i:s');
				$this->create( $itemRow['owner_id'], $link_to, $id_type, $description, $newDateTime, $priority, $mode, $status, $alert_type, $newAlertTime, $assignees, $supervisors, $itemToExtend['repetition_group'], $repetition_type);
			}
		}

		//update all group
		foreach ($items as $itemToUpdate) {
			//check if user did set repeated as false
			if((int)$itemToUpdate['id'] > $itemRow['id'] && $is_repeated === false) {//if unchecked repeated expiration delete all of the expirations next to the selected id
				$toDelete = new Expiration();
				$toDelete->id = $itemToUpdate['id'];
				$this->mapper->delete($toDelete);
			} else {
				//update all the same group id expirations
				$item = new Expiration();
				$item->setId($itemToUpdate['id']);
				$item->setLinkTo($link_to);
				$item->setIdType($id_type);
				$item->setDescription($description);
				$item->setPriority($priority);
				$item->setAlertType($alert_type);
				$item->setMode($mode);
				$item->setStatus($status);
				$item->setRepetitionType($repetition_type);
				if($is_repeated === false) $item->setRepetitionGroup(null); 
	
				$updateResult = $this->mapper->update($item);
				if($updateResult->id){
					$this->asService->delete($updateResult->id);
					foreach($assignees as $idAssignee){
						$this->asService->create((int)$updateResult->id, $idAssignee);
					}
	
					$this->ssService->delete($updateResult->id);
					foreach($supervisors as $supervisor){
						$this->ssService->create((int)$updateResult->id, (int)$supervisor['type'], $supervisor['id']);
					}
				}
			}
		}

	}

	public function delete($id, $userId) {
		try {
			$item = $this->mapper->find($id, $userId);

			if($item['repetition_group']) {
				$items = $this->mapper->findByGroupId($item['repetition_group']);
				
				foreach ($items as $itemToUpdate) {
					if((int)$itemToUpdate['id'] >= $item['id']) {
						$toDelete = new Expiration();
						$toDelete->id = $itemToUpdate['id'];
						$this->mapper->delete($toDelete);
					}
				}
				
				return $item;
			} else {

				if($item==[]){
					throw new ExceptionError();
				}
				$toDelete = new Expiration();
				$toDelete->id = $item['id'];
				
				$this->mapper->delete($toDelete);
				return $item;
			}
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}


	public function updateStatus($userId, $id, $status, $send_mail) {
		try {
			$rows = $this->mapper->updateStatus($id, $status);
			if($rows==0){
				throw new ExceptionError();
			}

			$expiration = $this->find($id);
			
		} catch (Exception $e) {
			$this->handleException($e);
		}

		try {
			if(!is_null($send_mail)){
				$title = "Attività risolta";
				foreach($send_mail as $toEmail){
					$this->communicationService->sendMail($toEmail, $title, $expiration);	
				}
			}
		} catch (\Throwable $th) {
			$logger = \OC::$server->getLogger();
			$logger->info("Error sending email: ".$th->getMessage());
		}
		
		return $expiration;
	}

	public function hasSentAlert(int $idExpiration, string $alertDatetime, string $notifyTo){
		return $this->alertService->has($idExpiration, $alertDatetime, $notifyTo);
	}

	public function setSentAlert(int $idExpiration, string $alertDatetime, string $notifyTo){
		return $this->alertService->insert($idExpiration, $alertDatetime, $notifyTo);
	}

	public function getAllGroupExpirations($groupId) {
		return $this->mapper->findByGroupId($groupId);
	}
}
