<?php

namespace OCA\Expirations\Controller;

use OCA\Expirations\AppInfo\Application;
use OCA\Expirations\Service\ExpirationVpecService;
use OCA\Expirations\Service\ExceptionError;

use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;

class ExpirationVpecController extends ApiController {

	/** @var ExpirationVpecService */
	private $service;

	/** @var string */
	private $userId;

	use Errors;

	public function __construct(IRequest $request,
					ExpirationVpecService $service,
								$userId) {
		parent::__construct(Application::APP_ID, $request);
		$this->service = $service;
		$this->userId = $userId;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function index(): DataResponse {
		return new DataResponse($this->service->findAll());
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function show(int $id_expiration): DataResponse {
		return $this->handleNotFound(function () use ($id_expiration) {
			return $this->service->find($id_expiration);
		});
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * @throws OCSBadRequestException
	 * @throws OCSForbiddenException
	 */
	public function create(int $id_expiration, int $id_account, string $email, string $id_msg): DataResponse {
		return new DataResponse($this->service->create($id_expiration, $id_account, $email, $id_msg));
		
	}
 


	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function update(int $id_expiration, int $id_account, string $email, string $id_msg): DataResponse {
		return $this->handleNotFound(function () use ($id_expiration, $id_account, $email, $id_msg) {
			return $this->service->update($id_expiration, $id_account, $email, $id_msg);
		});
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function destroy(int $id_expiration): DataResponse {
		return $this->handleNotFound(function () use ($id_expiration) {
			return $this->service->delete($id_expiration);
		});
	}
}
