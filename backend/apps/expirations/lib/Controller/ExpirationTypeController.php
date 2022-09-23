<?php

namespace OCA\Expirations\Controller;

use OCA\Expirations\AppInfo\Application;
use OCA\Expirations\Service\ExpirationTypeService;
use OCA\Expirations\Service\ExceptionError;

use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;

class ExpirationTypeController extends ApiController {
	/** @var ExpirationTypeService */
	private $service;

	/** @var string */
	private $userId;

	use Errors;

	public function __construct(IRequest $request,
					ExpirationTypeService $service,
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
		return new DataResponse($this->service->findAll($this->userId));
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function show(int $id): DataResponse {
		return $this->handleNotFound(function () use ($id) {
			return $this->service->find($id);
		});
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * @throws OCSBadRequestException
	 * @throws OCSForbiddenException
	 */
	public function create(string $label=null): DataResponse {
		return new DataResponse($this->service->create($this->userId, $label));
		
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function update(int $id, string $label): DataResponse {
		return $this->handleNotFound(function () use ($id, $label) {
			return $this->service->update($id, $label);
		});
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
}
