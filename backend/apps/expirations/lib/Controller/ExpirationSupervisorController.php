<?php

namespace OCA\Expirations\Controller;

use OCA\Expirations\AppInfo\Application;
use OCA\Expirations\Service\ExpirationSupervisorService;
use OCA\Expirations\Service\ExceptionError;

use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;

class ExpirationSupervisorController extends ApiController {
	/** @var ExpirationSupervisorService */
	private $service;

	/** @var string */
	private $userId;

	use Errors;

	public function __construct(IRequest $request,
								ExpirationSupervisorService $service,
								$userId) {
		parent::__construct(Application::APP_ID, $request);
		$this->service = $service;
		$this->userId = $userId;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function findAll($id_expiration): DataResponse {
		return new DataResponse($this->service->findAll($id_expiration));
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	/*public function show(int $id): DataResponse {
		return $this->handleNotFound(function () use ($id) {
			return $this->service->find($id);
		});
	}*/

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * @throws OCSBadRequestException
	 * @throws OCSForbiddenException
	 */
	public function create($id_expiration, $type_supervisor, $id_supervisor): DataResponse {
		return new DataResponse($this->service->create($id_expiration, $type_supervisor, $id_supervisor));
		
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	/*public function update(int $id, string $label): DataResponse {
		return $this->handleNotFound(function () use ($id, $label) {
			return $this->service->update($id, $label);
		});
	}*/

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function destroy($id_expiration): DataResponse {
		return $this->handleNotFound(function () use ($id_expiration) {
			return $this->service->delete($id_expiration);
		});
	}
}
