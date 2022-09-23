import { DictionaryInterface } from './dictionary.interface';

export class Dictionary implements DictionaryInterface {
    welcome = 'Hello';
    ph_user_login = 'Enter your username';
    ph_password = 'Enter your password';
    error_user_login = 'Fill in the email/username field';
    error_pwd_login = 'Fill in the password field';
    pwd_recovery = 'Did you forget your password?';
    msg_pwd_recovery = 'We have sent a password reset email to the email address we know for this account. ' +
                        'If you don\'t receive it in a reasonable time, check your junk mail folders. ' +
                        'If it is not even there, contact your local administrator.';
    msg_pwd_recovery_LDAP = 'We have sent a password reset email to the system administrator.';
    error_invalid_login = 'Invalid Username and/or Password';
    login_workstation = 'Login to your workstation';
    bt_login = 'LOGIN';
    saml_login = 'Login with ';
    digital_workspace = 'Your digital workspace';
    bt_login_progress = 'LOGIN IN PROGRESS...';
    bt_pwd_recovery = 'PASSWORD RECOVERY';
    bt_pwd_recovery_progress = 'PASSWORD RCOVERY IN PROGRESS';
    back_to_login = 'Go back to Login';
    label_verify_identity = 'Verify your identity';
    label_enter_code = 'Enter the code generated by your authentication app';
    ph_code = 'Enter the code';
    error_code = 'Fill in the code field';
    error_invalid_login_totp = 'Invalid Code';
    use_backup_code = 'Use a backup code';
    label_enter_backup_code = 'Enter one of the backup codes you saved when you set up two-factor authentication.';
    ph_backup_code = 'Enter the backup code';
    owner_title = 'Created by:';
    partecipants_title = 'Participants:';
    search_in = 'Search in';
    label_profile = 'Profile';
    label_settings = 'Settings';
    label_admin_settings = 'Admin Area';
    label_logout = 'Log out';
    check_stay_connected = 'Stay connected';
    //msg_today_is = 'Today is';
    start_your_business = 'Start your business';
    title_check_activities = 'Check the office activities';
    check_file_activities = 'Check file and folder activities';
    activity = 'Activities';
    check_who_what_when = 'control who, what and when an action takes place on your files';
    vmeet_card_subtitle = 'Organize and manage scheduled meetings';
    vpec_card_subtitle = 'Organize and manage your Emails';
    vcal_card_subtitle = 'Organize and manage your next events';
    vshare_card_subtitle = 'Manage and share your files securely';
    vcanvas_card_subtitle = 'Work in the cloud with your favorite software';
    vflow_card_subtitle = 'Start a request and track its progress';
    launch_app = 'LAUNCH THE APP';
    create_meeting = 'Open vMeet';
    write_email = 'Open vPec';
    create_event = 'Open vCal';
    open_vshare = 'Open vShare';
    open_vcanvas = 'Open vCanvas';
    open_vflow = 'Open vFlow';
    open_meet = 'Open Meet';
    open_pec = 'Open Pec';
    open_cal = 'Open Cal';
    open_share = 'Open Share';
    open_canvas = 'Open Canvas';
    open_flow = 'Open Flow';
    used_space = 'of space used';
    colleagues_activities = 'colleagues activities';
    changed_data = 'changed data';
    connected_colleagues = 'connected colleagues';
    work_your_favorites = 'Favorites file';
    manage_files = 'Manage and share your files safely';
    who_waiting_answer = 'Your Emails';
    contact_colleagues = 'Instantly contact all colleagues';
    plan_meetings = 'Instantly contact all colleagues';
    discover_apps = 'Discover the available Apps of the VDesk platform';
    find_out_more = 'Find out more';
    vpec_b_title = 'Encrypted PEC mail client';
    vpec_b_descr = 'Safely manage your mailboxes PEC and ordinary e-mail';
    vconnect_b_title = 'Audio video and chat conferences';
    vconnect_b_descr = 'Communicate instantly with colleagues inside and outside the company';
    vcal_b_title = 'Synchronized calendar';
    vcal_b_descr = 'Organize events and people on a calendar synchronized with the system ones';
    vcanvas_b_title = 'Application Virtualization';
    vcanvas_b_descr = 'Use Windows desktop applications remotely with your access to vDesk';
    vflow_b_title = 'Workflow manager';
    vflow_b_descr = 'Create and participate in your business processes';
    reply_your_contacts = 'Reply to your contacts';
    plan_your_meetings = 'Your meetings';
    plan_your_rooms = 'Organize and manage rooms';
    next_appointments = 'Your appointments';
    organize_appointments = 'Organize and share business appointments';
    request_hr = 'Your application forms';
    manage_processes = 'Manage and participate in business processes';
    activities_address_book = 'Activities in the address book';
    manage_contancts = 'Manage and share contacts securely';
    access_apps = 'Your apps';
    all_your_apps = 'All your apps at your fingertips';
    dashboard_loading = 'Loading...';
    no_be_services = 'Waiting for backend services';
    unlimited_space = 'unlimited space';
    no_notification = 'You don\'t have any notifications yet';
    read_all_notif = 'MARK ALL AS READ';

    no_card_data_activities = 'Ooops, there is no activity of your colleagues on files or folders.';
    no_card_data_favorites = 'Ooops, you don\'t have any files or folders in your Favorites yet.';
    no_card_data_vconnect = 'Ooops, there are no colleagues waiting for your answer.';
    no_card_data_vmeet = 'Ops, there are no scheduled meetings.';
    no_card_data_vpec = 'Ooops, there are no colleagues waiting for your answer.';
    no_card_data_vcal = 'Oops, you don\'t have any appointments on the agenda yet.';
    no_card_data_vflow = 'Oops, you don\'t have any processes enabled yet, contact your system administrator to get started.';
    no_card_data_vcanvas = 'Oops, you don\'t have any apps yet.';

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

    bt_dismiss_all_notification = 'Dismiss all notification';
    desc_label_in_sys = 'LABELS PRESENT IN THE SYSTEM';
    notRepeatItself = 'Not repeat itself';
    secondly = 'Secondly';
    minutely = 'Minutely';
    hourly = 'Hourly';
    daily = 'Daily';
    weekly = 'Weekly';
    monthly = 'Monthly';
    yearly = 'Yearly';

    goodMorning_msg = 'Good Morning';
    good_msg = 'Good';
    morning_msg = 'as you work on carbide, take a look at today\'s activities';
    afternoon_msg = 'let\'s start once again! Below are the afternoon activities';
    eavening_msg = 'the day is over, finally a little relaxation, here you have everything under control';
    download_apps = 'Download Desktop Apps';
    download_title = 'Here you can download your vDesk desktop App';
    download_mobile_apps = 'Download and manage your App';
    download = 'Download';
    download_now = 'Download now';
    select_app = 'Download the vDesk desktop App and modules included';
    back = 'Back';
    header_claim_msg = 'Your <span class="claim-text-blue">office</span>, where you want, when you want';
    header_claim_msg_notbox = 'Your <span class="claim-text-blue notbox">office</span>, where you want, when you want';

    no_special_character = 'Special characters are not allowed on search';
    no_spaces_special_character = 'Special characters or spaces are not allowed on Username field';
    screenshots_disabled = 'Screenshots disabled';
    no_app = 'No app Enabled';

    // External-sharedbylink
    creates = 'Create';
    suite_vdesk = 'Suite VDesk';
    insert_password = 'Enter password';
    link_pass = 'The sharing link was generated together with a password, enter it below to access the data';
    enter = 'Enter';
    password = 'Password';
    psw_error = 'Wrong password';
    pws_error_no_pws = 'No password entered';
    shared_by = 'Shared by ';
    actions = 'Actions';
    info_file_folder = 'Select a file or folder to view its details here';
    delete = 'Delete';
    movecopy = 'Move or Copy';
    rename = 'Rename';
    upload_from_pc = 'Upload from pc';
    folder = 'Folder';
    folders = 'Folders';
    file = 'File';
    files = 'Files';
    selected_singular = 'selected';
    selected_plural = 'selected';
    and = 'and';
    delete_dialog_file = 'Are you sure you want to delete this file?';

    upload_file = 'Upload File';
    new_text_doc = 'New Text Document';
    new_doc = 'Note';
    new_exel_doc = 'Spreadsheet';
    new_power_doc = 'Presentation';
    folder_name = "Folder Name";
    file_name = 'File Name';
    document_name = 'Document Name';
    exel_name = 'Sheet name';
    powerpoint_name = 'Presentation name';
    folder_exist = 'Folder already exist';
    file_exist = 'Note already exist';
    no_name = 'Enter name';

    name = 'Name';
    size = 'Size';
    last_update = 'Last Update';
    label_shared = 'Shared';
    deleted_files_success = 'Files deleted successfully';
    errorDelete = 'Error while deleting files';
    nodata_title = 'There is no file here';
    allfiles_nodata_desc = 'Create or upload new content or sync it from your devices';

    no_folder = 'No folder found';
    choose_destination = 'Choose target folder';
    create_folder = 'Create Folder';
    copy = 'Copy';
    move = 'Move';

    edit = 'Edit';
    dashboardMenuBtn = 'Dashboard';
    remindersMenuOption = 'Reminders';
    titleEditDashboard = 'Edit Dashboard';
    subtitleEditDashboard = 'Customize the position of your Dashboard elements';
    titleMainSection = 'BACKGROUND';
    cancel = 'CANCEL';
    save = 'SAVE';
    titleChangeColor = 'Set a color';
    subtitleChangeColor = 'Select a Dashboard background color';
    titleChangeImage = 'Set a wallpaper';
    subtitleChangeImage = 'Upload an image as the Dashboard background';
    setImageText = 'Image selection';
    titleSection = 'SPACE';

    titleDraggableCard = 'Module';
    subtitleDraggableCard = 'Drag the form to a new location';
    dragMessageVmeet = 'Your meetings';
    dragMessageVpec = 'Your Email';
    dragMessageVcal = 'Your appointments';
    dragMessageVshare = 'Favorite files';
    dragMessageVcanvas = 'Your apps';
    dragMessageVflow = 'Your application forms';

    newsTitle = 'News';
    newsSubtitle = 'Select and monitor your favorite information sources';
    remindersTitle = 'Reminders';
    remindersSubtitles = 'Check and manage your reminders';
    swapModule = 'Swap modules';
    titleDraggableNewsArea = 'News and Reminder Area';
    subtitleDraggableNewsArea = 'Drag the area to a new position or reverse its modules';
    disableNewsArea = 'Deactivate';
    donePostIt = 'Done';
    completePostIt = 'Completed';
    addNewPostIt = 'Add a reminder';
    titleDialogNewsArea = 'Change item position';
    contentDialogNewsArea = 'You are moving the News and Reminders Area, the other modules will be moved to the place of this area. Do you want to proceed?';
    cancelBtnDialogNewsArea = 'Cancel';
    confirmBtnDialogNewsArea = 'Confirm';
    titleAddPostItField = 'Title';
    shareAddPostItField = 'Share with';
    descriptionAddPostField = 'Description';
    titleDialogAddPostIt = 'New reminders';
    subtitleAddPostItField = 'Define a title, description and share the memo if needed';
    backDialogAddPostIt = 'BACK';
    confirmDialogAddPostIt = 'CONFIRM';
    requiredFieldsText = 'Required fields';
    titleHintDialogAddPostIt = 'Max. 50 characters';
    descriptionHintDialogAddPostIt = 'Max. 72 characters';
    successCreatePostItMsg1 = 'The new';
    successCreatePostItMsg2 = 'reminder has been successfully created.';
    successDonePostItMsg1 = 'The reminder';
    successDonePostItMsg2 = 'was completed successfully';
    setSourcesFeed = 'Sources setup';
    hideNewsAndReminders = 'Hide News and Reminders';
    subtitleUrlFeedDialog = 'Set a name and paste the url of the RSS feed you want to view in the News area';
    inputNameFeedDialog = 'Source name';
    inputUrlFeedDialog = 'Paste feed';
    successFeedUrlUpdateMsg = '<b>News</b> area source settings have been successfully confirmed.';
    noFeedsTitle = 'A source for the News area has not yet been set';
    noFeedsSubtitle = 'You can always change it from the News area menu';
    setFeedsBtn = 'SET A SOURCE';
    characterLimitError = 'Character limit exceeded';
    noPostItMsg = 'You don\'t have any active reminders yet';

    // OAuth2
    connect_account = 'Connect to your account';
    error_connection = 'Error!';
    access_account = 'Account access';
    login_before = 'Please log in before granting';
    access_to = 'You are going to grant';
    access = 'access to your vDesk account';
    grant_access = 'Grant access';
    connected_account = 'Connected account';
    not_connected_account = 'Account not connected';
    connected_client = 'Client should be connected!';
    close_window = 'You can close this window';
    alert = 'If you are not trying to set up a new device or app, someone is trying to trick you into granting them access to your data. In this case do not proceed and instead contact your system administrator';

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
    save_print_codes = 'These are your backup codes. Save and/or print them as you will not be able to read them later.';
    save_codes = 'Save backup codes';
    print_codes = 'Print backup codes';
    check = 'Check';
    // reminders page
    filterBtnText = 'Filter';
    searchPlaceholder = 'Search';
    pageTitle = 'Reminders';
    bigSubtitleActive = 'Active reminders';
    littleSubtitleActive = 'View active reminders and add new ones.';
    bigSubtitleCompleted = 'Completed reminders';
    // tslint:disable-next-line: max-line-length
    littleSubtitleCompleted = 'View completed reminders, each element will be found in the history for N months following its completion, then they will be permanently deleted.';
    backButton = 'Back';
    noSearchResultsMsg = 'The search did not return any results';
    // reminders filters dialog
    titleRemindersFiltersDialog = 'Historical reminder | Filters';
    subTitleRemindersFiltersDialog = 'Select the parameters by which you want to filter the Reminder History';
    placeholderDateFrom = 'From';
    placeholderDateTo = 'To';
    checkPersonalReminders = 'Personal reminders';
    checkSharedReminders = 'Shared reminders';
    placeholderAssociatedUsers = 'Select colleagues associated with reminders';
    placeholderNoAssociatedUsers = 'There are no colleagues associated with the reminders';
    resetFiltersBtn = 'RESET FILTER';
    filterBtn = 'FILTER';
    checkBoxErrorUnchecked = '* Select at least one of the two options';
    otherLabelUsers = 'Colleague';
    othersLabelUsers = 'Colleagues';
    tooltipSharedWith = 'Shared with';
    tooltipSharedBy = 'Shared by';
    userAlreadyOnline = 'User already logged';
    userNotFound = 'User not found';
    //Smtp settings
    none = 'None';
    smtpLogin = 'Access';
    smtpPlain = 'Plain';
    smtpNtlm = 'NT LAN manager';
    smtpSslTls = 'SSL/TLS';
    smtpStartTls = 'STARTTLS';
    // ilde time
    idleTitleDialog = 'Your session is about to expire';
    idleContentDialog = 'You\'re being timed out due to inactivity. Please choose to stay signed in or to logoff. Otherwise, you will logged off automatically.';
    idleLogoutBtn = 'Logout';
    idleStayLoggedBtn = 'Stay Logged';

    error_backup_codes = 'Backup code invalid or already used';
    bt_login_external = 'Login External User';

    disabled_user = 'The entered user is Disabled,please contact the administrator';
    user_dont_exist = "The entered user does't exist";
    username_password_error = 'Incorrect username or password';

    //change password guest
    wrong_password = 'Wrong password!';
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
    login_password = 'Login password';
    old_password = 'Old password';
    new_password = 'New password';
    confirm_password = 'Confirm password';
    save_password_message = 'Password saved!';
    no_save_password_message = 'Error! Password not saved';
    new_password_guest = "Change your password to log in for the first time";
    totp_error = 'Wrong TOTP code';
    PageNotFoundTitle = '404 Error';
    PageNotFoundSubtitle = 'Page not found';

    expiration = "Expiration";
    assignExpiration = "Assign Expiration";
    editExpiration = "Edit Expiration";
    expirationType = "Expiration type";
    expirationDate = "Expiration date";
    expirationTime = "Expiration Time";
    priority = "Priority";
    alertType = "Alert type";
    alertDate = "Alert date";
    alertTime = "Alert time";
    participants = "Assignees";
    managers = "Managers";
    managers_adp = "Managers/RUP/DEC";
    officeGroup = "Group";
    explanationText = "Set the expiration date of your document and share it with the users.";
    invalidEmail = "Invalid email";
    createExpirationType = "Create Expiration Type";
    expirationTypeName = "Name";
    assign = "Assign";
    expirationResponseOK = "Expiration added successfully";
    expirationResponseKO = "An unexpected error occurred, please try again later";
    expirationUpdatedOK = "Expiration updated successfully";
    expirationDeletedOK = "Expiration deleted successfully";
    expirationPlanned = "Expiration planned";
    expirationEdited = "Expiration edited";
    expirationDeleted = "Expiration deleted";
    expirationSolved = "Expiration solved";
    expirationApproved = "Expiration approved";
    expirationSolve = "Solve";
    expirationApprove = "Approve";
    expirationWaitForApprovation = "Waiting for approvation";
    gotoDocument = "Document";
    gotoMail = "Email";
    gotoCalendar = "Calendar";
    more = "More";
    priority_low = "LOW";
    priority_medium = "MEDIUM";
    priority_high = "HIGH";
    alert_single = "Single";
    alert_every_day = "Every day";
    alert_every_week = "Every week";
    alert_every_month = "Every month";
    alert_every_year = "Every year";

    repetition = "Repetition";
    confirm = "Confirm";
    undo = "Cancel";
    edit_confirmation = "Be carefull, you're going to edit all of the related expirations";

    repeated = "Repeatable";

    select_time_error = "Be careful, define a date and an hour to repeat the expiration";
    extend = "Extend";
    until = "Until";
    elapse = "Elapse";
}
