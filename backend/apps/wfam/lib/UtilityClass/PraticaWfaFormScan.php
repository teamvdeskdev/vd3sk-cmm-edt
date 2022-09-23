<?php
namespace OCA\Wfam\UtilityClass;

use OCA\Files\Command\Scan;
use Symfony\Component\Console\Output\OutputInterface;

class PraticaWfaFormScan extends Scan implements OutputInterface
{
   
    public function __construct($userManager) {
		
		parent::__construct($userManager);
    }
    
    public function Scan(string $utenteId,string $path, $outputInterface)
    {
       $this->scanFiles($utenteId,$path, $outputInterface);
    }
} 