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
class Version1000Date20220825065045 extends SimpleMigrationStep {

	//simonefase3

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
        //CREATE "wfam_pratica_gruppo_ruolo" TABLE
        if (!$schema->hasTable('wfam_pratica_gruppo_ruolo')) {
            $table = $schema->createTable('wfam_pratica_gruppo_ruolo');
            $table->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $table->addColumn('pratica_wfa_id', 'integer', [
                'notnull' => true,
            ]);
			$table->addColumn('ruolo_wfa_id', 'integer', [
                'notnull' => true,
            ]);
			$table->addColumn('group_name', 'string', [
                'notnull' => true,
                'length' => 200,
            ]);
			$table->addColumn('active', 'boolean', [
                'notnull' => true
            ]);
            $table->setPrimaryKey(['id']);
        }
		return $schema;
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options) {
	}
}
