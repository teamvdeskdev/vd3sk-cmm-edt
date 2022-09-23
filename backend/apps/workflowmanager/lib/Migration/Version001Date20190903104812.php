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
class Version001Date20190903104812 extends SimpleMigrationStep
{

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function preSchemaChange(IOutput $output, Closure $schemaClosure, array $options)
	{
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options)
	{
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		//TABLE wf_workflow_data
		if (!$schema->hasTable('wf_workflow_data')) {
			$table = $schema->createTable('wf_workflow_data');
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);

			$table->addColumn('app_id', 'string', [
				'notnull' => true,
				'length' => 100,
			]);

			$table->addColumn('note', 'text', [
				'notnull' => false,
			]);

			$table->addColumn('date_time', 'datetime', [
				'notnull' => false,
			]);

			$table->addColumn('workflow_model', 'text', [
				'notnull' => false,
			]);

			$table->addColumn('workflow_objects', 'text', [
				'notnull' => false,
			]);

			$table->addColumn('workflow_logic', 'text', [
				'notnull' => false,
			]);

			$table->addColumn('workflow_svg', 'text', [
				'notnull' => false,
			]);

			$table->addColumn('workflow_id', 'string', [
				'notnull' => true,
				'length' => 50
			]);

			$table->addColumn('workflow_elements', 'text', [
				'notnull' => false,
			]);

			$table->setPrimaryKey(['id']);
			$table->addIndex(['app_id'], 'wfm_app_id_index');
		}

		//TABLE wf_library_models
		if (!$schema->hasTable('wf_library_models')) {
			$table = $schema->createTable('wf_library_models');
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);

			$table->addColumn('app_id', 'string', [
				'notnull' => true,
				'length' => 100,
			]);

			$table->addColumn('model_id', 'string', [
				'notnull' => true,
				'length' => 50
			]);

			$table->addColumn('model', 'text', [
				'notnull' => false,
			]);

			$table->addColumn('model_elements', 'text', [
				'notnull' => false,
			]);

			$table->addColumn('model_name', 'string', [
				'notnull' => true,
				'length' => 50
			]);

			$table->addColumn('model_description', 'string', [
				'notnull' => true,
				'length' => 100
			]);

			$table->setPrimaryKey(['id']);
			$table->addIndex(['app_id'], 'wfm_library_app_id_index');
		}

		//TABLE wf_workflow_engine
		if (!$schema->hasTable('wf_workflow_engine')) {
			$table = $schema->createTable('wf_workflow_engine');
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);

			$table->addColumn('workflow_data_id', 'string', [
				'notnull' => true,
				'length' => 50
			]);

			$table->addColumn('owner_id', 'integer', [
				'notnull' => false				
			]);

			$table->addColumn('workflow_model', 'text', [
				'notnull' => false,
			]);

			$table->setPrimaryKey(['id']);
			$table->addIndex(['workflow_data_id'], 'wfm_library_workflow_data_id');
		}

		return $schema;
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options)
	{
	}
}
