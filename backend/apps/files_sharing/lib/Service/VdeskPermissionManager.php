<?php

namespace OCA\Files_Sharing\Service;

use OC\Core\Command\App\GetPath;
use OC\Files\Node\File;
use OC\Files\Node\Folder;
use OC\Files\Node\Node;
use OC\Share20\Share;
use OC\Share\Share as ShareShare;
use OCP\IUser;
use OCP\Share\IShare;
use Sabre\DAV\INode;

class VdeskPermissionManager
{

    /** @var Folder */
    protected $shareFolder = null;

    /** @var bool */
    protected $customSharesPermissionsNonHereditary;

    public function __construct()
    {
        $this->customSharesPermissionsNonHereditary = boolval(\OC::$server->getConfig()->getAppValue('core', 'custom_shares_hereditary', true));
    }
    
    public function getAvailableUsers(array $resultsArray, int $nodeId)
    {
        try {
            $result = $resultsArray;
            $node = \OC::$server->getRootFolder()->getById($nodeId);
            if (is_array($node) && count($node) >= 1) {
                //retrieve parent
                $node = $node[0];
                $parent = $node->getParent();
                if ($parent->getInternalPath() !== 'files') {
                    if (!$this->customSharesPermissionsNonHereditary) {
                        $node = $parent;
                    } else {
                        if ($node->getOwner() != \OC::$server->getUserSession()->getUser()) {
                            $node = $this->getFirstShareNode($node)->getParent();
                        } else {
                            $node = $this->getFirstShareNode($node);
                        }
                    }
                } else {
                    if ($node->getOwner() != \OC::$server->getUserSession()->getUser()) {
                        if ($this->isUserIntoFolderPermissions($node->getId(), \OC::$server->getUserSession()->getUser(), $node->getOwner()->getUID())) {
                            $users = $this->getUsersIntoFolderPermissions($node->getId(), $node->getOwner()->getUID());
                            $this->handleShareableUsers($users, $result);
                        } else {
                            $this->handleShareableUsers([], $result);
                        }
                    }
                    return $result;
                }
            }
            if ($node instanceof Folder || $node instanceof File) {
                $nodeShares = \OC::$server->getShareManager()->getSharesBy($node->getOwner()->getUID(), 0, $node);
                if (is_array($nodeShares)) {
                    $shareUsers = [];
                    /** @var \OC\Share20\Share $nodeShare */
                    foreach ($nodeShares as $nodeShare) {
                        $shareUsers[] = $nodeShare->getSharedWith();
                    }
                    if (count($shareUsers) > 0) {
                        //There is users. handle data.
                        $this->handleShareableUsers($shareUsers, $result);
                    }
                }
            }
            if (is_null($node) || empty($node)) {
                $this->handleShareableUsers([], $result); 
            }
            return $result;
        } catch (\Throwable $th) {
            //In case of exception, abort and return original data
            return $resultsArray;
        }
    }
    

    private function handleShareableUsers($users, &$result)
    {
        try {
            $failed = false;
            if (is_array($result) && array_key_exists('users', $result)) {
                $availableUsers = [];
                foreach ($users as $newUser) {
                    try {
                        $userLabel = \OC::$server->getUserManager()->get($newUser)->getDisplayName();
                        $availableUsers[] = ["label" => $userLabel, "value" => ["shareType" => 0, "shareWith" => $newUser]];
                    } catch (\Throwable $th) {
                        $failed = true;
                    }
                }
                if (!$failed) {
                    $result['users'] = $availableUsers;
                }
            }
        } catch (\Throwable $th) {
        }
    }


    public function getUsersIntoFolderPermissions(int $nodeId, string $owner)
    {
        $users = [];
        try {
            //$nodes = \OC::$server->getUserFolder()->getById($nodeId);
            $nodes = \OC::$server->getRootFolder()->getById($nodeId);
            if (is_array($nodes)) {
                foreach ($nodes as $folder) {
                    if ($folder instanceof Folder) {
                        $nodeShares = \OC::$server->getShareManager()->getSharesBy($owner, 0, $folder);
                        foreach ($nodeShares as $nodeShare) {
                            //avoid duplpicates
                            if (!in_array($nodeShare->getSharedWith(), $users)) {
                                $users[] = $nodeShare->getSharedWith();
                            }
                        }
                    }
                }
            }
            return $users;
        } catch (\Throwable $th) {
            \OC::$server->getLogger()->error($th->getMessage(), ['app' => 'vdesk_tim']);
            //always deny access if something's going wrong
            return $users;
        }
    }


    public function isUserIntoFolderPermissions(int $nodeId, IUser $user, string $owner)
    {
        try {
            $nodes = \OC::$server->getUserFolder()->getById($nodeId);
           // $nodes = \OC::$server->getRootFolder()->getById($nodeId);
            if (is_array($nodes)) {
                foreach ($nodes as $folder) {
                    if ($folder instanceof Folder) {
                        $nodeShares = \OC::$server->getShareManager()->getSharesBy($owner, 0, $folder);
                        foreach ($nodeShares as $nodeShare) {
                            if ($nodeShare->getSharedWith() == $user->getUID())
                                return true;
                        }
                    }
                }
            }
            return false;
        } catch (\Throwable $th) {
            \OC::$server->getLogger()->error($th->getMessage(), ['app' => 'vdesk_tim']);
            //always deny access if something's going wrong
            return false;
        }
    }

    public function getFirstShareNodePermissions($node)
    {
        $firstNode = $this->getFirstShareNode($node);
        if (is_object($firstNode)) {
            $nodeShares = \OC::$server->getShareManager()->getSharesBy($firstNode->getOwner()->getUID(), 0, $firstNode);
            foreach ($nodeShares as $nodeShare) {
                if ($nodeShare->getSharedWith() == \OC::$server->getUserSession()->getUser()->getUID()) {
                    //Retrieve the current user's share on first node and get permissions
                    $permissions = $nodeShare->getPermissions();
                    return $permissions;
                }
            }
            return $firstNode->getPermissions() ?? 31;
        }
        return 31;
    }

    private function getFirstShareNode($node)
    {
        $currentParentPath = $node->getParent()->getInternalPath();
        if ($currentParentPath == 'files' || $currentParentPath == '') {
            return $node;
        } else {
            return $this->getFirstShareNode($node->getParent());
        }
    }

    public function setShareSubOwner(IShare $share, string $soUid) 
    {
        try {
            $qb = \OC::$server->getDatabaseConnection()->getQueryBuilder();
            $qb->update('share')
            ->set('sub_owner',$qb->createNamedParameter($soUid))
            ->where($qb->expr()->eq('id', $qb->createNamedParameter($share->getId())));
            $executed = $qb->execute();
            return ($executed) ? true : false ;
        } catch (\Throwable $th) {
            \OC::$server->getLogger()->error('[CUSTOMPERMISSIONS] Cannot set sub owner on share ' . $share->getId() ?? 'n.d. : ' . $th->getMessage() );
            return false ;
        }
    }

    public function getShareSubOwner(IShare $share) {
        try {
            $qb = \OC::$server->getDatabaseConnection()->getQueryBuilder();
            $qb->select('sub_owner')
            ->from('share')            
            ->where($qb->expr()->eq('id', $qb->createNamedParameter($share->getId())));
            $result = $qb->execute();
			$data = $result->fetchAll();
            $user = $data[0]['sub_owner'] ;
            return $user;
        } catch (\Throwable $th) {
            return null ;
        }
    }
}
