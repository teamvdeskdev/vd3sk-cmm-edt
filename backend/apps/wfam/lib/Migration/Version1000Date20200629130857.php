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
class Version1000Date20200629130857 extends SimpleMigrationStep
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
		return null;
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options)
	{
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		$config = new \OC\Config(\OC::$SERVERROOT . '/config/');

		$db = $config->getValue('dbname');
		$dbuser = $config->getValue('dbuser');
		$dbpass = $config->getValue('dbpassword');
		$dbhost = $config->getValue('dbhost');
		$dbport = (!empty($config->getValue('dbport')) ? intval($config->getValue('dbport')) : 3306);
		$dbconnect = mysqli_connect($dbhost, $dbuser, $dbpass, $db, $dbport);

		//ruolo
		if ($schema->hasTable('wfam_ruolo')) {
			$query = "INSERT INTO oc_wfam_ruolo (id,codice, codifica,descrizione)
				VALUES (1,'HRBP', 'R',\"L'utente che muove la richiesta e si occuperà delle modifiche al documento\");";

			$query .= "INSERT INTO oc_wfam_ruolo (id,codice, codifica,descrizione)
				VALUES (2,'HRSPA','C',\"L'utente è quello che approva la richiesta o richiede modifiche all'utente\");";

			$query .= "INSERT INTO oc_wfam_ruolo (id,codice, codifica,descrizione)
				VALUES (3,'Direttore RU', 'A',\"L'utente che delibera la richiesta o richiede modifiche\");";
		}
		//elemento
		if ($schema->hasTable('wfam_elemento')) {
			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)				
				VALUES (1,'Ricerca Dipendente','Ricerca libera e tabella',\"L'utente potrà cercare un dipendente aziendale tramite Database SAP per essere inserito in una tabella.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (2,'Data Decorrenza','Date picker',\"L'utente potrà scegliere una data tramite Date picker entro la quale è previsto il decorrere della richiesta.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (3,'Importo','Campo cifra numerica',\"L'utente potrà scrivere una cifra in valuta corrente.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (4,'Motivazione','Textarea',\"L'utente potrà scrivere una motivazione discorsiva in un ampio campo di testo.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (5,'Organo Deliberante','Testo, Select',\"L'utente visualizzerà l'organo deliberante preposto (A0) e un campo di ricerca per CID o cognome dip.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (6,'Allegati','Upload formfield',\"L'utente potrà caricare allegati dal suo computer o da Drive.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (7,'Note Aggiuntive','Textarea',\"L'utente potrà scrivere delle note di spiegazione per gli enti approvativi e deliberanti.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (8, 'FirmaDigitale','FirmaDigitale',\"L'utente potrà firmare il file digitalmente.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (9, 'PEC','PEC',\"L'utente potrà inviare una pec.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (10,'Email','Email',\"L'utente potrà inviare un'email allo scopo di notificare la chiusura della fase che  sta curando.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (11,'Intervallo temporale','Time range',\"L'utente potrà scegliere un intervallo di tempo tramite il Date picker.\");";

			$query .= "INSERT INTO oc_wfam_elemento (id,nome, tipo,descrizione)
				VALUES (12,'Lista ','RowsList',\"L'utente potrà formulare una richiesta aggiungendo le righe da compilare.\");";
		}

		//azione
		if ($schema->hasTable('wfam_azione')) {

			$query .= "INSERT INTO oc_wfam_azione (id,nome, tipo,descrizione)
				VALUES (1,'Protocollo Documenti','Approvazione','Approvazione Protocollo');";

			$query .= "INSERT INTO oc_wfam_azione (id,nome, tipo,descrizione)
				VALUES (2,'Archiviazione Documenti','Rifiuto','Rifiuto e Archiviazione dei documenti');";
		}

		$query .= "CREATE VIEW `pratica_ruoli_view` AS
		SELECT 
			`p`.`id` AS `praticaId`,
			`r`.`id` AS `ruoloId`,
			`p`.`stato` AS `stato`,
			`rw`.`id` AS `ruoloWfaId`,
			`p`.`codifica_progressivo` AS `codificaProgressivo`
		FROM
			((`oc_wfam_pratica_wfa` `p`
			LEFT JOIN `oc_wfam_ruolo_wfa` `rw` ON ((`p`.`wfa_id` = `rw`.`wfa_id`)))
			LEFT JOIN `oc_wfam_ruolo` `r` ON ((`r`.`id` = `rw`.`ruolo_id`)))
		WHERE
			(NOT (`rw`.`id` IN (SELECT 
					`rpw`.`ruolo_wfa_id`
				FROM
					`oc_wfam_ruolo_pratica_wfa` `rpw`
				WHERE
					(`p`.`id` = `rpw`.`pratica_wfa_id`))))";

		$dbconnect->multi_query($query);
		$dbconnect->close();
	}
}
