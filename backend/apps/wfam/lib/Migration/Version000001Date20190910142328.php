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
class Version000001Date20190910142328 extends SimpleMigrationStep
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
        //CREATE "wfam_categoria" TABLE
        if (!$schema->hasTable('wfam_categoria')) {
            $categoria = $schema->createTable('wfam_categoria');
            $categoria->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $categoria->addColumn('nome', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            $categoria->setPrimaryKey(['id']);
        }

        //CREATE "wfam_wfa" TABLE
        if (!$schema->hasTable('wfam_wfa')) {
            $wfam_wfa = $schema->createTable('wfam_wfa');
            $wfam_wfa->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $wfam_wfa->addColumn('nome', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            $wfam_wfa->addColumn('categoria_id', 'integer', [
                'notnull' => true,
            ]);

            $wfam_wfa->addColumn('data_creazione', 'datetime', [
                'notnull' => true,
            ]);
            $wfam_wfa->addColumn('creatore', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            $wfam_wfa->addColumn('stato', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            $wfam_wfa->addColumn('workflow', 'text', [
                'notnull' => false,
            ]);
            $wfam_wfa->addColumn('url_step', 'string', [
                'notnull' => false,
                'length' => 100,
            ]);
            $wfam_wfa->addColumn('templatepdf', 'text', [
                'notnull' => false,
            ]);
            $wfam_wfa->addColumn('codifica_alfanumerica', 'string', [
                'notnull' => false,
                'length' => 50,
            ]);
            $wfam_wfa->addColumn('cifre_numeriche_progressivo', 'integer', [
                'notnull' => false,
            ]);
            $wfam_wfa->addColumn('richiesta_personale', 'boolean', [
                'notnull' => false
            ]);
            $wfam_wfa->addColumn('disabled', 'boolean', [
                'notnull' => false
            ]);
            $wfam_wfa->addColumn('Icon', 'string', [
                'length' => 500,
                'notnull' => false
            ]);
            //$wfam_wfa->addNamedForeignKeyConstraint('fk_categoria_wfa','oc_categoria_wfa',array('categoria_id'),array('id'));
            $wfam_wfa->setPrimaryKey(['id']);
        }

        //CREATE "wfam_azione" TABLE
        if (!$schema->hasTable('wfam_azione')) {
            $azione = $schema->createTable('wfam_azione');
            $azione->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $azione->addColumn('nome', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            $azione->addColumn('tipo', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            $azione->addColumn('descrizione', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);

            $azione->setPrimaryKey(['id']);
        }

        //CREATE "wfam_azione_wfa" TABLE
        if (!$schema->hasTable('wfam_azione_wfa')) {
            $azione_wfa = $schema->createTable('wfam_azione_wfa');
            $azione_wfa->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $azione_wfa->addColumn('wfa_id', 'integer', [
                'notnull' => true,
            ]);
            $azione_wfa->addColumn('azione_id', 'integer', [
                'notnull' => true,
            ]);
            $azione_wfa->addColumn('tipo', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            // $azione_wfa->addNamedForeignKeyConstraint('fk_azione','oc_azione',array('azione_id'),array('id'));
            // $azione_wfa->addNamedForeignKeyConstraint('fk_wfa','oc_wfa',array('wfa_id'),array('id'));
            $azione_wfa->setPrimaryKey(['id']);
        }

        //CREATE "wfam_dipendente" TABLE
        if (!$schema->hasTable('wfam_dipendente')) {
            $dipendente = $schema->createTable('wfam_dipendente');
            $dipendente->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $dipendente->addColumn('nome_dipendente', 'string', [
                'notnull' => false,
                'length' => 100,
            ]);
            $dipendente->addColumn('inquadramento', 'string', [
                'notnull' => false,
                'length' => 100,
            ]);
            $dipendente->addColumn('uo', 'string', [
                'notnull' => false,
                'length' => 100,
            ]);
            $dipendente->addColumn('sede', 'string', [
                'notnull' => false,
                'length' => 100,
            ]);
            $dipendente->addColumn('mansione', 'string', [
                'notnull' => false,
                'length' => 100,
            ]);
            $dipendente->addColumn('contratto', 'string', [
                'notnull' => false,
                'length' => 100,
            ]);
            $dipendente->addColumn('uid', 'string', [
                'notnull' => false,
                'length' => 255,
            ]);
            $dipendente->setPrimaryKey(['id']);
        } else {
            $table = $schema->getTable('wfam_dipendente');
			$table->addColumn('uid', 'string', [
                'notnull' => false,
                'length' => 255,
            ]);
        }

        //CREATE "wfam_elemento" TABLE
        if (!$schema->hasTable('wfam_elemento')) {
            $elemento = $schema->createTable('wfam_elemento');
            $elemento->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $elemento->addColumn('nome', 'string', [
                'notnull' => true,
                'length' => 200,
            ]);
            $elemento->addColumn('tipo', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            $elemento->addColumn('descrizione', 'text', [
                'notnull' => true,
            ]);

            $elemento->setPrimaryKey(['id']);
        }

        //CREATE "wfam_elemento_wfa" TABLE
        if (!$schema->hasTable('wfam_elemento_wfa')) {
            $elemento_wfa = $schema->createTable('wfam_elemento_wfa');
            $elemento_wfa->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $elemento_wfa->addColumn('wfa_id', 'integer', [
                'notnull' => true,
            ]);
            $elemento_wfa->addColumn('elemento_id', 'integer', [
                'notnull' => true,
            ]);
            $elemento_wfa->addColumn('ordine', 'integer', [
                'notnull' => true,
            ]);
            // $elemento_wfa->addNamedForeignKeyConstraint('fk_elemento','oc_elemento',array('elemento_id'),array('id'));
            // $elemento_wfa->addNamedForeignKeyConstraint('fk_wfa','oc_wfa',array('wfa_id'),array('id'));
            $elemento_wfa->setPrimaryKey(['id']);
        }

        //CREATE "wfam_ruolo" TABLE
        if (!$schema->hasTable('wfam_ruolo')) {
            $ruolo = $schema->createTable('wfam_ruolo');
            $ruolo->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $ruolo->addColumn('codice', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            $ruolo->addColumn('codifica', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            $ruolo->addColumn('descrizione', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);

            $ruolo->setPrimaryKey(['id']);
        }

        //CREATE "wfam_ruolo_wfa" TABLE
        if (!$schema->hasTable('wfam_ruolo_wfa')) {
            $ruolo_wfa = $schema->createTable('wfam_ruolo_wfa');
            $ruolo_wfa->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $ruolo_wfa->addColumn('wfa_id', 'integer', [
                'notnull' => true,
            ]);
            $ruolo_wfa->addColumn('utente_id', 'string', [
                'notnull' => true,
                'length' => 200,
            ]);
            $ruolo_wfa->addColumn('ruolo_id', 'integer', [
                'notnull' => true,
            ]);

            // $ruolo_wfa->addNamedForeignKeyConstraint('fk_ruolo','oc_ruolo',array('ruolo_id'),array('id'));
            // $ruolo_wfa->addNamedForeignKeyConstraint('fk_wfa','oc_wfa',array('wfa_id'),array('id'));
            $ruolo_wfa->setPrimaryKey(['id']);
        }
        //CREATE "wfam_gruppo_ruolo_wfa" TABLE
        if (!$schema->hasTable('wfam_gruppo_ruolo')) {
            $gruppo_ruolo = $schema->createTable('wfam_gruppo_ruolo');
            $gruppo_ruolo->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $gruppo_ruolo->addColumn('ruolo_wfa_id', 'integer', [
                'notnull' => true,
            ]);
            $gruppo_ruolo->addColumn('group_name', 'string', [
                'notnull' => true,
                'length' => 200,
            ]);
            $gruppo_ruolo->setPrimaryKey(['id']);
        }

        //CREATE "wfam_notifiche_ruolo_wfa" TABLE
        if (!$schema->hasTable('wfam_notificheruolowfa')) {
            $notifiche_ruolo_wfa = $schema->createTable('wfam_notificheruolowfa');
            $notifiche_ruolo_wfa->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $notifiche_ruolo_wfa->addColumn('ruolo_wfa_id', 'integer', [
                'notnull' => true,
            ]);
            $notifiche_ruolo_wfa->addColumn('ruolo_informed_id', 'integer', [
                'notnull' => true,
            ]);
            $notifiche_ruolo_wfa->addColumn('groups_informed', 'text', [
                'notnull' => false,
            ]);
            // $notifiche_ruolo_wfa->addNamedForeignKeyConstraint('fk_ruolo_wfa','oc_ruolo_wfa',array('ruolo_wfa_id'),array('id'));
            // $notifiche_ruolo_wfa->addNamedForeignKeyConstraint('fk_ruolo_wfa_informed','oc_ruolo_wfa',array('ruolo_informed_id'),array('id'));
            $notifiche_ruolo_wfa->setPrimaryKey(['id']);
        }

        //CREATE "wfam_ruolo_pratica_wfa" TABLE
        if (!$schema->hasTable('wfam_ruolo_pratica_wfa')) {
            $ruolo_pratica_wfa = $schema->createTable('wfam_ruolo_pratica_wfa');
            $ruolo_pratica_wfa->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $ruolo_pratica_wfa->addColumn('ruolo_wfa_id', 'integer', [
                'notnull' => true,
            ]);
            $ruolo_pratica_wfa->addColumn('pratica_wfa_id', 'integer', [
                'notnull' => true,
            ]);
            $ruolo_pratica_wfa->addColumn('stato', 'string', [
                'notnull' => false,
                'length' => 100,
            ]);
            $ruolo_pratica_wfa->addColumn('utente_id', 'string', [
                'notnull' => true,
                'length' => 100,
            ]);
            // $ruolo_pratica_wfa->addNamedForeignKeyConstraint('fk_ruolo_wfa','oc_ruolo_wfa',array('ruolo_wfa_id'),array('id'));
            // $ruolo_pratica_wfa->addNamedForeignKeyConstraint('fk_pratica_wfa','oc_ruolo_wfa',array('pratica_wfa_id'),array('id'));
            $ruolo_pratica_wfa->setPrimaryKey(['id']);
        }

        //CREATE "wfam_pratica_wfa" TABLE
        if (!$schema->hasTable('wfam_pratica_wfa')) {
            $pratica_wfa = $schema->createTable('wfam_pratica_wfa');
            $pratica_wfa->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $pratica_wfa->addColumn('dipendente_id', 'integer', [
                'notnull' => true,
            ]);
            $pratica_wfa->addColumn('wfa_id', 'integer', [
                'notnull' => true,
            ]);
            $pratica_wfa->addColumn('data_richiesta', 'datetime', [
                'notnull' => true,
            ]);
            $pratica_wfa->addColumn('modifica_richiesta', 'string', [
                'notnull' => false,
                'length' => 500,
            ]);
            $pratica_wfa->addColumn('stato', 'string', [
                'notnull' => false,
                'length' => 50,
            ]);
            $pratica_wfa->addColumn('pdf', 'string', [
                'notnull' => false,
                'length' => 500,
            ]);
            $pratica_wfa->addColumn('codifica_progressivo', 'text', [
                'notnull' => false,
            ]);
            $pratica_wfa->addColumn('progressivo', 'integer', [
                'notnull' => false,
            ]);
            // $pratica_wfa->addNamedForeignKeyConstraint('fk_dipendente','oc_dipendente',array('dipendente_id'),array('id'));
            // $pratica_wfa->addNamedForeignKeyConstraint('fk_wfa','oc_wfa',array('wfa_id'),array('id'));
            $pratica_wfa->setPrimaryKey(['id']);
        }

        //CREATE "wfam_valore_elemento_wfa" TABLE
        if (!$schema->hasTable('wfam_valoreelementowfa')) {
            $valore_elemento_wfa = $schema->createTable('wfam_valoreelementowfa');
            $valore_elemento_wfa->addColumn('id', 'integer', [
                'autoincrement' => true,
                'notnull' => true,
            ]);
            $valore_elemento_wfa->addColumn('elemento_wfa_id', 'integer', [
                'notnull' => true,
            ]);
            $valore_elemento_wfa->addColumn('pratica_wfa_id', 'integer', [
                'notnull' => true,
            ]);
            $valore_elemento_wfa->addColumn('valore', 'text', [
                'notnull' => false
            ]);
            // $valore_elemento_wfa->addNamedForeignKeyConstraint('fk_elemento_wfa','oc_elemento_wfa',array('elemento_wfa_id'),array('id'));
            // $valore_elemento_wfa->addNamedForeignKeyConstraint('fk_pratica_wfa','oc_pratica_wfa',array('pratica_wfa_id'),array('id'));
            $valore_elemento_wfa->setPrimaryKey(['id']);
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
