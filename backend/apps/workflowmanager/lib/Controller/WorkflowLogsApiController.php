<?php

namespace OCA\WorkflowManager\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\ApiController;

use OCA\WorkflowManager\Service\WorkflowLogsService;


class WorkflowLogsApiController extends ApiController
{

    private $service;
    private $userId ;

    use Errors;

    public function __construct($AppName, IRequest $request, WorkflowLogsService $service,$userId)
    {
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->userId = $userId ;
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

    // /**

    //  * @NoCSRFRequired
    //  * @NoAdminRequired
    //  *
    //  */
    // public function Delete($Model)
    // {
    //     $response = $Model;
    //     $dto = $response["Dto"];
    //     $response = $this->service->Delete($dto);
    //     $model["Model"] = $response; 
    //     return new DataResponse($model);        
    // }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Create($Model)
    {
        $response = $Model;        
        $response = $this->service->Create($response);
        $model["Model"] = $response; 
        return new DataResponse($model);
    }  

}
