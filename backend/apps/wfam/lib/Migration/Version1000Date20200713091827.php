<?php

declare(strict_types=1);

namespace OCA\Wfam\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version1000Date20200713091827 extends SimpleMigrationStep {

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function preSchemaChange(IOutput $output, Closure $schemaClosure, array $options) {
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();
		//TABLE wf_workflow_data
		if ($schema->hasTable('wfam_ruolo_pratica_wfa')) {
			//Alter table with new field "close"
			$table = $schema->getTable('wfam_ruolo_pratica_wfa');
			$table->addColumn('nome_utente', 'text', [				
				'notnull' => false                                
			]);
			$table->addColumn('groups', 'string', [
                'notnull' => false,
                'length' => 500,
            ]);
		}

		if ($schema->hasTable('wfam_pratica_wfa')) {
			//Alter table with new field "close"
			$table = $schema->getTable('wfam_pratica_wfa');
			$table->addColumn('data_delibera', 'datetime', [
                'notnull' => false,
            ]);
		}
		
		
		return $schema ;		
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options) {
	}
}
