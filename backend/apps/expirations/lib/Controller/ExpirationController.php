<?php
namespace OCA\Expirations\Controller;

use OCA\Expirations\AppInfo\Application;
use OCA\Expirations\Service\ExpirationService;
use OCA\Expirations\Service\ReminderService;
use OCA\Expirations\Db\Expiration;
use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;

class ExpirationController extends ApiController {

	/** @var ExpirationService */
	private $service;

	/** @var ReminderService */
	private $reminderService;


	/** @var string */
	private $userId;

	use Errors;

	public function __construct(IRequest $request,
				ExpirationService $service,
				ReminderService $reminderService,
				$userId) {
		parent::__construct(Application::APP_ID, $request);
		$this->service = $service;
		$this->reminderService = $reminderService;
		$this->userId = $userId;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * 
	 */
	public function index(): DataResponse {
		return new DataResponse($this->service->findAll($this->userId));
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function show(int $id): DataResponse {
		$result = $this->service->find($id);
		if($result){
			return new DataResponse($result);
		}else{
			return new DataResponse(["error" => "Item not found"], Http::STATUS_NOT_FOUND);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function getByVpecEmail(string $email): DataResponse {
		$result = $this->service->getByVpecEmail($email);
		return new DataResponse($result);
		/*if($result){
			return new DataResponse($result);
		}else{
			return new DataResponse(["error" => "Item not found"], Http::STATUS_NOT_FOUND);
		}*/
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function create( string $link_to, int $id_type=-1, string $description=null, string $datetime=null, int $priority=-1, string $mode=null, string $status=null, int $alert_type=-1, string $alert_datetime=null, $assignees = null, $supervisors = null, $is_repeated = false, $repetition_type = null, $extend = 0 ): DataResponse {
		if($is_repeated) {
			return new DataResponse($this->service->bulkAdd( $this->userId, $link_to, $id_type, $description, $datetime, $priority, $mode, $status, $alert_type, $alert_datetime, $assignees, $supervisors, $is_repeated, $repetition_type, $extend));
		} else {
			return new DataResponse($this->service->create( $this->userId, $link_to, $id_type, $description, $datetime, $priority, $mode, $status, $alert_type, $alert_datetime, $assignees, $supervisors, null, $repetition_type));
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function update(int $id, string $link_to, int $id_type, string $description, string $datetime, int $priority, string $mode, string $status, int $alert_type, string $alert_datetime=null, $assignees = null, $supervisors = null, $is_repeated = false, $extend = null) {
		//return $this->handleNotFound(function () use ($id, $link_to, $id_type, $description, $datetime, $priority, $mode, $status, $alert_type, $alert_datetime, $assignees, $supervisors) {
		//	return $this->service->update($id, $link_to, $id_type, $description, $datetime, $priority, $mode, $status, $alert_type, $alert_datetime, $assignees, $supervisors);
		//});
		return new DataResponse( $this->service->update($id, $link_to, $id_type, $description, $datetime, $priority, $mode, $status, $alert_type, $alert_datetime, $assignees, $supervisors, $is_repeated, $extend));
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function destroy(int $id): DataResponse {
		return $this->handleNotFound(function () use ($id) {
			return $this->service->delete($id, $this->userId);
		});
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function updateStatus($id_expiration, $status, $send_mail=null): DataResponse {
		return $this->handleNotFound(function () use ($id_expiration, $status, $send_mail) {
			return $this->service->updateStatus($this->userId, $id_expiration, $status, $send_mail);
		});
	}
	
	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function checkReminders(): DataResponse {
		return new DataResponse($this->reminderService->checkForReminders());
	}

}
