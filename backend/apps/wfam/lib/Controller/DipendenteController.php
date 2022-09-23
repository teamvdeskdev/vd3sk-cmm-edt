<?php

namespace OCA\Wfam\Controller;
use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\Wfam\Service\DipendenteService;


class DIpendenteController extends Controller
{

    private $service;

    use Errors;

    public function __construct($AppName, IRequest $request, DipendenteService $service)
    {
        parent::__construct($AppName, $request);
        $this->service = $service;
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function FindAll($Model)
    {
        $response = $Model;
        $response = $this->service->FindAll($response["Filter"], $response["Search"], $response["Order"]);
        $model["Model"] = $response; 
        return new DataResponse($model);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Read($Model)
    {
        $response = $Model;
        $response = $this->service->find($response["Filter"]);
        $model["Model"] = $response; 
        return new DataResponse($model);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Create($Model)
    {
        $response = $Model;
        $dto = $response["Dto"];
        $response = $this->service->Create($dto);
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
        $dto = $response["Dto"];
        $id = $dto["Id"];

        if (!is_integer($id)) {
            $response['Performed'] = false;        
            $model["Model"] = $response; 
            return new DataResponse($model);
        } else {
            if ((int) $dto["Id"] > 0) {
                $response = $this->service->Update($dto);
                $model["Model"] = $response; 
                return new DataResponse($model);
            } else { //Id = 0
                $response = $this->service->Create($dto);
                $model["Model"] = $response; 
                return new DataResponse($model);
            }
        }
    }
    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Update($Model)
    {
        $response = $Model;
        $dto = $response["Dto"];
        $response = $this->service->Update($dto);
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
        $dto = $response["Dto"];

        $pkey = $dto["Id"];
        if ($pkey) {
            $performed = $this->service->Delete($dto);
            $response['Performed'] = $performed;
            return new DataResponse($response);
        }

        $response['Performed'] = false;
        $model["Model"] = $response; 
        return new DataResponse($model);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Load($Model)
    {
        $response = $Model;
        $response = $this->service->Load($response["Skip"], $response["Take"], $response["Filter"], $response["Search"], $response["Order"]);
        $model["Model"] = $response; 
        return new DataResponse($model);
    }


    // /**

    //  * @NoCSRFRequired
    //  * @NoAdminRequired
    //  *
    //  */
    // public function Count($Model)
    // {
    //     $response = $Model;
    //     $response = $this->service->Count($response["Filter"], $response["Search"]);
    //     return new DataResponse($response);
    // }
}
