import { AppConfig } from "src/app/app-config";
import { CustomCustomer } from "src/app/config.service";
import { globals } from "src/config/globals";
import { DictionaryInterface } from "./dictionary.interface"

export class Dictionary implements DictionaryInterface {

    // USER SETTINGS
    settings_title = 'Impostazioni';
    profile = 'Profilo personale';
    device_session = 'Dispositivi e sessioni';
    authentication = 'Autenticazione';
    encryption = 'Crittografia';
    configurations = 'Configurazioni';
    back = 'Indietro';
    undo = 'Annulla';

    // Profile page
    account_of = 'Account di';
    user_id = 'Il tuo user id è';
    upload_from_device = 'Carica una foto dal device';
    upload_from_vshare = 'Carica una foto da vShare';
    delete_photo = 'Elimina la foto attuale';
    format_size = 'png o jpg, max. 20 MB';
    first_name = 'Nome';
    last_name = 'Cognome';
    full_name = 'Nome e Cognome';
    primary_email = 'Indirizzo email principale';
    membership_groups = 'Gruppi d’appartenenza';
    used_space = 'Spazio utilizzato';
    language = 'Lingua';
    localization = 'Localizzazione';
    choose = 'Imposta immagine';
    login_password = 'Password di accesso';
    old_password = 'Vecchia password';
    new_password = 'Nuova password';
    confirm_password = 'Conferma password';
    save_password_message = 'Password salvata! Sarai disconnesso, effettua l\'accesso con le nuove credenziali';
    no_save_password_message = 'Errore! Password non salvata';
    save_email_msg = 'Email salvata correttamente.';
    no_save_email_msg = 'Errore! Email non salvata.';
    wrong_password = 'Password errata!';
    save_fullname_msg = 'Nome e cognome salvati correttamente.';
    no_save_fullname_msg = 'Errore! Nome e cognome non salvati.';
    save_language_msg = 'Lingua salvata correttamente.';
    no_save_language_msg = 'Errore! Lingua non salvata.';
    no_confirm_password_match = 'Errore! Nuova Password e Conferma Password non coincidono.';
    required_field = 'Campo Obbligatorio';
    required_fields = 'Campi Obbligatori';
    min_length_password = 'La lunghezza minima consentita è di 12 caratteri';
    max_length_password = 'La lunghezza massima consentita è di 128 caratteri';
    two_spaces = 'Spazi consecutivi non sono permessi';
    invalid_password = 'La password non soddisfa i requisiti';
    psw_must_contain = 'Specifiche password';
    psw_rules_one = 'Deve contenere almeno due caratteri speciali';
    psw_rules_two = 'Non può contenere due caratteri uguali consecutivi';
    psw_rules_three = 'Non può contenere lo username';
    psw_rules_four = 'Non può contenere quattro tasti consecutivi della tastiera querty';
    psw_rules_five = 'Non può contenere parole del vocabolario italiano';

    // Device session page
    connection_history = 'Storico connessioni';
    client_web = 'Client web, desktop e mobile attualmente connessi al tuo account.';
    device = 'Dispositivo';
    last_activity = 'Ultima Attività';
    revocation = 'Elimina';
    revocation_msg = 'La revoca di questo token potrebbe impedire la cancellazione del tuo dispositivo se non ha ancora iniziato la cancellazione.';
    delete_device = 'Disconnetti';
    remote_wipe = 'Disconnesso';
    update_successful = 'Modifica avvenuta con successo!';
    update_failure = 'Errore! Modifica non salvata';
    rename = 'Rinomina';
    new_name = 'Nuovo Nome';
    edit_name = 'Modifica Nome';

    // Authentication page
    two_factor_auth = 'Autenticazione a 2 fattori';
    use_second_factor = 'Utilizza un secondo fattore oltre alla tua password per aumentare la sicurezza per il tuo account.';
    backup_code = 'Codice di backup';
    backup_code_subtitle = 'I codici di backup sono stati generati. 0 di 10 codici sono stati utilizzati.';
    regenerate_backup_codes = 'Rigenera i codici di backup';
    regenerate_backup_codes_progress = 'Rigenera i codici di backup in corso...';
    if_regenerate  = 'Se rigeneri i codici di backup, invaliderai automaticamente i vecchi codici.';
    totp = 'TOTP - Timebased One Time Password';
    totp_subtitle = 'Tramite l’app di autenticazione Google Authenticator è possibile apporre autenticazione forte al tuo accesso.';
    enable_totp = 'Abilita totp';
    your_new_totp = 'Il tuo nuovo codice TOTP è:';
    configure = 'Configura ora l’app di autenticazione:';
    step1 = '1- scarica l’app mobile';
    step2 = '2- scansiona questo codice QR con la tua applicazione TOTP';
    final_step = 'Una volta configurata la tua applicazione, digita di seguito un codice di prova per assicurarti che tutto funzioni correttamente:';
    auth_code = 'Codice di autenticazione';
    totp_enabled = 'TOTP abilitato.';
    disable_totp = 'Disabilita TOTP';
    regenerates_totp = 'Rigenera TOTP';
    save_print_codes = 'Questi sono i tuoi codici di backup. Salvali e/o stampali poiché non potrai più leggerli successivamente.';
    save_codes = 'Salva i codici di backup';
    print_codes = 'Stampa i codici di backup';

    // Security Dialog
    security = 'Sicurezza';
    enter_pwd = 'Inserisci la tua password vDesk per abilitare l\'operazione';
    cancel = 'Annulla';
    check = 'Verifica';
    generates = 'Genera';
    error_invalid_pwd = 'Password errata';
    error_empty_pwd = 'Compila il campo password.';
    confirm = 'Conferma';
    generates_progress = 'Genera in corso...';
    confirm_progress = 'Conferma in corso...';

    // Encryption page
    increase_security = 'Aumenta la sicurezza delle tue email e dei tuoi file impostando le tue chiavi di cifratura/decifratura.';
    password = 'Password';
    encryption_password = 'Password di cifratura';
    pass_phrase = 'Frase d\'accesso';
    pwd_subtitle = 'Inserisci la password e la frase d\'accesso. La password per essere valida deve avere una lunghezza minima di 12 caratteri';
    phrase_subtitle = 'La frase d\'accesso è una frase di senso compiuto a tua scelta, che dovrai conservare per poter esportare in seguito le tue credenziali di cifratura su altre nuove installazioni.';
    invalid_pwd = 'Password non valida';
    invalid_form = 'Compila tutti i campi del form.';
    set_pwd_success = 'Password di cifratura impostata con successo!';
    set_pwd_failed = 'Impostazione password di cifratura fallita.';
    confirm_pwd = 'Conferma password di cifratura';
    no_match_pwd = 'La password inserita non combacia.';
    save = 'Salva';
    edit = 'Modifica';

    // Configurations page
    conf_page_title = 'Configurazioni applicazione';
    session_time = 'Tempo di durata della sessione';
    hour_label = 'ore';

    year_ago       = ' anno fa';
    years_ago      = ' anni fa';
    month_ago      = ' mese fa';
    months_ago     = ' mesi fa';
    week_ago       = ' settimana fa';
    weeks_ago      = ' settimane fa';
    day_ago        = ' giorno fa';
    days_ago       = ' giorni fa';
    hour_ago       = ' ora fa';
    hours_ago      = ' ore fa';
    minute_ago     = ' minuto fa';
    minutes_ago    = ' minuti fa';
    less_minute    = 'Meno di un minuto';

    // ADMIN SETTINGS
    admin_settings_title = 'Admin Area';
    vcanvas_settings = 'vCanvas';
    vpec_settings = 'vPec';
    vflow_settings = 'vFlow';
    vdpa_settings = 'vDpa';
    outlookSettings = 'Integrazione Office 365';
    config_panel = 'Onlyoffice';
    username = 'Username';
    group = 'Gruppo';
    enable = 'Abilita';
    disable = 'Disabilita';
    save_success = 'Salvataggio eseguito con successo!';
    save_error = 'Impossibile eseguire il salvataggio!';
    delete = 'Elimina';
    reset_guest= 'Resetta password';
    delete_success = 'Eliminazione avvenuta con successo!';
    delete_error = "Impossibile eseguire l'eliminazione";    
    loading_error = "C'è stato un errore durante il caricamento...";
    name = 'Nome';
    user_name = "Nome utente";
    account_name = 'Nome visualizzato';
    email = 'Email';
    groups = 'Gruppi';
    confirm_new_password = 'Conferma Nuova Password';
    new_email = 'Nuova Email'; 
    new_user_email = "Inserisci l'email del nuovo utente";
    new_user_username = "Inserisci username utente";
    close = 'Chiudi'; 

    // Users Settings page
    users_settings = 'Gestione Utenti';
    error_known_user = 'Errore: utente già presente';
    resend_mail = 'Mail inviata con successo';
    userupdate_success = 'Utente modificato con successo';
    psw_error = 'Password errata';
    userdelete_success = 'Utente eliminato con successo';
    disabled_users = 'Utenti Disabilitati';
    enabled_users = 'Utenti Abilitati';
    user_manager_enabled = 'User Manager Abilitato';
    user_manager_disabled = 'User Manager Disabilitato';
    disbale_user_manager= 'Disabilita user Manager';
    enable_user_manager= 'Abilita user Manager';
    folder_manager_enabled = 'Folder Group Manager  Abilitato';
    folder_manager_disabled = 'Folder Group Manager Disabilitato';
    disbale_folder_manager= 'Disabilita folder group Manager';
    enable_folder_manager= 'Abilita folder group Manager';
    users_subtitle = 'Aggiungi e gestisci gli Utenti';
    authentication_required = 'Autenticazione richiesta';
    confirm_password_required = 'Questa azione richiede la conferma della tua password';
    new_group_name = 'Scegli il nome del nuovo gruppo';
    enabled_modules = 'Moduli abilitati';
    quota = 'Quota';
    nolimits = 'Illimitata';
    error_nodata = 'Errore: dati mancanti';
    user_delete = 'Elimina utente';
    user_deletedevices = 'Cancella tutti i dispositivi';
    user_disable = 'Disabilita utente';
    user_enable = 'Abilita utente';
    user_sendmail = 'Invia nuovamente email di benvenuto';
    user_notfound = 'Nessun utente trovato';
    password_short_12 = 'Errore: la password deve avere almeno 12 caratteri';
    user_search = 'Ricerca Utente';
    new_displayed_name = 'Nuovo Nome Visualizzato';
    name_and_surname_new_user = "Inserisci nome e cognome utente";
    user_created = 'Utente creato con successo!';
    new_user_password = 'Inserisci password nuovo utente';
    disabled_users_subtitle = 'Gestisci gli Utenti Disabilitati';
    new_username = 'Imposta Username nuovo Utente';
    no_special_space_character = 'Caratteri speciali o spazi non sono permessi';
    no_special_character = 'Caratteri speciali non sono permessi';
    nodata_user_search = 'Nessun risultato per la ricerca effettuata';
    user = 'Il nuovo utente ';
    created = ' è stato creato con successo!';
    new_user = 'Nuovo utente';
    new_user_file = "Nuovi utenti da file";
    subtitle_new_user = 'Imposta i dati necessari alla creazione di un nuovo utente';
    subtitle_new_user_file = 'Importa nuovi utenti da file';
    subtitle_new_user_file_resume = "Riassunto upload:";
    new_user_quota = "Seleziona spazio";
    new_user_groups = "Seleziona gruppi";
    next = 'Avanti';
    filter = 'Filtri';
    filter_subtitle = 'Seleziona i parametri dei fascicoli che vuoi visualizzare';
    confrim_newUser_subtitle = 'Conferma di volere aggiungere un nuovo utente con queste caratteristiche';
    invalid_email = "Email invalida";
    deleteUserDialogTitle = "Eliminare definitivamente l'utente?";
    deleteUserDialogContent = "L’azione è irreversibile.";
    edit_user = "Modifica Utente";
    role = 'Ruolo';
    error_update_user = "Errore, modifica utente non eseguita";
    error_admin = "GGU non ha i permessi per creare un account amministratore";
    add_user = "Aggiungi utente";
    add_user_Tim = "Aggiungi utente Admin";
    add_user_file = "Aggiungi da file";
    upload_file = "Carica file";
    file_name = "Nome file:";
    file_name_wrong = "Nome file non valido.";
    file_name_format = "Usa il formato: ggmmaaaa-usercreationdata.txt";
    upload_error = "Errore, upload non riuscito";
    upload_disabled = "Disabilitati:";
    upload_new = "Utenti creati:";
    upload_new_Guest = "Nuovi utenti Guest:";
    upload_new_Saml = "Nuovi utenti Saml:";
    upload_total_Guest = "Totale utenti Guest:";
    upload_total_Guest_modified = "Utenti Guest modificati:";
    upload_total_records = "Record effettuati:";
    upload_total_Saml = "Totale utenti Saml:";
    upload_total_Saml_modified = "Utenti Saml modificati:";


    // Groups Settings page
    groups_settings = 'Gestione Gruppi';
    group_created = 'Gruppo creato con successo';
    group_created_error = 'C\'è stato un errore durante la creazione del gruppo';
    create_group = 'Crea gruppo';
    group_deleted_success = 'Gruppo eliminato con successo';
    group_deleted_error = "Errore durante l'eliminazione del gruppo";
    new_group = 'Nuovo gruppo';
    new_group_create = 'Nuovo gruppo creato';
    newgroupcreate_error = 'Errore durante la creazione del gruppo';
    group_subtitle = 'Aggiungi e gestisci gruppi utenti di cui necessiti';
    group_title = 'Gruppi utenti';
    users = 'Utenti';
    space = 'Spazio';
    admin = 'Amministratore';
    admin_mail = 'Mail amministratore';
    delete_group = 'Elimina gruppo';
    description = 'Descrizione';
    group_name = 'Nome Gruppo';
    guests_settings = 'Gestione ospiti';
    empty_name_group = 'Inserire il nome del gruppo da creare';


    // vPEC settings page
    vpec_title = 'Impostazioni vPEC';
    disable_new = 'Permetti domini personali';
    configured_domains = 'Domini configurati';
    domains_imap = "Domini con autenticazione plain/gssapi";
    domains_type = "Tipo Auth";
    imap_name = "Url imap";
    addDomainImap = "Aggiungi dominio Imap";
    imap_exist = "Dominio imap già esistente";
    new_imap = "Configura auth plain/gssapi per dominio Imap";
    insert_all_imap_value = "Inserisci tutti i valori richiesti";
    domainName = 'Nome dominio';
    host = 'host';
    port = 'Porta';
    isPec = 'isPEC';
    active = 'attivo';
    actions = 'Azioni';
    addDomain = 'Aggiungi dominio';
    secure_print = 'Stampa sicura';
    set_secure_print = 'Imposta stampa sicura';
    secure_print_tooltip = 'Definisci per tutti gli utenti del sistema il watermark contenente il loro nome; cognome e indirizzo IP.';
    attachments = 'Allegati';
    size_tooltip = 'Imposta una dimensione massima degli allegati. Il valore inserito si riferisce al numero di megabyte.';
    set_value = 'Imposta un valore';
    contacts = 'Contatti';
    enable_contacts = 'Abilita contatti';
    enable_contacts_dav = 'Abilita contatti DAV';
    edit_domain = 'Modifica Dominio';
    new_domain = 'Nuovo Dominio';
    domain_creation_failed = 'Creazione dominio fallita.';
    check_config_param = 'Si prega di controllare i parametri di configurazione inseriti.';
    imap = 'IMAP';
    smtp = 'SMTP';
    imap_protocol = 'Protocollo Imap';
    imap_validate = 'Validazione Imap';
    smtp_use_auth = 'Utilizza autenticazione SMTP';
    imap_host = 'Host IMAP';
    smtp_host = 'Host SMTP';
    smtp_subtitle = 'Configura il server per inviare le email';

    // vCanvas settings page
    vcanvas_title = 'Settaggi Servizio';
    url_service = 'Url Servizio';
    vcanvas_users_settings = 'Utenti';
    vcanvas_users_settings_subtitle ='Gestisci gli utenti';
    vcanvas_apps_settings = 'Applicazioni';
    vcanvas_groups_settings = 'Gruppi';
    applications = 'Applicazioni';

    admin_vcanvas_applications_tooltip = 'Aggiungi o rimuovi applicazioni all\'utente';
    admin_vcanvas_group_applications_tooltip = 'Aggiungi o rimuovi applicazioni al gruppo';

    admin_vcanvas_create_applications_tooltip = 'Crea un\'applicazione';
    admin_vcanvas_new_application = 'Nuova applicazione';
    admin_vcanvas_new_application_tooltip = 'Crea una nuova applicazione vCanvas';
    admin_vcanvas_groups_tooltip = 'Aggiungi gruppi a vCanvas';
    admin_vcanvas_groups_add_group_title = 'Aggiungi gruppo a vCanvas';
    
    manage_apps = 'Gestisci applicazioni';
    
    application_created = 'Applicazione creata con successo';
    application_created_error = 'C\'è stato un errore durante la creazione dell\'applicazione';
    parameters = 'Parametri';
    hostname = 'Hostname';
    program = 'Programma';
    working_directory = 'Directory di lavoro'; 

    // vFlow settings page
    vflow_title = 'Configurazione Parametri';
    admin_account = 'Account amministratore';
    server_port = 'Server port';
    group_designer = 'Gruppo Designer WFA';
    group_super_admin = 'Gruppo Super Admin';
    show_resolution_action = 'Visualizza azioni delibera';
    sap_configuration = 'Configurazione SAP';
    authentication_type = 'Tipo di autenticazione';
    external_system = 'Progressivo da sistemi esterni';

    // vDpa settings page
    vdpa_title = 'Impostazioni vDPA';
    signature_provider = 'Provider di firma digitale remota configurati';
    provider_service_name = 'Nome Provider';
    provider_service_url = 'Url Servizio';
    supported_signatures = 'Firme supportate';
    service_active = 'Servizio Attivo';
    edit_provider = 'Modifica Provider';
    provider_update_failed = 'Modifica al Servizio Provider fallita';
    provider_verify_url = 'Verifica Url Servizio';
    provider_has_verify = 'Servizio verificato';
    extra_params = 'Parametri extra';

    // ConfigPanel settings page
    onlyoffice_title = 'Impostazioni Onlyoffice';
    onlyoffice_subtitle = 'Specifica l\'indirizzo del server con i servizi documentali installati.';
    save_btn = 'Salva';
    onlyoffice_update_succes = 'Url salvato.';
    onlyoffice_update_error = 'Errore! Url non salvato.';

    // Guest settings
    search_users = 'Ricerca gli ospiti per nome e cognome dalla lista';
    add_guest = 'Aggiungi ospite';
    no_guest = 'Al momento non sono presenti ospiti';
    first_noguest = 'Aggiungi un nuovo ospite';
    second_noguest = 'Seleziona i moduli che potrà utilizzare';
    third_noguest = "Conferma l'attivazione della sua utenza";
    error_guest_data = "Errore: dati dell'ospite incompleti";
    set_guest_data = "Imposta i dati dell’ospite che vuoi invitare ad utilizzare";
    character_limit_50 = 'Max. 50 caratteri';
    character_limit_exceeded = 'Limite caratteri superato';
    guest_name = 'Nome ospite';
    guest_surname = 'Cognome ospite';
    guest_username = 'Username ospite';
    guest_company = 'Nome azienda';
    guest_email = 'Mail aziendale';
    guest_start = 'Data di inizio';
    guest_end = 'Data di scadenza';
    guest_managerName = 'Nome responsabile';
    guest_managerSurname = 'Cognome responsabile';
    guest_managerMail = 'Email responsabile';
    guest_managerUid = 'UID responsabile';
    error_nameRequired = 'Nome obbligatorio';
    error_surnameRequired = 'Cognome obbligatorio';
    error_usernameRequired = 'Username obbligatorio';
    error_companyRequired = 'Azienda obbligatoria';
    error_emailRequired = 'Email obbligatoria';
    error_startdateRequired = 'Data inizio obbligatoria';
    error_enddateRequired = 'Data fine obbligatoria';
    second_subtitle = 'Seleziona per il tuo ospite i moduli da attivare della suite';
    third_subtitle = 'Confermi di voler aggiungere il nuovo ospite?';
    guest_name_surname = 'Nome e cognome ospite';
    active_modules = 'Moduli da attivare';
    guest_added_successfully = 'Ospite aggiunto con successo';
    guest_reset_successfully = 'Password ospite rigenerata con successo';
    guest_updated_successfully = 'Ospite aggiornato con successo';
    guest_existing_mail = 'Email già in uso';
    guest_existing_username = 'Username già in uso';
    search_guest = 'Cerca ospite';
    noguest_found = 'Nessun ospite trovato';
    
    
    //Smtp settings
    smtpEncryption = "Cifratura";
    smtpSenderAddress = 'Indirizzo mittente';
    smtpSenderAddressTooltip = 'posta@example.com';
    smtpAuthtypeTooltip = 'Metodo di autenticazione';
    smtpAuthRequired = 'Autenticazione Richiesta';
    smtpHost = 'Indirizzo del server';
    smtpHostTooltip = 'smtp.example.com';
    smtpPortTooltip = 'Porta';
    smtpUsername = 'Nome utente';
    smtpPassword = 'Password';
    smtpSendTestEmail = 'Invia email di test';
    smtpSave = 'Salva';

    //saml settings
    saml_settings = 'Gestione utenti SAML';
    samldisable_settings = 'Gestione utenti SAML disabilitati';
    samlUserName = 'Nome utente';
    samlUserSurname = 'Cognome utente';
    samlUserMail = 'Email utente';
    samlUserSerial = 'Matricola utente';
    samlUserStart = 'Data inizio';
    samlUserEnd = 'Data fine';
    samlUserQuota = 'Quota';
    samlUserProfile = 'Profilo';
    samlUserGroups = 'Gruppi';
    samluserApps = 'Apps';
    samlBoss = 'UID responsabile';
    samlBossName = 'Nome responsabile';
    samlBossSurname = 'Cognome responsabile';
    samlBossMail = 'Email responsabile';
    samlSocietaName = 'Nome società';
    societaRequired = 'Nome società obbligatorio';
    error_name_societa = 'Nome società non ammesso';
    samluser_setData = "Imposta i dati dell'utente SAML";
    error_serialRequired = 'Matricola obbligatoria';
    error_quotaRequired = 'Quota obbligatoria';
    error_uidRequired = 'UID obbligatorio';
    error_profileRequired = 'Profilo obbligatorio';
    error_groupRequired = 'Gruppi oggligatori';
    error_samluserAdd = "Errore durante la creaione dell'utente";
    samluser_added_successfully = 'Utente creato con successo';
    samluser_updated_successfully = 'Utente modificato con successo';
    error_samluserUpdate = "Errore durante la modifica dell'utente";
    guestmanager_namesurname = "Nome e cognome responsabile";
    report = "Report user/profile";
    smtp_baderror = 'SMTP configurato male';
    smtp_noerror = 'SMTP non configurato';
    userdelete_error = "Errore durante l'eliminazione dell'utente";
    userupdate_error = "Errore durante l'aggiornamento dell'utente";
    resendmail_error = "Errore durante l'invio della mail";
    groupcreated_error = 'Errore durante la creazione del gruppo';
    usercreate_error = "Errore durante la creazione dell'utente";
    error_appslist = 'Errore durante il caricamento delle apps';
    addUser = 'Aggiungi utente filtrato';
    errorGroupAdd = "Errore durante l'aggiunta al gruppo";
    userAdded = 'Utente aggiunto con successo';
    errorGroupDelete = "Errore durante l'eliminazione dal gruppo";
    userRemoved = "Utente rimosso dal gruppo";
    removeUser = "Rimuovi utente dal gruppo";
    expirationResponseOK = "Scadenza aggiunta con successo";
    expirationResponseKO = "Si è verificato un problema imprevisto, riprovare più tardi";

    //Staging Area
    stagingAreaSettings = "Area di Staging";
    type = "Tipo";
    length = "Lunghezza";
    parent = "Padre";
    table = "Tabella"
    createRelationship = "Crea relazione";
    child = "Figlio";
    foreignKey = "Chiave esterna";
    renameTable = "Rinomina tabella";
    deleteTable = "Elimina tabella";
    listTableFields = "Elenco campi della tabella";
    addField = "Aggiungi campo";
    relationships = "Relazioni";
    listRelatedTables = "Elenco chiavi esterne e tabelle correlate con";
    addRelationship = "Aggiungi relazione";
    createTable = "Crea tabella";
    importData = "Importa dati";
    tableName = "Nome tabella";
    fields = "Campi";
    createField = "Crea campo";
    editField = "Modifica campo";
    data = "Dati";
    listTablesData = "Elenco dati della tabella";
    stagingAreaSettingsDescription = "Gestisci tabelle, campi e relazioni dell'area di staging";
    selectPage = "Seleziona pagina";
    tableDialogValidator = "Il nome della tabella dev'essere lungo almeno 3 caratteri e i caratteri speciali non sono ammessi (ad eccezione di _)";
    fieldDialogValidator = "Il nome del campo dev'essere lungo almeno 3 caratteri, non deve terminare per 'id' e i caratteri speciali non sono ammessi (ad eccezione di _)";
    parentRelationshipsList = "Elenco tabelle genitrici";
    childRelationshipsList = "Elenco tabelle figlie";
    noTablesFound = "Nessuna tabella trovata";
    deleteTableConfirm = "Sei sicuro di voler eliminare la tabella";
    deleteFieldConfirm = "Sei sicuro di voler eliminare il campo";
    deleteRelationshipConfirm = "Sei sicuro di voler eliminare la relazione";
    deleteTableConfirmMessage = "Eliminare una tabella cancellerà tutti i dati contenuti in essa, e potrebbe invalidare alcuni flow e relazioni con altre tabelle. Sei sicuro di voler continuare?";
    iAmSure = "Sì, sono sicuro";
    irreversibleAction = "ATTENZIONE: Questa azione è irreversibile.";
    with = "con";
    of = "di";
    loading = "Caricamento";
    primaryKey = "Chiave primaria";
    no_security = 'Nessuna sicurezza';
    no_security_spa = 'Nessuna con SPA';
    LoadingMenuError = "Si è verificato un errore durante il caricamento dei dati del Menù a Tendina";
    LoadingMenuErrorMessage = "assicurarsi che ci siano record nella tabella specificata";
    LoadingMenuErrorMessageChild = "assicurarsi che ci siano record nelle tabelle specificate e che la tabella figlia sia relazionata correttamente con la tabella genitrice";
    Other = "Altro";
    OtherValue = 'Valore "Altro"';
    genericError = "Si è verificato un errore. Contattare l'amministratore di sistema";

    config: AppConfig

    constructor() {
        this.config = globals
        if(this.config.customCustomer?.toLowerCase() === CustomCustomer.AUSLBO) {
            this.show_resolution_action = 'Visualizza azioni conclusione'
        }
    }
}
