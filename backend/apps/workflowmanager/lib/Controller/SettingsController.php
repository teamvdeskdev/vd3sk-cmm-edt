<?php

namespace OCA\WorkflowManager\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Controller;
use OCA\WorkflowManager\Mapper\SettingsMapper;
use OCP\AppFramework\Http\DataResponse;

class SettingsController extends Controller
{
    private $mapper;

    public function __construct($AppName, IRequest $request, SettingsMapper $mapper)
    {
        parent::__construct($AppName, $request);
        $this->mapper = $mapper;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index($object)
    {
        return new TemplateResponse('workflowmanager', 'content/settings');
    }    

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function Load($Model)
    {
        try {
            $response = $this->mapper->Load($Model["Dto"]);
            $Model["Dto"] = $response["Dto"];
            $Model["Performed"] = $response["Performed"];
            $Model["Message"] = $response["Message"];
        } catch (\Exception $ex) {
            $Model["Message"] = $ex->getMessage();
        } finally {
            return new DataResponse($Model);
        }
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function Update($Model)
    {
        try {
            $response = $this->mapper->Save($Model["Dto"]);
            $Model["Dto"] = $response["Dto"];
            $Model["Performed"] = $response["Performed"];
            $Model["Message"] = $response["Message"];
        } catch (\Exception $ex) {
            $Model["Message"] = $ex->getMessage();
        } finally {
            return new DataResponse($Model);
        }
    }
}
