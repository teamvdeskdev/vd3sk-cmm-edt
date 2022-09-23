<?php
namespace OCA\Wfam\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Controller;

class PraticaWfaFormApprovaController extends Controller {
    private $userId;

    public function __construct($AppName, IRequest $request, $UserId){
        parent::__construct($AppName, $request);
        $this->userId = $UserId;
    }


    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index($object) {
        return new TemplateResponse('wfam', 'content/pratica_wfa_formapprova');
    }

}
