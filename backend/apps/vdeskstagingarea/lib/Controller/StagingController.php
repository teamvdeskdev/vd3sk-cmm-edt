<?php
namespace OCA\VDeskStagingArea\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\ParsedJSONResponse;
use OCP\AppFramework\Controller;
use OCP\IConfig;
use OCP\IDBConnection;
use OCP\ILogger;

class StagingController extends Controller {
	private $userId;
    protected $db;
    /** @var IConfig */
	protected $config;
    /** @var ILogger */
	protected $logger;

	protected $connection;

	public function __construct($AppName, IRequest $request, IConfig $config, ILogger $logger, IDBConnection $connection, $UserId) {
		parent::__construct($AppName, $request);
        $this->config = $config;
		$this->userId = $UserId;
        $this->logger = $logger;
		$this->connection = $connection;
        $stagingdbname = $this->config->getSystemValue('stagingdbname');
		$stagingdbhost = $this->config->getSystemValue('stagingdbhost');
		$stagingdbport = $this->config->getSystemValue('stagingdbport', "3306");
		$stagingdbuser = $this->config->getSystemValue('stagingdbuser');
		$stagingdbpassword = $this->config->getSystemValue('stagingdbpassword');
		
		$options = [
			\PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
			\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
			\PDO::ATTR_EMULATE_PREPARES   => false,
		];

		try {
			$this->db = new \PDO
					("mysql:host=$stagingdbhost;port=$stagingdbport;dbname=$stagingdbname", $stagingdbuser, $stagingdbpassword, $options);
		} catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
		$this->vdeskDb = $connection;
	}
	
     public function testDBConnection(): ParsedJSONResponse {
        return $this->successResponse("Connessione col DB di staging stabilita con successo");
     }

	 protected function successResponse(string $message, $data = []): ParsedJSONResponse {
		 return new ParsedJSONResponse(["status" => 200, "message" => $message, "data" => $data]);
	 }

	 protected function errorResponse(string $error): ParsedJSONResponse {
		return new ParsedJSONResponse(["status" => 500, "error" => $error]);
	}

}
