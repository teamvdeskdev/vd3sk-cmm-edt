<?php

declare(strict_types=1);

namespace OCA\WorkflowManager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version003Date20191113160903 extends SimpleMigrationStep
{

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function preSchemaChange(IOutput $output, Closure $schemaClosure, array $options)
	{ }

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options)
	{
		//TABLE wf_workflow_logs
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();
		if (!$schema->hasTable('wf_workflow_logs')) {
			$table = $schema->createTable('wf_workflow_logs');
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);

			$table->addColumn('workflow_id', 'string', [
				'notnull' => false
			]);

			$table->addColumn('app_id', 'string', [
				'notnull' => false,
			]);

			$table->addColumn('node_id', 'string', [
				'notnull' => false,
			]);

			$table->addColumn('log_date', 'datetime', [
				'notnull' => false,				
			]);

			$table->addColumn('log_text', 'text', [
				'notnull' => true,			
			]);

			$table->addColumn('user_id', 'string', [
				'notnull' => false,			
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
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options)
	{ }
}
