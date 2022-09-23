import { AppConfig } from "src/app/app-config";
import { CustomCustomer } from "src/app/config.service";
import { globals } from "src/config/globals";
import { DictionaryInterface } from "./dictionary.interface"

export class Dictionary implements DictionaryInterface {

    // USER SETTINGS
    settings_title = 'Settings';
    profile = 'Personal profile';
    device_session = 'Devices and sessions';
    authentication = 'Authentication';
    encryption = 'Encryption';
    configurations = 'Configurations';
    back = 'Back';
    undo = 'Undo'

    // Profile page
    account_of = 'Account of';
    user_id = 'Your user id is';
    upload_from_device = 'Upload a photo from your device';
    upload_from_vshare = 'Upload a photo from vShare';
    delete_photo = 'Delete the current photo';
    format_size = 'png o jpg, max. 20 MB';
    first_name = 'First name';
    last_name = 'Last name';
    full_name = 'First and last name';
    primary_email = 'Primary email address';
    membership_groups = 'Membership groups';
    used_space = 'Used space';
    language = 'Language';
    localization = 'Localization';
    choose = 'Set picture';
    login_password = 'Login password';
    old_password = 'Old password';
    new_password = 'New password';
    confirm_password = 'Confirm password';
    save_password_message = 'Password saved! You will be logged out, log in with your new credentials';
    no_save_password_message = 'Error! Password not saved';
    save_email_msg = 'Email saved.';
    no_save_email_msg = 'Error! Email was not saved.';
    wrong_password = 'Wrong password!';
    save_fullname_msg = 'Name and last name saved correctly.';
    no_save_fullname_msg = 'Error! Name and last name not saved.';
    save_language_msg = 'Language saved correctly.';
    no_save_language_msg = 'Error! Language not saved.';
    no_confirm_password_match = 'Error! New Password and Confirm Password don\'t match.';
    required_field = 'Required Field';
    required_fields = 'Required Fields';
    min_length_password = 'The minimum length for this field is 12 characters.';
    max_length_password = 'The maximum length for this field is 128 characters.';
    two_spaces = 'Consecutive spaces are not allowed';
    invalid_password = 'Password does not meet requirements';
    psw_must_contain = 'Password specifications';
    psw_rules_one = 'Include at least two special characters';
    psw_rules_two = "Can't contain two consecutive identical characters";
    psw_rules_three = "Can't contain the username";
    psw_rules_four = "Can't contain four consecutive keys on the qwerty keyboard";
    psw_rules_five = "Can't contain words from the Italian vocabulary";

    // Device session page
    connection_history = 'Connection history';
    client_web = 'Web, desktop and mobile clients currently connected to your account.';
    device = 'Device';
    last_activity = 'Last activity';
    revocation = 'Delete';
    revocation_msg = 'Revoking this token may prevent your device from being wiped if it hasn\'t started wiping yet.';
    delete_device = 'Disconnect';
    remote_wipe = 'Disconnected';
    update_successful = 'Update successfull!';
    update_failure = 'Error! Update failure';
    rename = 'Rename';
    new_name = 'New Name';
    edit_name = 'Edit Name';

    // Authentication page
    two_factor_auth = 'Two-factor authentication';
    use_second_factor = 'Use a second factor in addition to your password to increase security for your account.';
    backup_code = 'Backup code';
    backup_code_subtitle = 'Backup codes have been generated. 0 of 10 codes have been used.';
    regenerate_backup_codes = 'Regenerate backup codes';
    regenerate_backup_codes_progress = 'Regenerate backup codes in progress...';
    if_regenerate  = 'If you regenerate the backup codes, you will automatically invalidate the old codes.';
    totp = 'TOTP - Timebased One Time Password';
    totp_subtitle = 'Through the Google Authenticator authentication app you can apply strong authentication to your access.';
    enable_totp = 'Enable totp';
    your_new_totp = 'Your new TOTP code is:';
    configure = 'Now configure the authentication app:';
    step1 = '1- download the mobile app';
    step2 = '2- scan this QR code with your TOTP application';
    final_step = 'Once your application is set up, type in a test code below to make sure everything is working properly:';
    auth_code = 'Authentication code';
    totp_enabled = 'TOTP enabled';
    disable_totp = 'Disable TOTP';
    regenerates_totp = 'Regenerates TOTP';
    save_print_codes = 'These are your backup codes. Save and/or print them as you will not be able to read them later.';
    save_codes = 'Save backup codes';
    print_codes = 'Print backup codes';

    // Security Dialog
    security = 'Security';
    enter_pwd = 'Enter your vDesk password to enable the operation';
    cancel = 'Cancel';
    check = 'Check';
    generates = 'Generates';
    error_invalid_pwd = 'Wrong password';
    error_empty_pwd = 'Fill in the password field.';
    confirm = 'Confirm';
    generates_progress = 'Generates in progress...';
    confirm_progress = 'Confirm in progress...';

    // Encryption page
    increase_security = 'Increase the security of your emails and files by setting your encryption/decryption keys.';
    password = 'Password';
    encryption_password = 'Encryption password';
    pass_phrase = 'Passphrase';
    pwd_subtitle = 'Enter your password and passphrase. To be valid, the password must be at least 12 characters long';
    phrase_subtitle = 'The passphrase is a meaningful phrase of your choice, which you will need to keep in order to later export your encryption credentials to other new installations.';
    invalid_pwd = 'Invalid password';
    invalid_form = 'Fill in all fields of the form.';
    set_pwd_success = 'Encryption password set successfully!';
    set_pwd_failed = 'Encryption password setting failed.';
    confirm_pwd = 'Confirm encryption password';
    no_match_pwd = 'The entered password does not match.';
    save = 'Save';
    edit = 'Edit';

    // Configurations page
    conf_page_title = 'Application configurations';
    session_time = 'Session duration time';
    hour_label = 'hours';

    year_ago       = ' year ago';
    years_ago      = ' years ago';
    month_ago      = ' month ago';
    months_ago     = ' months ago';
    week_ago       = ' week ago';
    weeks_ago      = ' weeks ago';
    day_ago        = ' day ago';
    days_ago       = ' days ago';
    hour_ago       = ' hour ago';
    hours_ago      = ' hours ago';
    minute_ago     = ' minute ago';
    minutes_ago    = ' minutes ago';
    less_minute    = 'Less than a minute';

    // ADMIN SETTINGS
    admin_settings_title = 'Admin Area';
    vcanvas_settings = 'vCanvas';
    vpec_settings = 'vPec';
    vflow_settings = 'vFlow';
    vdpa_settings = 'vDpa';
    outlookSettings = 'Office 365 Integration';
    config_panel = 'Onlyoffice';
    username = 'Username';
    group = 'Group';
    enable = 'Enable';
    disable = 'Disable';
    save_success = 'Update successfull!';
    save_error = 'Update failure!';
    delete = 'Delete';
    reset_guest= 'Reset password';
    delete_success = 'Delete successfull!';
    delete_error = "Delete failure!";
    loading_error = "There was an error loading...";
    name = 'Name';
    user_name = "User Name";
    account_name = 'Displayed Name';
    email = 'Mail';
    groups = 'Groups';
    confirm_new_password = 'Confirm New Password';
    new_email = 'New Mail'; 
    close = 'Chiudi';
    description = 'Description';

    // Users Settings page
    users_settings = 'Users Settings';
    error_known_user = 'Error: user already existing';
    resend_mail = 'Mail successfully sended';
    userupdate_success = 'User successfully updated';
    psw_error = 'Wrong password';
    userdelete_success = 'User successfully deleted';
    disabled_users = 'Disabled Users';
    enabled_users = 'Enabled Users';
    user_manager_enabled = 'Enabled User Manager';
    user_manager_disabled = 'Disabled User Manager';
    disbale_user_manager= 'Disable user Manager';
    enable_user_manager= 'Enable user Manager';
    folder_manager_enabled = 'Folder Group Manager Enabled';
    folder_manager_disabled = 'Folder Group Manager Disabled';
    disbale_folder_manager= 'Disable folder group Manager';
    enable_folder_manager= 'Enable folder group Manager';
    users_subtitle = 'Add and manage Users';
    authentication_required = 'Authentication required';
    confirm_password_required = 'This action requires confirmation of your password';
    new_group_name = 'Choose the name of the new Group';
    enabled_modules = 'Enabled Module';
    quota = 'Quote';
    nolimits = 'Unlimited';
    error_nodata = 'Error: Missing data';
    user_delete = 'Delete User';
    user_deletedevices = 'Delete all devices';
    user_disable = 'Disable User';
    user_enable = 'Enable User';
    user_sendmail = 'Resend welcome mail';
    user_notfound = 'No user found';
    password_short_12 = 'Error: password minimum length is 12 characters';
    user_search = 'User Search';
    new_displayed_name = 'New Displayed Name';
    name_and_surname_new_user = 'Enter first and last name';
    user_created = 'User creation successfull!';
    new_user_password = 'Set new user password';
    disabled_users_subtitle = 'Manage disabled Users';
    new_username = 'Set new Username';
    no_special_space_character = 'Special character or spaces are not allowed';
    no_special_character = 'Special character are not allowed';
    nodata_user_search = 'No result for your search';
    user = 'The new user ';
    created = ' was created succesfully!';
    new_user = 'New users';
    new_user_file = 'New user from file';
    subtitle_new_user_file = 'Upload new user from file';
    subtitle_new_user_file_resume = "Upload resume:";
    subtitle_new_user = 'Set the data needed to create a new user';
    new_user_email = "Set the new user's email";
    new_user_username = "Enter user's username";
    new_user_quota = "Select space";
    new_user_groups = "Select groups";
    next = 'Next';
    invalid_email = "Invalid email";
    deleteUserDialogTitle = "Do you want to permanently delete the user?";
    deleteUserDialogContent = "The action is irreversible.";
    edit_user = "Edit User";
    role = "Role";
    error_update_user = "Error, user not modified";
    error_admin = "GGU does not have permissions to create an administrator account";
    add_user = "Add user";
    add_user_Tim = "Add Admin user";
    add_user_file = "Add from file";
    upload_file = "Upload file";
    file_name = "File name:";
    file_name_wrong = "Wrong file name.";
    file_name_format = "Use the format:ggmmaaaa-usercreationdata.txt";
    upload_error = "Error, upload failed";
    upload_disabled = "Disabled";
    upload_new = "Users create:";
    upload_new_Guest = "New Guest users:";
    upload_new_Saml = "New Saml users:";
    upload_total_Guest = "Total Guest users:";
    upload_total_Guest_modified = "Users Guest modified:";
    upload_total_records = "Total record:";
    upload_total_Saml = "Total Saml users:";
    upload_total_Saml_modified = "Users Saml modified:";


    // Groups Settings page
    groups_settings = 'Groups Settings';
    group_created = 'Group successfully created';
    group_created_error = 'There was an error while creating the group';
    create_group = 'Create Groups';
    group_deleted_success = 'Group successfully deleted';
    group_deleted_error = 'Error while deliting group';
    new_group = 'New Group';
    new_group_create = 'New group created';
    newgroupcreate_error = 'Error while creating group';
    group_subtitle = 'Add and manage user groups you need';
    group_title = 'User Groups';
    users = 'Users';
    space = 'Space';
    admin = 'Admin';
    admin_mail = 'Admin Mail';
    delete_group = 'Delete Group';
    group_name = 'Group Name';
    guests_settings = 'Guest management';
    empty_name_group = 'Enter a new group name';

    // vPEC Settings page
    vpec_title = 'vPEC Settings';
    disable_new = 'Allow personal domain';
    configured_domains = 'Configured domains';
    domains_imap = "Domains with authentication plain/gssapi";
    domains_type = 'Auth Type';
    imap_name = "Url Imap";
    addDomainImap = "Add Imap domain";
    imap_exist = "Imap domain already exist";
    new_imap = "Configure auth plain/gssapi for Imap domain";
    insert_all_imap_value = "Enter all the required values";
    domainName = 'Domain Name';
    host = 'host';
    port = 'Port';
    isPec = 'isPEC';
    active = 'active';
    actions = 'actions';
    addDomain = 'Aggiungi dominio';
    secure_print = 'Secure printing';
    set_secure_print = 'Set up secure printing';
    secure_print_tooltip = 'Define for all users of the system the watermark containing their name; surname and IP address.';
    attachments = 'Attachments';
    size_tooltip = 'Set a maximum attachment size. The value entered refers to the number of megabytes.';
    set_value = 'Set a value';
    contacts = 'Contacts';
    enable_contacts = 'Enable contacts';
    enable_contacts_dav = 'Enable DAV contacts';
    edit_domain = 'Edit Domain';
    new_domain = 'New Domain';
    domain_creation_failed = 'Domain creation failed.';
    check_config_param = 'Please check the configuration parameters entered.';
    imap = 'IMAP';
    smtp = 'SMTP';
    imap_protocol = 'Imap Protocol';
    imap_validate = 'Imap Validate';
    smtp_use_auth = 'SMTP Auth Use';
    imap_host = 'IMAP Host';
    smtp_host = 'SMTP Host';
    smtp_subtitle = 'Configure the server to send emails';

    // vCanvas settings page
    vcanvas_title = 'Service Settings';
    url_service = 'Service Url';
    vcanvas_users_settings = 'Users';
    vcanvas_users_settings_subtitle: 'Manage users';
    vcanvas_apps_settings = 'Applications';
    vcanvas_groups_settings = 'Groups';
    applications = 'Applications';

    admin_vcanvas_applications_tooltip = 'Add or remove applications to the user';    
    admin_vcanvas_group_applications_tooltip = 'Add or remove applications to the group';

    admin_vcanvas_create_applications_tooltip = 'Create an application';
    admin_vcanvas_new_application = 'New application';
    admin_vcanvas_new_application_tooltip = 'Create a new Canvas application';
    admin_vcanvas_groups_tooltip = 'Add groups to vCanvas';
    admin_vcanvas_groups_add_group_title = 'Add group to vCanvas';

    manage_apps = 'Manage Applications';
    
    application_created = 'Application successfully created';
    application_created_error = 'There was an error while creating the application';
    parameters = 'Parameters';
    hostname = 'Hostname';
    program = 'Program';
    working_directory = 'Working directory';

    // vFlow settings page
    vflow_title = 'Parameter Configuration';
    admin_account = 'Admin Account';
    server_port = 'Server port';
    group_designer = 'WFA Designer Group';
    group_super_admin = 'Super Admin Group';
    show_resolution_action = 'Show release action';
    sap_configuration = 'SAP Configuration';
    authentication_type = 'Authentication type';
    external_system = 'Progressive from external system';

    // vDpa settings page
    vdpa_title = 'vDPA Settings';
    signature_provider = 'Configured digital signature Providers';
    provider_service_name = 'Provider Name';
    provider_service_url = 'Url Service';
    supported_signatures = 'Supported Signatures';
    service_active = 'Service Active';
    edit_provider = 'Edit Provider';
    provider_update_failed = 'Edit Provider failure';
    provider_verify_url = 'Service Verify Url';
    provider_has_verify = 'Service has verify';
    extra_params = 'Extra Params';

    // ConfigPanel settings page
    onlyoffice_title = 'Onlyoffice Settings';
    onlyoffice_subtitle = 'Specifies the address of the server with the document services installed.';
    save_btn = 'Save';
    onlyoffice_update_succes = 'Url saved.';
    onlyoffice_update_error = 'Error! Url not saved.';

    // Guest settings
    search_users = 'Search guests by name and surname from the list';
    add_guest = 'Add guest';
    no_guest = 'There are no guests at the moment';
    first_noguest = 'Add new guest';
    second_noguest = 'Select the modules he will be able to use';
    third_noguest = "Confirms the activation of his account";
    error_guest_data = "Error: guest's datas incomplete";
    set_guest_data = "Set the details of the guest you want to invite";
    character_limit_50 = 'Max. 50 characters';
    character_limit_exceeded = 'Character limit exceeded';
    guest_name = 'Guest name';
    guest_surname = 'Guest surname';
    guest_username = 'Guest username';
    guest_company = 'Company name';
    guest_email = 'Company mail';
    guest_start = 'Start date';
    guest_end = 'End date';
    guest_managerName = 'Manager name';
    guest_managerSurname = 'Manager surname';
    guest_managerMail = 'Manager email';
    guest_managerUid = 'Manager UID';
    error_nameRequired = 'Name required';
    error_surnameRequired = 'Surname required';
    error_usernameRequired = 'Username required';
    error_companyRequired = 'Company required';
    error_emailRequired = 'Email required';
    error_startdateRequired = 'Start date required';
    error_enddateRequired = 'End date required';
    second_subtitle = 'Select for your guest the modules to be activated of the suite';
    third_subtitle = 'Are you sure you want to add the new guest?';
    guest_name_surname = 'Name and surname guest';
    active_modules = 'Modules to activate';
    guest_added_successfully = 'Guest successfully added';
    guest_reset_successfully = 'Password guest regenerated successfully';
    guest_updated_successfully = 'Guest successfully updated';
    guest_existing_mail = 'Email already in use';
    guest_existing_username = 'Username already in use';
    filter = 'Filter';
    filter_subtitle = 'Select the parameters of the files you want to view';
    confrim_newUser_subtitle = 'Confirm that you want to add a new user with these features';
    search_guest = 'Search guest';
    noguest_found = 'No guest found';    
    
    //Smtp settings
    smtpEncryption = "Encryption";
    smtpSenderAddress = 'Sender address';    
    smtpSenderAddressTooltip = 'posta@example.com';
    smtpAuthtypeTooltip = 'Authentication method';
    smtpAuthRequired = 'Authentication required';
    smtpHost = 'Server address';
    smtpHostTooltip = 'smtp.example.com';
    smtpPortTooltip = 'Port';
    smtpUsername = 'Username';
    smtpPassword = 'Password';
    smtpSendTestEmail = 'Send Test Email';
    smtpSave = 'Save';

    //saml settings
    saml_settings = ' SAML Users Settings';
    samldisable_settings = 'SAML Disabled Users Settings';
    samlUserName = 'User name';
    samlUserSurname = 'User surname';
    samlUserMail = 'User mail';
    samlUserSerial = 'User serial';
    samlUserStart = 'Start date';
    samlUserEnd = 'End date';
    samlUserQuota = 'Quota';
    samlUserProfile = 'Profile';
    samlUserGroups = 'Groups';
    samluserApps = 'Apps';
    samlBoss = 'Manager UID';
    samlBossName = 'Manager name';
    samlBossSurname = 'Manager surname';
    samlBossMail = 'Manager mail';
    samlSocietaName = "Company name";
    societaRequired = "Comapny name required";
    error_name_societa = "Company name not allowed";
    samluser_setData = "Set SAML user's info";
    error_serialRequired = 'Serial number required';
    error_quotaRequired = 'Quota required';
    error_uidRequired = 'UID required';
    error_profileRequired = 'Profile required';
    error_groupRequired = 'Groups required';
    error_samluserAdd = 'Error creation saml user';
    samluser_added_successfully = 'Saml user added successfully';
    samluser_updated_successfully = 'Saml user updated successfully';
    error_samluserUpdate = "Error update saml user";
    guestmanager_namesurname = "Manager name and surname";
    report = "Report utenti/profili";
    smtp_baderror = 'SMTP bad configured';
    smtp_noerror = 'SMTP not configured';
    userdelete_error = "Error while deleting user";
    userupdate_error = "Error while uploading user";
    resendmail_error = "Errorwhile sending mail";
    groupcreated_error = 'Error while creating group';
    usercreate_error = "Error while creation user";
    error_appslist = 'Error while loading apps';
    addUser = 'Add filtered user';
    errorGroupAdd = "Error while adding to group";
    userAdded = 'User added successfully';
    errorGroupDelete = "Error while deleting from group";
    userRemoved = "User successfully removed";
    removeUser = "Remove user from group";
    expirationResponseOK = "Expiration added successfully";
    expirationResponseKO = "An unexpected error occurred, please try again later";
    stagingAreaSettings = "Staging Area";
    type = "Type";
    length = "Length";
    createRelationship = "Create Relationship";
    child = "Child";
    parent = "Parent";
    table = "Table"
    foreignKey = "Foreign Key";
    renameTable = "Rename Table";
    deleteTable = "Delete Table";
    listTableFields = "List of Fields in Table";
    addField = "Add Field";
    relationships = "Relationships";
    listRelatedTables = "List of Relationships with";
    addRelationship = "Add Relationship";
    createTable = "Create Table";
    importData = "Import data";
    tableName = "Table Name";
    fields = "Fields";
    createField = "Create Field";
    editField = "Edit Field";
    data = "Data";
    listTablesData = "List of data from table";
    stagingAreaSettingsDescription = "Manage Staging Area tables, fields and relationships";
    selectPage = "Select Page";
    tableDialogValidator = "Table name must be 3 characters long and special characters are not allowed (except for _)";
    fieldDialogValidator = "Field name must be 3 characters long, must not end with 'id' and special characters are not allowed (except for _)";
    parentRelationshipsList = "Parent tables list";
    childRelationshipsList = "Children tables list";
    noTablesFound = "No tables found";
    deleteTableConfirm = "Are you sure you want to delete table";
    deleteFieldConfirm = "Are you sure you want to delete field";
    deleteRelationshipConfirm = "Are you sure you want to delete relationship";
    deleteTableConfirmMessage = "Deleting a table will also remove all the data contained in it, and it may invalidate some flows and relationships with other tables. Are you sure you want to continue?";
    iAmSure = "Yes, I am sure";
    irreversibleAction = "ATTENTION: This action is irreversible";
    with = "with";
    of = "of";
    loading: "Loading";
    primaryKey = "Primary Key";
    no_security = 'No security';
    no_security_spa = 'None with SPA';
    LoadingMenuError = "An error occurred while loading the menu";
    LoadingMenuErrorMessage = "make sure there are records in the specified table"
    LoadingMenuErrorMessageChild = "make sure there are records in the specified table and that the child table is correctly related to the parent table";
    Other = "Other";
    OtherValue = '"Other" Value';
    genericError = 'An error has occurred. Contact your system administrator';

    config: AppConfig

    constructor() {
        this.config = globals
        if(this.config.customCustomer?.toLowerCase() === CustomCustomer.AUSLBO) {
            this.show_resolution_action = 'Visualizza azioni conclusione'
        }
    }

}
