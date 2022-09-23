<?php

namespace OCA\WorkflowManager\Settings;

use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Settings\IIconSection;

class WorkflowSettingsSection implements IIconSection {

    private $l ;    
    private $url ;

    public function __construct(IURLGenerator $url, IL10N $l)
    {
        $this->l = $l;
        $this->url = $url;        
    }

    public function getID()
    {
        return "workflowmanager";
    }

    public function getName()
    {
        return $this->l->t("WFMANAGER");
    }

    public function getPriority()
    {
        return 10;
    }

    public function getIcon()
    {
        return $this->url->imagePath('workflowmanager','app_gray.svg');
    }
}