<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\App;
use GuzzleHttp\Client;

class GuzzleClientTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testExample()
    {
        $service=App::make('\App\Interfaces\ClientInterface');
        for ($i=0;$i<274;$i++)
        {
            $response = $service->request('GET','https://www.hqf.it/prodotti/page/'.$i.'/');
            
            $dom = new \DOMDocument;
                @$dom->loadHTML($response->getBody());
                $src="";
                //retrive token by field data-requesttoken in head 
                $allheads = $dom->getElementsByTagName('img');
                foreach($allheads as $aheads)
                {
                    $heads = $aheads->attributes;
                    foreach($heads as $head)
                    {
                       
                        if ($head->nodeName=='src')
                        {
                            $url=$head->nodeValue;
                            
                           $file_name = basename($url); 
                           $file = str_replace('-1','', $file_name);
                            if (strpos($url,'/',0)>0)
                            {
                                if (strpos($file_name,'HQF')!==false) 
                                {
 
                                         if(file_put_contents( $file,file_get_contents($url))) { 
                                             echo "K"; 
                                         } 
                                         else { 
                                             echo "-"; 
                                         } 

                                }
                            }
  

                        }
                    }
                }
        }
        $this->assertEquals(200, $response->getStatusCode());
        
    }
    
    public function testExample1()
    {
        $response=\App\Facades\APIClient::request('GET','http://64.225.4.119/index.php/csrftoken');
         
        $this->assertEquals(200, $response->getStatusCode());
    }
}
