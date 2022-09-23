<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class NomeTest extends TestCase
{
    
   
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testExample()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
    
    
    public static function transformXmlStringToJson($xmlStringContents) {
        $xml = new SimpleXMLElement($xmlStringContents);
        $json="";
        foreach ($xml->children('d') as $second_gen) {
        $json= $json.$second_gen;

        foreach ($second_gen->children('oc') as $third_gen) {
            $json= $json.$third_gen;

            foreach ($third_gen->children('nc') as $fourth_gen) {
                echo ' and that ' . $third_gen['role'] .
                    ' begot a ' . $fourth_gen['role'];
            }
    }
}
}
}