<?php 
require_once __DIR__ . '/lib/versioncheck.php';

try {
  require_once __DIR__ . '/lib/base.php';

  $cli = false;
  if (OC::$CLI) {
    $cli = true;
  }
  try {
    $urlGenerator = \OC::$server->getURLGenerator();
    $l = \OC::$server->getL10N('vdesk_saml');
    $config = \OC::$server->getConfig();
    $request = \OC::$server->getRequest();
    $userSession = \OC::$server->getUserSession();
    $session = \OC::$server->getSession();
  } catch (Throwable $e) {
    \OC::$server->getLogger()->logException($e);
    return;
  }
  $samlSettings = new \OCA\VDesk_SAML\SAMLSettings(
    $urlGenerator,
    $config,
    $request,
    $session
  );
  
  $userBackend = new \OCA\VDesk_SAML\UserBackend(
    $config,
    $urlGenerator,
    \OC::$server->getSession(),
    \OC::$server->getDatabaseConnection(),
    \OC::$server->getUserManager(),
    \OC::$server->getGroupManager(),
    $samlSettings,
    \OC::$server->getLogger()
  );
   $userBackend->registerBackends(\OC::$server->getUserManager()->getBackends());
   OC_User::useBackend($userBackend);

   
    $logger = \OC::$server->getLogger();
    //$config = \OC::$server->getConfig();
    $array="";
   // echo $argv[1].'\n';
    $stdin = fopen('php://stdin', 'r');
    $stdin1 = fopen('php://stdin', 'r');
    $stdin2 = fopen('php://stdin', 'r');
    $stdin3 = fopen('php://stdin', 'r');
    $stdinEsc = fopen('php://stdin', 'r');
     $log="";
     
    $akey="";
    echo 'Vuoi cancellare tutti gli utenti? (Y/n)';
    while (1) {
        $key = fgetc($stdin);
        break;
       
    }
    if ($key=='Y')
    {
      echo 'Sei sicuro che vuoi cancellare tutti gli utenti? (Yes/n)';
      while (1) {
        $keys = fgetc($stdin1);
        
        if ($keys == "\n")
        {   
          break;
        } 
        $akey=$akey.$keys;
      }
       
      if ($akey=="Yes")
      {
        echo "QUi sei entrato\n";
         $log=$log.ClearTbsUsers($arrayUser,true);   
      }
      else
      {
        echo "Esci\n";
        exit;
      }
    }
    else if($key=='n')
    {
      echo "Vuoi cancellare una lista di utenti? (Y/n)";
      while (1) {
        $key = fgetc($stdin2);
        break;
      }
      if ($key=='Y')
      {
        echo "Inserisci una lista di username separati da virgola\n";
        while (1) {
          $keys = fgetc($stdin1);
          $array=$array.$keys;
          if ($keys == "\n")
          {   
            break;
          } 
        }
        $log=$log.ClearTbsUsers($array,false);
      }
      else if ($key=='n')
      {
        echo "Vuoi cancellare tutti gli utenti ad esclusione di una lista? (Y/n)";
        while (1) {
          $key = fgetc($stdin3);
          break;
        }
        if ($key=='Y')
        {
          echo "Inserisci una lista di username separati da virgola\n";
          while (1) {
            $keys = fgetc($stdin1);
            $array=$array.$keys;
            if ($keys == "\n")
            {   
              break;
            } 
          }
          echo 'Sei sicuro che vuoi cancellare tutti gli utenti ad esclusione della lista? (Yes/n)';
          while (1) {
            $keys = fgetc($stdin1);
            if ($keys == "\n")
            {   
              break;
            } 
            $akey=$akey.$keys;
          }
           
          if ($akey=="Yes")
          {
             $log=$log.ClearAllNotUsers($array);
          }
          else
          {
            echo "Esci\n";
            exit;
          }
        }
        else
        {
          echo "\n";
          echo 'Esci';
          echo "\n";
          exit;
        }
      }
      else
      {
        echo "\n";
        echo 'Esci';
        echo "\n";
        exit;
      }
    }
    else
    {
      echo "\n";
      echo 'Esci';
      echo "\n";
      exit;
    }
   

    file_put_contents('/storage/reset_logs/log_'.date("j.n.Y").'_delete_user.log', $log, FILE_APPEND);
} catch (Exception $ex) {
  echo $ex;
  exit();
}  

function ClearAllNotUsers($arrayUser)
{
  $log=$log."elenco ".$arrayUser."\n";
   
  $userManager=\OC::$server->getUserManager();
  $split = explode(',', $arrayUser); 
  $users = $userManager->search("", 1000, 0);
  $usersNotExist=[];
  $isWrongUsers=false;
  $wronguser="";
  $groupManager =\OC::$server->getGroupManager();
  foreach($users as $user)
  {
     
    $isdelete = true;
    foreach($split as $username)
    {
      
      $userToExclude = \OC::$server->getUserManager()->get(trim($username));
      if (!is_null($userToExclude)) {
        
        if ($user->getUID()==$userToExclude->getUID())
        {
           $isdelete = false;
        }
      } 
    }  
    if ($isdelete)
    {
      $log=$log."CANCELLA DAL BACKEND ".$user->getBackendClassName()." L'UTENTE ".$user->getUID()."\n";
      echo "CANCELLA DAL BACKEND ".$user->getBackendClassName()." L'UTENTE ".$user->getUID()."\n";
      if (!$groupManager->isAdmin($user->getUID()))
      {
        $log=$log.deleteAll($user);
      }
      else
      {
        echo "L'UTENTE ".$user->getUID()." DEL BACKEND ".$user->getBackendClassName()." E' UN ADMIN NON PUO ESSERE CANCELLATO\n";
        $log=$log."L'UTENTE ".$user->getUID()." DEL BACKEND ".$user->getBackendClassName()." E' UN ADMIN NON PUO ESSERE CANCELLATO\n";
      }
    }
    else
    {
      $log=$log."LASCIA DAL BACKEND ".$user->getBackendClassName()." L'UTENTE ".$user->getUID()."\n";
      echo "LASCIA DAL BACKEND ".$user->getBackendClassName()." L'UTENTE ".$user->getUID()."\n";
       
    }
  }

  foreach($split as $username)
  {
    $userToExclude = \OC::$server->getUserManager()->get(trim($username));
    if (is_null($userToExclude)) {
      $log=$log."L'UTENTE ".trim($username)." NON ESISTE\n";
      echo "L'UTENTE ".trim($username)." NON ESISTE\n";
    }
  }
   return $log;
}

function ClearTbsUsers($arrayUser,$isAll)
{
   $log="";
   try
   {
    $userManager =\OC::$server->getUserManager();
    $groupManager =\OC::$server->getGroupManager();
    if ($isAll)
    {
      
      $users = $userManager->search("", 1000, 0);
      foreach($users as $user)
      {
        echo "CANCELLA DAL BACKEND ".$user->getBackendClassName()." L'UTENTE ".$user->getUID()."\n";
        $log=$log."CANCELLA DAL BACKEND ".$user->getBackendClassName()." L'UTENTE ".$user->getUID()."\n";
        if (!$groupManager->isAdmin($user->getUID()))
        {
          $log=$log.deleteAll($user);
        }
        else
        {
          echo "L'UTENTE ".$user->getUID()." DEL BACKEND ".$user->getBackendClassName()." E' UN ADMIN NON PUO ESSERE CANCELLATO\n";
          $log=$log."L'UTENTE ".$user->getUID()." DEL BACKEND ".$user->getBackendClassName()." E' UN ADMIN NON PUO ESSERE CANCELLATO\n";
        }
        
      }
    }
    else
    {
      
      $split = explode(',', $arrayUser);
      foreach($split as $username)
      {
        
        $user = \OC::$server->getUserManager()->get(trim($username));
        
        if (!is_null($user)) {
          echo "CANCELLA DAL BACKEND ".$user->getBackendClassName()." L'UTENTE ".$user->getUID()."\n";
          $log=$log."CANCELLA DAL BACKEND ".$user->getBackendClassName()." L'UTENTE ".$user->getUID()."\n";
          if (!$groupManager->isAdmin($user->getUID()))
          {
            $log=$log.deleteAll($user);
          }
          else
          {
            echo "L'UTENTE ".$user->getUID()." DEL BACKEND ".$user->getBackendClassName()." E' UN ADMIN NON PUO ESSERE CANCELLATO\n";
            $log=$log."L'UTENTE ".$user->getUID()." DEL BACKEND ".$user->getBackendClassName()." E' UN ADMIN NON PUO ESSERE CANCELLATO\n";
          }
        } 
        else
        {
  
            $log=$log."L'UTENTE ".trim($username)." NON ESISTE\n";
          echo "L'UTENTE ".trim($username)." NON ESISTE\n";
        }
      }
    }
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
}
  
  function deleteAll($user)
  {
     $log="";
    try
    {
      $uid = $user->getUID();
      $log=$log."START DELETE ".$uid."\n"; 
      echo "START DELETE ".$uid."\n"; 
      $log=$log.deleteAccount($uid);
      $log=$log.deleteActivity($uid);
      $log=$log.deleteAuthToken($uid);
      $log=$log.deleteBruteForceAttempts($uid);
      $log=$log.deleteCard($uid);
      $log=$log.deleteCredential($uid);
      $log=$log.deleteFilesTrash($uid);
      $log=$log.deleteGroupUser($uid);
      $log=$log.deleteMounts($uid);
      $log=$log.deletePreferences($uid);
      $log=$log.deleteShare($uid);
      $log=$log.deleteStorages($uid); 
      $log=$log.deleteTwofactorBackupcodes($uid);
      $log=$log.deleteTwofactorProviders($uid);
      $log=$log.deleteTwofactorTotpSecrets($uid);
      
    //  $log=$log.deleteVcanvasUsers($uid);
      $log=$log.deleteVcategory($uid);
      $log=$log.deleteVdeskDashboard($uid);
      $log=$log.deleteVdeskRssFeeder($uid);
      $log=$log.deleteVdeskSamlAuthToken($uid);
      $log=$log.deleteVdeskSamlUsers($uid);
      $log=$log.deleteVdeskTodos($uid);
      $log=$log.deleteVdeskUserApps($uid);
      $log=$log.deleteVdeskUserDetails($uid);
      $log=$log.deleteVdocAccount($uid);
      //  deleteVdocActivity($uid);
      //  deleteVdocShare($uid);
      $log=$log.deleteVencryptSecurity($uid);
      $log=$log.deleteRegistration($uid);
      $log=$log.deleteUsers($uid);
      $log=$log."END DELETE ".$uid."\n";
      echo "END DELETE ".$uid."\n";
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
    //// not included in TIM  
    // deleteShareExternal($uid,$query);
  }

  function deleteAccount($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
      $query->delete('accounts')
        ->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
        ->execute();
        $log=$log."delete accounts by ".$uid."\n";
        echo "delete accounts by ".$uid."\n"; 
        return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }
  
  function deleteActivity($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('activity')
			->where($query->expr()->eq('user', $query->createNamedParameter($uid)))
      ->execute();
      $log=$log."delete activity by ".$uid."\n";
      echo "delete activity by ".$uid."\n"; 
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }

  function deleteAuthToken($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
      $query->delete('authtoken')
        ->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
        ->execute();
        $log=$log."delete authtoken by ".$uid."\n";
        echo "delete authtoken by ".$uid."\n";
        return $log;
      }
      catch (Exception $ex) {
        echo $ex."\n";
        return $log=$log.$ex."\n";
      } 
  }

  function deleteBruteForceAttempts($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $dbConn = \OC::$server->getDatabaseConnection();
    $query->delete('bruteforce_attempts')
    ->where($query->expr()->like('metadata', $query->createNamedParameter(
      '%' . $dbConn->escapeLikeParameter($uid) . '%'
    )))
    ->execute();
    $log=$log."delete bruteforce_attempts by ".$uid."\n";
    echo "delete bruteforce_attempts by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }
 
  function deleteCard($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $result = $query->select('uid','id')
			->from('cards')
			->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
			->execute();
      while($row = $result->fetch()) {
        $log=$log."delete card ".$row['id']."\n";
        echo "delete card ".$row['id']."\n"; 
        deleteCardProperty($row['id'],$query);
      }
		 

      $query->delete('cards')
        ->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
        ->execute();
        $log=$log."delete cards by ".$uid."\n";
        echo "delete cards by ".$uid."\n"; 
        return $log;
      }
      catch (Exception $ex) {
        echo $ex."\n";
        return $log=$log.$ex."\n";
      } 
  }

  function deleteCardProperty($id)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('cards_properties')
    ->where($query->expr()->eq('cardid', $query->createNamedParameter($id)))
    ->execute();
    $log=$log."delete cards_properties by ".$id."\n";
    echo "delete cards_properties by ".$id."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteCredential($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('credentials')
			->where($query->expr()->eq('user', $query->createNamedParameter($uid)))
      ->execute();
      $log=$log."delete credentials by ".$uid."\n";
      echo "delete credentials by ".$uid."\n"; 
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }

  function deleteFilesTrash($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('files_trash')
			->where($query->expr()->eq('user', $query->createNamedParameter($uid)))
      ->execute();
      $log=$log."delete files_trash by ".$uid."\n";
      echo "delete files_trash by ".$uid."\n";
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }

 
 
  function deleteGroupUser($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('group_user')
			->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
      ->execute();
      $log=$log."delete group_user by ".$uid."\n";
      echo "delete group_user by ".$uid."\n";
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }

  function deleteMounts($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('mounts')
			->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
      ->execute();
      $log=$log."delete mounts by ".$uid."\n";
      echo "delete mounts by ".$uid."\n";
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }

  function deleteNotifications($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('notifications')
			->where($query->expr()->eq('user', $query->createNamedParameter($uid)))
      ->execute();
      $log=$log."delete notifications by ".$uid."\n";
      echo "delete notifications by ".$uid."\n";
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }

  function deletePreferences($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('preferences')
			->where($query->expr()->eq('userid', $query->createNamedParameter($uid)))
      ->execute();
      $log=$log."delete preferences by ".$uid."\n";
      echo "delete preferences by ".$uid."\n";
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }

  function deleteShare($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('share')
			->where($query->expr()->eq('uid_owner', $query->createNamedParameter($uid)))
      ->orWhere($query->expr()->eq('share_with', $query->createNamedParameter($uid)))
      ->execute();
      $log=$log."delete share by owner ".$uid."\n";
      echo "delete share by owner ".$uid."\n";
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }

  function deleteShareExternal($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('share_external')
			->where($query->expr()->eq('user', $query->createNamedParameter($uid)))
      ->execute();
      $log=$log."delete share_external by owner ".$uid."\n";
      echo "delete share_external by owner ".$uid."\n";
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }

  function deleteStorages($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $dbConn = \OC::$server->getDatabaseConnection();
    $query->delete('storages')
    ->andWhere($query->expr()->like('id', $query->createNamedParameter(
      '%' . $dbConn->escapeLikeParameter($uid) . '%'
    )))
    ->execute();
    $log=$log."delete storages by ".$uid."\n";
    echo "delete storages by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteSystemtag($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('systemtag')
    ->where($query->expr()->eq('user', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete systemtag by ".$uid."\n";
    echo "delete systemtag by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteTwofactorBackupcodes($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('twofactor_backupcodes')
    ->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete twofactor_backupcodes by ".$uid."\n";
    echo "delete twofactor_backupcodes by ".$uid."\n"; 
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteTwofactorProviders($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('twofactor_providers')
    ->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete twofactor_providers by ".$uid."\n";
    echo "delete twofactor_providers by ".$uid."\n"; 
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteTwofactorTotpSecrets($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('twofactor_totp_secrets')
    ->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete twofactor_totp_secrets by ".$uid."\n";
    echo "delete twofactor_totp_secrets by ".$uid."\n"; 
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteRegistration($uid)
  {
     $log="";
    try
    {
      $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
      $query->delete('registration')
      ->where($query->expr()->eq('username', $query->createNamedParameter($uid)))
      ->execute();
      $log=$log."delete registration by ".$uid."\n";
      echo "delete registration by ".$uid."\n"; 
      return $log;
    }
    catch (Exception $ex) {
      echo $ex."\n";
      return $log=$log.$ex."\n";
    } 
  }

  function deleteUsers($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('users')
    ->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete users by ".$uid."\n";
    echo "delete users by ".$uid."\n"; 
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVcanvasUsers($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vcanvas_users')
    ->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vcanvas_users by ".$uid."\n";
    echo "delete vcanvas_users by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVcategory($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $result = $query->select('uid','id')
			->from('vcategory')
			->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
			->execute();
      while($row = $result->fetch()) {
        $log=$log."delete category ".$row['id']."\n";
        echo "delete category ".$row['id']."\n";
        deleteVcategoryToObject($row['id'],$query);
      }
		  

    $query->delete('vcategory')
    ->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vcategory by ".$uid."\n";
    echo "delete vcategory by ".$uid."\n"; 
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }


  function deleteVcategoryToObject($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vcategory_to_object')
    ->where($query->expr()->eq('categoryid', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vcategory_to_object by ".$uid."\n";
    echo "delete vcategory_to_object by ".$uid."\n"; 
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdeskDashboard($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdesk_dashboard')
    ->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdesk_dashboard by ".$uid."\n";
    echo "delete vdesk_dashboard by ".$uid."\n"; 
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdeskRssFeeder($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdesk_rssfeeder')
    ->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdesk_rssfeeder by ".$uid."\n";
    echo "delete vdesk_rssfeeder by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  // function deleteVdeskSamlAuthrequest($uid,$query)
  // {
     
  //   $query->delete('vdesk_saml_authrequests')
  //   ->where($query->expr()->eq('auth-request-id', $query->createNamedParameter($uid)))
  //   ->execute();
  //   echo "delete vdesk_dashboard by ".$uid;
  //   echo "\n";
  // }

  function deleteVdeskSamlAuthToken($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdesk_saml_auth_token')
    ->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdesk_saml_auth_token by ".$uid."\n";
    echo "delete vdesk_saml_auth_token by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdeskSamlUsers($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdesk_saml_users')
    ->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdesk_saml_users by ".$uid."\n"; 
    echo "delete vdesk_saml_users by ".$uid."\n"; 
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdeskTodos($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $result = $query->select('user_id','id')
    ->from('vdesk_todos')
    ->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
    ->execute();
    while($row = $result->fetch()) {
      
      deleteVdeskTodosShares($row['id'],$query);
    }
    $query->delete('vdesk_todos')
    ->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdesk_todos by ".$uid."\n";
    echo "delete vdesk_todos by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdeskTodosShares($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdesk_todos_shares')
    ->where($query->expr()->eq('owner_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdesk_todos_shares by ".$uid."\n";
    echo "delete vdesk_todos_shares by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdeskUserApps($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdesk_userapps')
    ->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdesk_userapps by ".$uid."\n";
    echo "delete vdesk_userapps by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdeskUserDetails($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdesk_user_details')
    ->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdesk_user_details by ".$uid."\n";
    echo "delete vdesk_user_details by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdocAccount($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $result = $query->select('username','id')
    ->from('vdoc_account')
    ->where($query->expr()->eq('username', $query->createNamedParameter($uid)))
    ->execute();
    while($row = $result->fetch()) {
      
      deleteVdocAccountDossier($row['id'],$query);
      deleteVdocAccountRole($row['id'],$query);
      deleteVdocPermission($row['id'],$query);
    }

    $query->delete('vdoc_account')
    ->where($query->expr()->eq('username', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdoc_account by ".$uid."\n";
    echo "delete vdoc_account by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  
  function deleteVdocAccountDossier($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdoc_account_dossier')
    ->where($query->expr()->eq('account_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdoc_account_dossier by ".$uid."\n"; 
    echo "delete vdoc_account_dossier by ".$uid."\n"; 
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdocAccountRole($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdoc_account_role')
    ->where($query->expr()->eq('account_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdoc_account_role by ".$uid."\n";
    echo "delete vdoc_account_role by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdocActivity($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdoc_activity')
    ->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdoc_activity by ".$uid."\n";
    echo "delete vdoc_activity by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdocPermission($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdoc_permission')
    ->where($query->expr()->eq('account_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdoc_activity by ".$uid."\n"; 
    echo "delete vdoc_activity by ".$uid."\n"; 
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVdocShare($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vdoc_share')
    ->where($query->expr()->eq('uid', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vdoc_share by ".$uid."\n";
    echo "delete vdoc_share by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }

  function deleteVencryptSecurity($uid)
  {
     $log="";
    try
    {
    $query = \OC::$server->getDatabaseConnection()->getQueryBuilder();
    $query->delete('vencrypt_security')
    ->where($query->expr()->eq('user_id', $query->createNamedParameter($uid)))
    ->execute();
    $log=$log."delete vencrypt_security by ".$uid."\n";
    echo "delete vencrypt_security by ".$uid."\n";
    return $log;
  }
  catch (Exception $ex) {
    echo $ex."\n";
    return $log=$log.$ex."\n";
  } 
  }