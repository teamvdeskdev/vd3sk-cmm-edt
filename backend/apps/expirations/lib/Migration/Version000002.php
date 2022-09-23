<?php

declare(strict_types=1);

namespace OCA\Expirations\Migration;

use Closure;
use Doctrine\DBAL\Types\Type;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;

class Version000002 extends SimpleMigrationStep {

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();


		
		/** EXPIRATION **/
		if (!$schema->hasTable('expiration')) {
			$table = $schema->createTable('expiration');
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);
			$table->addColumn('uid_owner', 'string', [			
				'notnull' => true
			]);
			$table->addColumn('link_to', 'string', [			
				'notnull' => true
			]);
			$table->addColumn('id_type', 'integer', [			
				'notnull' => false
			]);
			$table->addColumn('description', 'string', [			
				'notnull' => false,
				'length' => 256,
				'default' => '',
			]);
			$table->addColumn('datetime', "datetime", [			
				'notnull' => false
			]);
			$table->addColumn('priority', 'integer', [								
				'notnull' => false,
				'default' => 0,
			]);
			$table->addColumn('alert_type', 'integer', [							
				'notnull' => false,
				'default' => 0,
			]);
			$table->addColumn('alert_datetime', 'datetime', [			
				'notnull' => false
			]);
			$table->addColumn('mode', 'string', [			
				'notnull' => false
			]);
			$table->addColumn('status', 'string', [			
				'notnull' => false
			]);
			$table1->addColumn('repetition_group', 'string', [			
				'notnull' => false
			]);
			$table1->addColumn('repetition_type', 'string', [			
				'notnull' => false
			]);
			$table->setPrimaryKey(['id']);
		}else{
			$table = $schema->getTable('expiration');
			$table->changeColumn('id_type', array('notnull' => false));
			$table->changeColumn('description', array('notnull' => false));
			$table->changeColumn('datetime', array('notnull' => false));
			$table->changeColumn('priority', array('notnull' => false));
			$table->changeColumn('alert_type', array('notnull' => false));
			$table->changeColumn('alert_datetime', array('notnull' => false));
			$table->changeColumn('mode', array('notnull' => false));
			$table->changeColumn('status', array('notnull' => false));
			$table->changeColumn('repetition_group', array('notnull' => false));
			$table->changeColumn('repetition_type', array('notnull' => false));

		}


		/** EXPIRATION-TYPE **/
		if (!$schema->hasTable('expiration_type')) {
			$table = $schema->createTable('expiration_type');
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);
			
			$table->addColumn('uid_owner', 'string', [			
				'notnull' => true
			]);

			$table->addColumn('label', 'string', [			
				'notnull' => true,
				'length' => 100,
				'default' => '',
			]);
			
			$table->setPrimaryKey(['id']);
		}
			

		/** EXPIRATION-ASSIGNEE **/
		if (!$schema->hasTable('expiration_assignee')) {
			
			$table = $schema->createTable('expiration_assignee');
			$table->addColumn('id_expiration', 'integer', [
				'notnull' => true,
				'default' => -1,
			]);
			$table->addColumn('id_assignee', 'string', [
				'notnull' => true,
				'default' => '',
			]);
			
			$table->setPrimaryKey(['id_expiration','id_assignee']);
		}

		/** EXPIRATION-SUPERVISOR **/
		if (!$schema->hasTable('expiration_supervisor')) {
			
			$table = $schema->createTable('expiration_supervisor');
			$table->addColumn('id_expiration', 'integer', [
				'notnull' => true,
				'default' => -1,
			]);
			$table->addColumn('type_supervisor', 'integer', [
				'notnull' => true,
				'default' => 0,
			]);
			$table->addColumn('id_supervisor', 'string', [
				'notnull' => true,
				'default' => '',
			]);
			
			$table->setPrimaryKey(['id_expiration','id_supervisor']);
		}


		/** EXPIRATION-ALERT **/
		if (!$schema->hasTable('expiration_alert')) {
			
			$table = $schema->createTable('expiration_alert');
			$table->addColumn('id_expiration', 'integer', [
				'notnull' => true,
				'default' => -1,
			]);
			$table->addColumn('alert_datetime', 'datetime', [			
				'notnull' => false
			]);
			$table->addColumn('notify_to', 'string', [
				'notnull' => true,
				'default' => '',
			]);
			
			$table->setPrimaryKey(['id_expiration', 'alert_datetime', 'notify_to']);
		}

		/** EXPIRATION-VPEC **/
		if (!$schema->hasTable('expiration_vpec')) {
			
			$table = $schema->createTable('expiration_vpec');
			$table->addColumn('id_expiration', 'integer', [
				'notnull' => true,
				'default' => -1,
			]);
			$table->addColumn('id_account', 'integer', [			
				'notnull' => true
			]);
			$table->addColumn('email', 'string', [
				'notnull' => true,
				'default' => '',
			]);
			$table->addColumn('id_msg', 'string', [
				'notnull' => true,
				'default' => '',
			]);
		
			$table->setPrimaryKey(['id_expiration']);
		}

		return $schema;
	}
}

