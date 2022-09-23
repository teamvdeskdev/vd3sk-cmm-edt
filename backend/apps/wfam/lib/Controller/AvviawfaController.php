<?php
namespace OCA\Wfam\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Controller;

class AvviawfaController extends Controller {
    private $userId;

    public function __construct($AppName, IRequest $request, $UserId){
        parent::__construct($AppName, $request);
        $this->userId = $UserId;
    }


    /**
     *
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index($object) {        
        return new TemplateResponse('wfam', 'content/avvia_wfa');
    }

     /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function view($object) {
        return new TemplateResponse('wfam', 'content/apps_wfa');
    }

}
