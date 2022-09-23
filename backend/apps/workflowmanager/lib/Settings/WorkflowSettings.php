<?php

namespace OCA\WorkflowManager\Settings;

use OCP\IRequest;
use OCA\WorkflowManager\Mapper\SettingsMapper;
use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Settings\ISettings;

class WorkflowSettings implements ISettings
{
    private $mapper;
    /** @var IL10N */
    private $l;

    /** @var IURLGenerator */
    private $urlGenerator;
    public function __construct(IL10N $l, IURLGenerator $urlGenerator, SettingsMapper $mapper)
    {
        $this->mapper = $mapper;
        $this->l = $l;
        $this->urlGenerator = $urlGenerator;
    }

    public function getSection()
    {
        return "workflowmanager";
    }

    public function getForm()
    {
        // $model=array("Performed"=>false,"Dto"=>[
        //     'username'=>'',
        //     'password'=>'',
        //     'enable_sap' => false,
        //     'sap_service_url' => '',
        //     'sap_authentication' => 'NONE',
        //     'sap_username' => '',
        //     'sap_password' => '',
        //     'progressive_service_url' => '',
        //     'progressive_service_username' => '',
        //     'progressive_service_password' => '',
        //     'progressive_service_authentication' => 'NONE',

        // ]);
        // $model=$this->Load($model);
        return new TemplateResponse('workflowmanager', 'content/settings',["Model"=>$model]);
    }

    public function getPriority()
    {
        return 0;
    }
}
