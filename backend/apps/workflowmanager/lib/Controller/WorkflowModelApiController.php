<?php

namespace OCA\WorkflowManager\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\ApiController;

use OCA\WorkflowManager\Service\WorkflowModelService;


class WorkflowModelApiController extends ApiController
{

    private $service;

    use Errors;

    public function __construct($AppName, IRequest $request, WorkflowModelService $service)
    {
        parent::__construct($AppName, $request);
        $this->service = $service;
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Read($Model)
    {
        $response = $Model;
        $response = $this->service->Read($response["Filter"]);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function Get($Model)
    {
        $response = $Model;
        $response = $this->service->Get($response["Filter"]);
        $model["Model"] = $response;
        return new DataResponse($model);
    }


    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Delete($Model)
    {
        $response = $Model;
        $dto = $response["Workflow"];
        $response = $this->service->Delete($dto);
        $model["Model"] = $response; 
        return new DataResponse($model);        
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function CreateOrUpdate($Model)
    {
        $response = $Model;        
        $response = $this->service->CreateOrUpdate($response);
        $model["Model"] = $response; 
        return new DataResponse($model);
    }  

}
