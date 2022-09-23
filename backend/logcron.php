<?php 
require_once __DIR__ . '/lib/versioncheck.php';

try {

    require_once __DIR__ . '/lib/base.php';
    $logger = \OC::$server->getLogger();
    $config = \OC::$server->getConfig();
    $serverip = $config->getSystemValue('SERVERNAME', \OC::$SERVERROOT);
       
    $one_day_ago = date('Y-m-d', strtotime("-1 day"));
    $path_one_day_ago = $config->getSystemValue('logdirectory', \OC::$SERVERROOT).'/VDESK.STDAPPL.1.1.'.$serverip.".".$one_day_ago.'_00-00.STANDARD-10.log';
    $logger->debug($path_one_day_ago);
    if (!file_exists($path_one_day_ago)) {
      
      $contents = '###EMPTY###';           // Some simple example content.
      file_put_contents($path_one_day_ago, $contents); 
      echo "verifica LogCollector ok creazione file vuoto \n";
      $logger->debug("verifica LogCollector ok creazione file vuoto");
    }
    else{
      echo "verifica LogCollector ok file già presente \n";
      $logger->debug("verifica LogCollector ok file già presente");
    }	
    echo "VDESK.STDAPPL.1.1.".$serverip.".".$one_day_ago."_00-00.STANDARD-10.log \n";

    exit();

} catch (Exception $ex) {
  echo $ex;
  exit();
}  