<?php

namespace OCA\WorkflowManager\Service;

use JsonSerializable;

/**
 * modelTree's Node class
 */
class Node implements JsonSerializable
{
    public $Parents = null;
    public $Children = null;
    public $Invalidate = null;
    /** @var uuid  l'identificativo del nodo grafico */
    public $Uid;
    public $Label;
    public $Tipo;
    public $Stato = false;
    public $Identificativo;
    /** @var uuid  l'identificativo utennza esterna (da utilizzare solo per get,set) */
    public $Id; //to dismiss ??

    //TODO: Ask why this???
    // function comparator($a, $b)
    // {
    //     if (count($a->Children) >= count($a->Children)) {
    //         return -1;
    //     }
    //     return 0;
    // }

    public function jsonSerialize()
    {
        return [
            "Parents" => $this->Parents,
            "Children" => $this->Children,
            "Invalidate" => $this->Invalidate,
            "Uid" => $this->Uid,
            "Label" => $this->Label,
            "Tipo" => $this->Tipo,
            "Stato" => $this->Stato,
            "Identificativo" => $this->Identificativo,
            "Id" => $this->Id,
        ];
    }
};

/**
 * modelTree's Link class
 */
class Link implements JsonSerializable
{
    public $Uid;
    public $SourceId;
    public $TargetId;
    public $SourcePort;
    public $TargetPort;

    public function jsonSerialize()
    {
        return [
            "Uid" => $this->Uid,
            "SourceId" => $this->SourceId,
            "TargetId" => $this->TargetId,
            "SourcePort" => $this->SourcePort,
            "TargetPort" => $this->TargetPort,
        ];
    }
};

class WorkflowEngine
{
    /**
     * Engine Service variable
     * @var WorkflowService
     */
    private $service;

    /**
     * Engine Constructor
     * @param WorkflowService $service
     */
    public function __construct(WorkflowService $service)
    {
        $this->service = $service;
    }

    /**
     * Get the modelTree's from jsonModel
     * @param json $cells
     * @return void
     */
    public function GetModelTree($cells)
    {
        $nodes = $this->GetNodes($cells);

        $links = $this->GetLinks($cells);

        //imposto la catena gerarchica
        foreach ($nodes as $node) {
            //TODO: Get parents as we get children...
            $node->Children = $this->GetChildren($nodes, $links, $node);
            $ok = true;
        }

        //ricerco eventuali nodi di invalidazione
        foreach ($nodes as $node) {
            $node->Invalidate = json_decode($this->GetNodeInvalidate($nodes, $links, $node));
        }
        //imposto la catena gerarchica
        foreach ($nodes as $node) {
            //TODO: Get parents as we get children...          
            $node->Parents = $this->GetParents($nodes, $links, $node);
        }



        $nodesWithoutConditionals = [];
        foreach ($nodes as $node) {
            if ($node->Tipo == 'Block') {
                array_push($nodesWithoutConditionals, $node);
            }
        }
        return $nodesWithoutConditionals;
    }

    /**
     * Get modelTree's Nodes from jsonModel's Cells
     * @param stdObject $cells
     * @return array
     */
    public function GetNodes($cells)
    {
        $response = array();
        foreach ($cells as $cell) {
            $node = $this->BuildNodeFromCell($cell);
            if ($node != null)
                array_push($response, $node);
        }
        return $response;
    }

    /**
     * Get modelTree's Links from jsonModel's Cells
     * @param stdObject $cells
     * @return array
     */
    public function GetLinks($cells)
    {
        // $workflowJSON = json_decode($workflowJSON);
        $response = array();
        foreach ($cells as $cell) {
            if ($cell->type == "devs.Link" || $cell->type == "link") {
                $link = new Link();
                $link->Uid = $cell->id;
                $link->SourceId = $cell->source->id;
                $link->SourcePort = $cell->source->port;
                $link->TargetId = $cell->target->id;
                $link->TargetPort = $cell->target->port;
                array_push($response, $link);
            }
        }
        return $response;
    }

    // ########################## CHILDREN ##########################

    /**
     * Get a node's children
     * @param Node $nodes
     * @param Link $links
     * @param Node $node
     * @return array
     */
    public function GetChildren($nodes, $links, $node)
    {
        $children = array();
        $linksChildren = $this->GetLinksChildrenFromNode($node, $links);
        if ($linksChildren) {
            foreach ($linksChildren as $link) {
                $node = $this->GetNodeChildFromLink($link, $nodes);
                if ($node && strcmp($link->SourcePort, "PortModifica") != 0) {
                    if ($node->Tipo == "Block") {
                        $node->Children = $this->GetChildren($nodes, $links, $node);
                        array_push($children, $node);
                    } else if ($node->Tipo == "Conditional") {
                        $linksNode = $this->GetLinksChildrenFromNode($node, $links);
                        foreach ($linksNode as $linkNode) {
                            if (strcmp($linkNode->SourcePort, "PortModifica") != 0) {
                                $nodeLink = $this->GetNodeChildFromLink($linkNode, $nodes);
                                $nodeLink->Children = $this->GetChildren($nodes, $links, $nodeLink);
                                array_push($children, $nodeLink);
                            }
                        }
                    }
                }
            }
            return $children;
        }
        return null;
    }

    /**
     * Get the children's links from a Node
     * @param Node $node
     * @param Link $links
     * @return array
     */
    public function GetLinksChildrenFromNode($node, $links)
    {
        $linksChildren = array();
        foreach ($links as $link) {
            if ($link->SourceId == $node->Uid) {
                array_push($linksChildren, $link);
            }
        }
        return $linksChildren;
    }

    /**
     * Get the Child's link from a node
     * @param Node $node
     * @param Link $links
     * @return Link
     */
    public function GetLinkChildFromNode($node, $links)
    {
        foreach ($links as $link) {
            if ($link->SourceId == $node->Uid) {
                return $link;
            }
        }
        return null;
    }

    /**
     * Get the node child from a link
     * @param Link $link The selected Link
     * @param Node[] $nodes The modelTree's nodes
     * @return Node
     */
    public function GetNodeChildFromLink($link, $nodes)
    {
        foreach ($nodes as $node) {
            if ($link) {
                if ($node->Uid == $link->TargetId) {
                    return $node;
                }
            }
        }
        return null;
    }

    // ########################## PARENTS  ##########################

    /**
     * Get a node's parents
     * @param Node $nodes The modelTree's nodes
     * @param Link $links The modelTree's links
     * @param Node $node The node
     * @return array of Node
     */
    public function GetParents($nodes, $links, $node)
    {
        $isChildren = $this->IsChildrenOfNode($node, $nodes);
        $parents = array();
        if ($isChildren) {
            $linksParent = $this->GetLinksParentFromNode($node, $links);
            if ($linksParent) {
                foreach ($linksParent as $link) {
                    $parent = $this->GetParentFromLink($link, $nodes, $links);
                    if ($parent) {
                        foreach ($parent as $_parent) {
                            if ($isChildren) {
                                $_parent->Parents = $this->GetParents($nodes, $links, $_parent);
                                array_push($parents, $_parent);
                            }
                        }
                    }
                }
                return $parents;
            }
        }
        return $parents;
    }

    /**
     * Get the parent's links of a node
     * @param Node $node The node
     * @param Link $links The modelTree's links
     * @return Node
     */
    public function GetLinksParentFromNode($node, $links)
    {
        $linksParent = array();
        foreach ($links as $link) {
            if ($link->TargetId == $node->Uid) {
                array_push($linksParent, $link);
            }
        }
        return $linksParent;
    }

    /**
     * Get the parent's node from a link with conditional block
     * @param Link $link The link from a node will get
     * @param Node $nodes The modelTree's nodes*
     * @param Link $links The modelTree's links
     * @return Node
     */
    public function GetParentFromLinkWithConditional($link, $nodes, $links)
    {
        $parent = null;
        $node = $this->GetNodeParentFromLink($link, $nodes);
        if ($node) {
            if ($node->Tipo == "Block") {
                $parent = $node;
            } else if ($node->Tipo == "Conditional") {
                $link = $this->GetLinkParentFromNode($node, $links);

                $node = $this->GetNodeParentFromLink($link, $nodes);
                $parent = $node;
            }
        }
        return $parent;
    }
    /**
     * Get the parent's node from a link
     * @param Link $link The link from a node will get
     * @param Node $nodes The modelTree's nodes*
     * @param Link $links The modelTree's links
     * @return Node
     */
    public function GetParentFromLink($link, $nodes, $links)
    {
        $parent = array();
        if ($link->SourcePort != "PortModifica") {
            $node = $this->GetNodeParentFromLink($link, $nodes);
            if ($node) {
                if ($node->Tipo == "Block") {
                    array_push($parent, $node);
                } else if ($node->Tipo == "Conditional") {
                    //$link = $this->GetLinkParentFromNode($node, $links);
                    $links = $this->GetLinksParentFromNode($node, $links);
                    foreach ($links as $link) {
                        $node = $this->GetNodeParentFromLink($link, $nodes);
                        array_push($parent, $node);
                        //$parent = $node;
                    }
                }
            }
        }
        return $parent;
    }

    /**
     * Get the parent node's link from a node
     * @param Node $node The node
     * @param Link $links The modelTree's links
     * @return Node
     */
    public function GetLinkParentFromNode($node, $links)
    {
        foreach ($links as $link) {
            if ($link->TargetId == $node->Uid) {
                return $link;
            }
        }
        return null;
    }


    /**
     * Get the node's parents from a link
     * @param Link $link The link to getting node from
     * @param Node $nodes The modelTree's nodes
     * @return Node
     */
    public function GetNodeParentFromLink($link, $nodes)
    {
        foreach ($nodes as $node) {
            if ($node->Uid == $link->SourceId) {
                return $node;
            }
        }
        return null;
    }

    // ########################## INVALIDATE ##########################

    /**
     * Get ad Invalidate Node from modelTree
     * @param Node $nodes The modelTree's nodes
     * @param Link $links The modelTree's Links
     * @param Node $node The current node object (Only node, not links)
     * @return Return the JSON representation of the Invalidate Node
     */
    public function GetNodeInvalidate($nodes, $links, $node)
    {
        if ($node->Tipo == 'Block') {
            if ($this->HasConditional($node, $links, $nodes)) {
                $nodeConditional = $this->GetChildFromNode($node, $links, $nodes);
                $linkConditional = $this->GetLinkConditional($nodeConditional, $links);
                $nodeInvalidate = $this->GetNodeChildFromLink($linkConditional, $nodes);
                return json_encode($nodeInvalidate);
            }
        }
        return null;
    }
    /**
     * Get the link from a conditional (invalidate) node
     * @param Node $nodeConditional The invalidate node
     * @param Link $links The modelTree's Links
     * @return Link | boolean
     */
    public function GetLinkConditional($nodeConditional, $links)
    {

        foreach ($links as $link) {
            if ($link->SourceId == $nodeConditional->Uid) {
                if ($link->SourcePort == "PortModifica") {
                    return $link;
                }
            }
        }
        return null;
    }

    /**
     * Get the child from a node
     * @param Node $node The node to check
     * @param Links $links The modelTree's links
     * @param Node $nodes The modelTree's nodes
     * @return boolean
     */
    public function GetChildFromNode($node, $links, $nodes)
    {
        $nodeLink = $this->GetLinkChildFromNode($node, $links);
        $childNode = $this->GetNodeChildFromLink($nodeLink, $nodes);
        if ($childNode) {
            return $childNode;
        }
        return null;
    }

    /**
     * Check if a given node has conditional child(ren) into the modelTree
     * @param Node $node The node to check
     * @param Links $links The modelTree's links
     * @param Node $nodes The modelTree's nodes
     * @return boolean
     */
    public function HasConditional($node, $links, $nodes)
    {
        $nodeLink = $this->GetLinkChildFromNode($node, $links);
        $childNode = $this->GetNodeChildFromLink($nodeLink, $nodes);
        if ($childNode) {
            if ($childNode->Tipo == "Conditional") {
                return true;
            }
        }
        return false;
    }

    // /**
    //  * Get the First Node of modelTree
    //  * @param Node $nodes The nodes to Iterate
    //  */
    // public function GetFirstNode($nodes)
    // {
    //     foreach ($nodes as $node) {
    //         if (!is_null($node->Parents)) {
    //             if (count($node->Parents) == 0) {
    //                 return $node;
    //             }
    //         } else {
    //             return $node;
    //         }
    //     }
    //     return null;
    // }

    /**
     * Get the First Node of modelTree
     * @param array $nodes The nodes to Iterate
     */
    public function GetFirstNode($nodes, $cells)
    {
        $exist = array_search("start", array_column($nodes, "Identificativo"));
        if (is_numeric($exist))
            return $nodes[$exist];

        $exist = array_search("R", array_column($nodes, "Identificativo"));
        if (is_numeric($exist))
            return $nodes[$exist];

        $excludeType = ["Approvazione", "Rifiuto", "mail", "firmadigitale", "pec", "end"];
        $links = $this->GetLinks($cells);
        foreach ($nodes as $node) {
            $isFirstNode = true;
            if (!in_array($node->Identificativo, $excludeType)) {
                $parents = $node->Parents;
                if (!is_null($parents) && count($node->Parents) > 1) {
                    foreach ($parents as $parent) {
                        $linksNode = $this->GetLinksParentFromNode($parent, $links);
                        $isInvalid = $this->IsBranchInvalidate($parent, $nodes, $links, $linksNode);
                        $isFirstNode = $isFirstNode && $isInvalid;
                    }
                    if ($isFirstNode)
                        return $node;
                } else if (!is_null($parents) && count($node->Parents) == 1) {
                    $parent = $node->Parents[0];
                    $link = $this->GetLinkParentFromNode($parent, $links);
                    $isInvalid = $this->IsBranchInvalidate($parent, $nodes, $links, [$link]);
                    if (!$isInvalid) // && is_null($parent->Parents) || (!is_null($parent->Parents) && count($node->Parents) == 0))
                        return $node;
                } else if (is_null($parents) || (!is_null($parents) && count($node->Parents) == 0)) {
                    return $node;
                }
            }
        }
        return null;
    }
    // $nodeRoot = null;
    // foreach ($nodes as $node) {
    //     if (!is_null($node->Parents)) {
    //         if (count($node->Parents) == 0) {
    //             $isInvalid = $this->IsInvalidNode($node, $nodes);
    //             if (!$isInvalid) {
    //                 return $node;
    //             }
    //         }
    //     }
    // }
    // if ($nodeRoot == null) {
    //     $exist = array_search("start", array_column($nodes, "Identificativo"));
    //     if (is_numeric($exist)) {
    //         $nodeRoot = $nodes[$exist];
    //     }
    // }
    // return $nodeRoot;
    //}

    //  * Determines if it is an invalid branch
    //  * @param Node $node start for the search
    //  * @param array[Node] $nodes The modelTree's nodes
    //  * @param array[Link] $links parent of $node
    //  * @return boolean
    //  */
    public function IsBranchInvalidate($node, $nodes, $links, $linksParent, $currentNode = null)
    {
        if (!is_null($node) && !is_null($nodes) && !is_null($links)) {
            if (is_null($currentNode)) {
                $currentNode = $node;
            }
            foreach ($linksParent as $link) {
                if ($link->SourcePort != "PortModifica") {
                    $parent = $this->GetParentFromLinkWithConditional($link, $nodes, $links);
                    if (!is_null($parent)) {
                        if ($parent->Uid != $node->Uid) {
                            $link = $this->GetLinkParentFromNode($parent, $links);
                            if (!is_null($link) && $link->SourcePort == "PortModifica") {
                                $isBranchInvalidate = true;
                            } else {
                                $isBranchInvalidate = $this->IsBranchInvalidate($node, $nodes, $links, [$link], $parent);
                            }
                        } else {
                            $isBranchInvalidate = true;
                        }
                    } else {
                        $isBranchInvalidate = false;
                    }
                } else {
                    $isBranchInvalidate = true;
                }
            }
        }
        return $isBranchInvalidate;
    }

    /**
     * Get the Node from its Id
     * @param Node $node The node to Iterate
     * @param string $id The node's id to searching for
     */
    public function GetNodeId($node, $id)
    {
        if ($node->Id == $id) {
            return $node;
        } else {
            $children = $node->Children;
            if (!is_null($children) && count($children) >= 1) {
                foreach ($children as $child) {
                    $nodeChild = $this->GetNodeId($child, $id);
                    if (!is_null($nodeChild)) {
                        return $nodeChild;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Get the Node from its Id
     * @param array $nodes The node from $nodes
     * @param string $id The node's id to searching for
     */
    public function GetNode($nodes, $id)
    {
        $exist = array_search($id, array_column($nodes, "Id"));
        if (is_numeric($exist)) {
            return $nodes[$exist];
        }
        return null;
    }
    /**
     * Get Authorization checking the parent's state
     * @param json jsonModel Model of JointJS library (js)
     * @param string $id node's id
     */
    public function GetAuthorization($jsonModel, $id)
    {
        $authorized = false;
        $nodes = $this->GetModelTree($jsonModel->cells);
        $node = $this->GetNode($nodes, $id);
        $authorizedWorkflow = true;
        if ($node) {
            $authorizedWorkflow = $this->IsRunning($node, $jsonModel->cells);
            if (!$authorizedWorkflow) {
                $isCompleted = true;
                $isInvalid = $this->IsInvalidNode($node, $nodes);
                if ($isInvalid)
                    $isCompleted = $this->IsNodeCompleted($node, $jsonModel->cells);
                $authorizedWorkflow = $isInvalid && !$isCompleted;
            }
            $stato = $node->Stato;
            $authorized = $authorizedWorkflow && !$stato;
        }
        return $authorized;
    }

    public function GetCellCurrentNode($jsonModel)
    {
        $cells = $jsonModel->cells;
        $nodes = $this->GetModelTree($cells);
        $nodeRoot = $this->GetFirstNode($nodes, $cells);
        if (!is_null($nodeRoot) && !is_null($nodes) && !is_null($cells)) {
            $exist = $this->ExistCurrentNode($nodes);
            if (!$exist) {
                $cell = $this->GetCellFromId($nodeRoot->Id, $cells);
                return $cell;
            } else {
                foreach ($nodes as $node) {
                    $isRunning = $this->IsRunning($node, $cells);
                    if ($isRunning) {
                        $cell = $this->GetCellFromId($node->Id, $cells);
                        return $cell;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Set Authorization (true||false) to a given node
     * @param json $jsonModel Model of JointJS library (js)
     * @param string $id node's id
     * @param bool $stato node's new state (true||false)
     * @param object $model Data Transfer Object
     * @return bool
     */
    public function SetAuthorization($jsonModel, $id, $stato, $model)
    {
        $cells = $jsonModel->cells;
        $nodes = $this->GetModelTree($cells);
        $nodeRoot = null; // $this->GetFirstNode($nodes);
        $node = $this->GetNode($nodes, $id);
        $links = $this->GetLinks($cells);
        if (!is_null($node)) {
            $node->Stato = $stato;
            $nodeRoot = $this->GetFirstNode($nodes, $cells);            // if false (cell state is clear)
            if (!$stato) {
                if (!is_null($node->Invalidate)) {
                    $nodeInvalidate = $this->GetNodeInvalidateFromRoot($node, $node->Invalidate);
                    if (!is_null($nodeInvalidate)) {
                        $this->SetInvalidate($node, $nodeInvalidate, $cells, $nodeRoot);
                        $nodes = $this->GetModelTree($cells);
                        $this->SetCellEndDate($cells, $id, false, $node, $nodeInvalidate, $nodeRoot);
                    } else {

                        if ($node->Invalidate->Uid == $nodeRoot->Uid)
                            $canGoNextNode = true;
                        else
                            $canGoNextNode = $this->CanGoNextNode($node->Invalidate);

                        if ($canGoNextNode) {
                            $node->Stato = false;
                            //Set startDate on node's Children
                            $childrens = array($node->Invalidate);
                            $this->SetCellChildrenStartDate($childrens, $cells);
                            if ($node->Identificativo == "end" || $node->Identificativo == "Rifiuto")
                                $this->SetCellEndDate($cells, $node->Id, true);
                        }
                        //Set end date
                        $this->SetCellEndDate($cells, $id, true);
                        $nodes = $this->GetModelTree($cells);
                    }
                } else {
                    $arrayType = ["mail", "pec"];
                    if (in_array($node->Identificativo, $arrayType)) {
                        $node->Stato = true;
                        $nodeRoot = $this->GetFirstNode($nodes, $cells);
                        //Set startDate on node's Children
                        $this->SetCellChildrenStartDate($node->Children, $cells);
                        //Set end date
                        $this->SetCellEndDate($cells, $id, true);
                    } else {
                        //set end-date=null if stato==false
                        $this->SetCellEndDate($cells, $id, false);
                    }
                }
                if (!is_null($node->Parents) && count($node->Parents) > 0) {
                    foreach ($node->Parents as $parent) {
                        $parent->Stato = false;
                        $parentNode = $this->GetNode($nodes, $parent->Id);
                        $parentNode->Stato = false;
                    }
                }
                $_nodeInvalidate=$this->GetNode($nodes, $nodeInvalidate->Id);
                if(!is_null($_nodeInvalidate) && count($_nodeInvalidate->Parents)>0)
                {
                    foreach ($_nodeInvalidate->Parents as $_nodeInvalidateParent) {
                        $_nodeInvalidateParent->Stato = true; 
                        $this->BindJSONNode($cells, $_nodeInvalidateParent);                  
                    }
                }

            }
            //*********************************** handle start/end date
            //if true (cell state is current)
            if ($stato) {
                if ($node->Uid == $nodeRoot->Uid)
                    $canGoNextNode = true;
                else
                    $canGoNextNode = $this->CanGoNextNode($node);
                if (!is_null($node->Parents) && count($node->Parents) > 0) {
                    foreach ($node->Parents as $parent) {
                        //parallel branch                           
                        $canClearParent = $this->CanClearParent($node, $cells);
                        if ($canClearParent) {
                            $parent->Stato = false;
                            $parentNode = $this->GetNode($nodes, $parent->Id);
                            $parentNode->Stato = false;
                        }
                    }
                }
                if ($canGoNextNode) {
                    //Set startDate on node's Children
                    $this->SetCellChildrenStartDate($node->Children, $cells);                    
                    if ($node->Identificativo == "end" || $node->Identificativo=="Approvazione")
                        $this->SetCellEndDate($cells, $node->Id, true);
                }
                $childDigitalSignage = $this->GetChildDigitalSignature($cells, $links, $node);
                if (!is_null($childDigitalSignage))
                    $this->SetCellDigitalSignAttributes($id, $cells, ["FileName" => $model["FileName"], "Folder" => $model["Path"]]);
                //Set end date
                $this->SetCellEndDate($cells, $id, true);
            }

            //***************************************************

            $this->BindJSONModel($cells, $nodes);
            $this->UpdateJSONModel($jsonModel, $model);

            return true;
        }

        return false;
    }

    /**
     * Start the workflow setting startDate on first Node/Cell and performing setAuthorization(true) on it
     * @param json $jsonModel Model of JointJS library (js)
     * @param object $model Data Transfer Object
     * @return bool
     */
    public function StartWorkflow($jsonModel, $model)
    {
        $cells = $jsonModel->cells;
        $nodes = $this->GetModelTree($cells);
        $nodeRoot = $this->GetFirstNode($nodes, $cells);

        if (!is_null($nodeRoot)) {
            $started = $this->SetCellStartDate($nodeRoot, $cells);
            if ($started) {
                //Update model
                $this->BindJSONModel($cells, $nodeRoot); //TODO invert params order...
                $this->UpdateJSONModel($jsonModel, $model);

                //...then Call SetAuthorization() with nodeRoot Id
                if (!$model["Filter"]["Bozza"]) {
                    $id = $nodeRoot->Id;
                    $this->SetAuthorization($jsonModel, $id, true, $model);
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Ends the workflow setting endDate on selected (by $model->Id ) end block
     * @param json $jsonModel Model of JointJS library (js)
     * @param object $model Data Transfer Object
     * @return bool
     */
    public function EndWorkflow($jsonModel, $model)
    {
        $cells = $jsonModel->cells;
        $nodes = $this->GetModelTree($cells);
        $nodeRoot = $this->GetFirstNode($nodes, $cells);
        $id = $model["Filter"]["Id"];
        $nodeEnd = $this->GetNodeId($nodeRoot, $id);

        $authorized = $this->GetAuthorization($jsonModel, $id);
        //Check if it's authorized to ends up the wotkflow
        if ($authorized) {
            // $now = (new \DateTime())->format('Y-m-d H:i:s');
            $exitState = $model["Filter"]["Stato"];
            $nodeEndChildren = $nodeEnd->Children;
            if (!is_null($nodeEndChildren)) {
                foreach ($nodeEndChildren as $endChild) {
                    //Check for Accept/Deny choice
                    //FIXME : Temporary workaround...
                    $identificativo = $endChild->Identificativo;
                    $childId = $endChild->Id;
                    //Exitstate = true = approvazione
                    //TODO : cast to bool
                    if ($exitState && (strcmp($identificativo, 'Approvazione') === 0 || strcmp($identificativo, 'end') === 0)) {
                        // if (strcmp($exitState,"true") === 0 && strcmp($identificativo,'Approvazione') === 0) {
                        //Set nodeEnd endDate
                        $this->SetCellEndDate($cells, $nodeEnd->Id, true);
                        //Set start&Stop for cell and so for wf itself
                        $this->SetCellStartDate($endChild, $cells);
                        // $endCell = $this->GetCellFromId($childId,$cells);
                        // $endCell->attrs->root->endDate = $now ;
                        $this->SetAuthorization($jsonModel, $childId, true, $model);
                        return true;
                    }
                    //Exitstate = false = rifiuto
                    //TODO : cast to bool
                    else if (!$exitState && (strcmp($identificativo, 'Rifiuto') === 0 || strcmp($identificativo, 'end') === 0)) {
                        // else if (strcmp($exitState,"false") === 0 &&  strcmp($identificativo,'Rifiuto') === 0) {
                        //Set nodeEnd endDate
                        $this->SetCellEndDate($cells, $nodeEnd->Id, true);
                        //Set start&Stop for cell and so for wf itself
                        $this->SetCellStartDate($endChild, $cells);
                        //$this->SetCellStartDate($endChild, $cells);
                        // $endCell = $this->GetCellFromId($childId,$cells);
                        // $endCell->attrs->root->endDate = $now ;
                        $this->SetAuthorization($jsonModel, $childId, true, $model);
                        return true;
                    } 
                    // else {

                    //     $this->SetAuthorization($jsonModel, $nodeEnd->Id, $exitState, $model);
                    //     return true;
                    // }
                    //...ENDFIXME
                }
            }
            return false;
        }
    }

    /**
     * Stampa la struttura ad albero
     * @param $nodes
     */
    private function printNodes($nodes)
    {

        foreach ($nodes as $node) {
            if ($node->Children) {
                //      error_log("" . $node->Label . " - " . count($node->Children));
                foreach ($node->Children as $child) {
                    error_log("          " . $child->Label);
                }
            }
        }
    }

    /**
     *  Stampa la struttura ad albero
     * @param $pad
     * @param $node
     */
    public function printnodetree($pad, $node)
    {
        $padding = "";

        for ($i = 0; $i < $pad; $i++) {
            $padding = $padding . "  ";
        }

        //    error_log(" printnode " . $padding . $node->Label);
        if (count($node->Children) == 0) {
            return;
        } else {
            $children = $node->Children;
            if ($children && count($children) >= 1) {
                for ($i = 0; $i < count($children); $i++) {
                    $child = $children[$i];
                    $this->printnodes(0, $child);
                }
            }
        }
    }

    /**
     * Given a cell-Id and a Cells Array, returns the matched cell by root->id
     * @param mixed $cells jsonModel's cells
     * @param string $cellId target cell id on jsomModel
     * @return Cell
     */
    public function GetCellFromId($cellId, $cells)
    {
        try {
            $result = null;
            if (!is_null($cellId) && !is_null($cells)) {

                foreach ($cells as $cell) {
                    if (!is_null($cell)) {
                        $cellRoot = $cell->attrs->root;
                        if (property_exists($cellRoot, 'id')) {
                            if ($cellRoot->id == $cellId) {
                                $result = $cell;
                                return $result;
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            return $e;
        } finally {
            return $result;
        }
    }

    /**
     * Set endDate to $state on nodeInvalidate's Children
     * @param Node $node Node of ModelTree
     * @param Node $invalidateNode Invalidate Node of ModelTree
     * @param bool $stato value to change (true||false)
     * @param string $cellId ID of cell into jsomModel
     * @param mixed $cells jsonModel's cells
     * @param datetime $now now datetime format.
     */
    public function SetCellInvalidateEndDate($node, $nodeInvalidate, $stato, $cellId, $cells, $now)
    {
        if (!is_null($node) && !is_null($nodeInvalidate)) {
            if (!is_null($cells)) {
                //Get target cell from cells
                $cell = $this->GetCellFromId($cellId, $cells);
                if (!is_null($cell)) {
                    //Get cellRootParams
                    $firstNode = $nodeInvalidate;
                    $cellRoot = $cell->attrs->root;
                    if (!is_null($cellRoot)) {
                        if (!is_null($cellRoot)) {
                            if ($stato) {
                                //Set endDate to now() if $stato is true
                                $cellRoot->endDate = $now;
                            } else {
                                //Set end&startDate to null if $stato is false
                                $cellRoot->endDate = null;
                                // if ($cellRoot.id !== $firstNode.Id) {
                                if (strcmp($cellRoot->id, $firstNode->Id) != 0) {
                                    $cellRoot->startDate = null;
                                }
                            }
                        }

                        //iterate child of invalid node
                        foreach ($node->Children as $child) {
                            $invalidateId = $child->Id;
                            $this->SetCellInvalidateEndDate($child, $nodeInvalidate, $stato, $invalidateId, $cells, $now);
                        }
                    }
                }
            }
        }
    }


    /**
     * Set endDate with current dateTime on selected Cell
     * @param mixed $cells jsonModel's cells
     * @param string $cellId target cell id on jsomModel
     */
    public function SetCellEndDate($cells, $cellId, $stato, $node = null, $nodeInvalidate = null, $nodeRoot = null)
    {
        try {

            $now = (new \DateTime())->format('Y-m-d H:i:s');
            if (!is_null($cells)) {
                $cell = $this->GetCellFromId($cellId, $cells);
                if (!is_null($cell)) {
                    $cellRoot = $cell->attrs->root;
                    if (!is_null($cellRoot)) {
                        if ($stato) {
                            //Set endDate to now() if $stato is true
                            $cellRoot->endDate = $now;
                        } else {
                            //Set endDate to null if $stato is false
                            $cellRoot->endDate = null;
                        }
                    }
                }
                //if exists, Perform endDate=null for invalidateNode
                if (!is_null($nodeInvalidate)) {
                    $cell = $this->GetCellFromId($nodeInvalidate->Id, $cells);
                    if (!is_null($nodeRoot)) {
                        if ($nodeRoot->Id != $nodeInvalidate->Id) {
                            $cell->attrs->root->startDate = $now;
                        }
                    }
                    $cell->attrs->root->endDate = null;
                    //$this->SetCellInvalidateEndDate($node, $nodeInvalidate, $stato, $cellId, $cells, $now);
                    $this->SetCellInvalidateEndDate($nodeInvalidate, $nodeInvalidate, $stato, $nodeInvalidate->Id, $cells, $now);
                }
            }
        } catch (\Exception $e) {
            return $e;
        }
    }

    /**
     * Set StartDate on cell based on param $node
     * @param mixed $node node with node Id
     * @param mixed $cells jsonModel's cells
     * @return bool
     */
    public function SetCellStartDate($node, $cells)
    {
        try {
            if ($node) {
                $now = (new \DateTime())->format('Y-m-d H:i:s');
                $cell = $this->GetCellFromId($node->Id, $cells);
                if (!is_null($cell)) {
                    $cellRoot = $cell->attrs->root;
                    if (!is_null($cellRoot)) {
                        $cellRoot->startDate = $now;
                        return true;
                    }
                }
            }
            return false;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Set StartDate on cell'children iterating $nodeChildren
     * @param mixed $nodeChildren node's children to iterate
     * @param mixed $cells jsonModel's cells
     */
    public function SetCellChildrenStartDate($nodeChildren, $cells)
    {
        try {
            if (!is_null($nodeChildren) && !is_null($cells)) {
                if (count($nodeChildren) > 0) {
                    foreach ($nodeChildren as $child) {
                        if (!is_null($child)) {
                            $this->SetCellStartDate($child, $cells);
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            return $e;
        }
    }

    /**
     * Get the invalidate node from modelTree's root if node->Uid = nodeInvalidate->Uid
     * @param Node $node
     * @param Node $nodeInvalidate
     */
    public function GetNodeInvalidateFromRoot($node, $nodeInvalidate)
    {
        if ($node->Uid == $nodeInvalidate->Uid) {
            if (!is_null($node->Parents) && count($node->Parents) > 0) {
                return $node->Invalidate;
            } else {
                return null;
            }
        } else {
            $children = $nodeInvalidate->Children;
            if (!is_null($children) && count($children) >= 1) {
                foreach ($children as $child) {
                    $nodeInvalidate = $this->GetNodeInvalidateFromRoot($node, $child);
                    if (!is_null($nodeInvalidate)) {
                        return $nodeInvalidate;
                    }
                }
            }
        }
    }

    /**
     * Update the jointJS's jsonModel through service->CreateOrUpdateEngine() method.
     * @param jsonModel $jsonModel
     * @param array $model
     * @return void
     */
    public function UpdateJSONModel($jsonModel, $model)
    {
        $filter = $model["Filter"];
        $workflowDataModel = [];
        $workflowDataModel["Dto"]["WorkflowModel"] = json_encode($jsonModel);
        $this->service->CreateOrUpdateEngine($filter, $workflowDataModel);
        return true;
    }

    /**
     * Bind the jsonModel's cells
     * @param Node $cells
     * @param Node $node
     * @return void
     */
    public function BindJSONModel($cells, $nodes)
    {
        foreach ($nodes as $node) {
            $this->BindJSONNode($cells, $node);
        }
        return true;
    }


    /**
     * Bind the jsonModel's node to the treeModel node
     * @param mixed $cells of jsonModel
     * @param Node $node of treeModel
     * @return void
     */
    public function BindJSONNode($cells, $node)
    {
        foreach ($cells as $cell) {
            $attributes = $cell->attrs;
            if (!is_null($attributes)) {
                if (property_exists($attributes, "root")) {
                    $root = $attributes->root;
                    if (!is_null($root)) {
                        if (property_exists($root, "id")) {
                            if ($root->id == $node->Id) {
                                if ($node->Stato) {
                                    $root->stato = 'current';
                                } else {
                                    $root->stato = 'clear';
                                }
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * Invalidate the passed node
     * @param Node $node node of treeModel
     * @param Node $nodeInvalidate
     * @return void
     */
    public function SetInvalidate($node, $nodeInvalidate, $cells, $firstNode)
    {
        $now = (new \DateTime())->format('Y-m-d H:i:s');
        $nodeInvalidate->Stato = false;
        $cell = $this->GetCellFromId($nodeInvalidate->Id, $cells);
        if ($cell != null) {
            $cell->attrs->root->stato = $this->GetStatoString($nodeInvalidate->Stato);
            $cell->attrs->root->endDate = ($nodeInvalidate->Stato ? $cell->attrs->root->endDate = $now : $cell->attrs->root->endDate = null);
            if (strcmp($node->Uid, $nodeInvalidate->Uid) != 0 && $nodeInvalidate->Uid != $firstNode->Uid) {
                $cell->attrs->root->startDate = null;
            }
        }
        if ($nodeInvalidate->Uid != $node->Uid) {

            if (!is_null($nodeInvalidate) && count($nodeInvalidate->Children) >= 1) { //node != null
                foreach ($nodeInvalidate->Children as $child) {
                    $child->Stato = false;
                    $this->SetInvalidate($node, $child, $cells, $firstNode);
                }
            }
        }
    }

    /**
     * Get the string state
     * @param Bool $stato of node
     * @return string
     */
    public function GetStatoString($stato)
    {
        if ($stato) {
            return "current";
        }
        return "clear";
    }

    /**
     * Get the string state
     * @param Bool $stato of node
     * @return string
     */
    public function GetStatoBool($stato)
    {
        if ($stato == "current") {
            return true;
        }
        return false;
    }

    /**
     * Get Parent of the current node
     * @param Node $node
     * @return Node
     */
    public function GetParentCurrentNode($node)
    {
        if (!is_null($node->Parents) && count($node->Parents) > 0) {
            foreach ($node->Parents as $parent) {
                if ($parent->Stato)
                    return $parent;
            }
        }
        return $node;
    }

    /**
     * Check exist Current node
     * @param array $nodes
     * @return bool
     */
    public function ExistCurrentNode($nodes)
    {
        $exist = array_search(true, array_column($nodes, "Stato"));
        if (is_numeric($exist))
            return true;
        return false;
    }
    /**
     * Check if $node is a children of another node
     * @param Node $node
     * @param arrayNodes $nodes
     * @return boolean
     */
    public function IsChildrenOfNode($currentNode, $nodes)
    {
        foreach ($nodes as $node) {
            if ($node->Tipo == "Block" && !is_null($node->Children)) {
                $childrens = $node->Children;
                foreach ($childrens as $child) {
                    if ($child->Uid == $currentNode->Uid) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Check if $node is a invalid node of another node
     * @param Node $node
     * @param arrayNodes $nodes
     * @return boolean
     */
    public function IsInvalidNode($currentNode, $nodes)
    {
        foreach ($nodes as $node) {
            if ($node->Tipo == "Block" && !is_null($node->Invalidate)) {
                $invalidateNode = $node->Invalidate;
                if ($invalidateNode->Uid == $currentNode->Uid) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Get children's Node from jsonModel's Cells if stato=true
     * @param stdObject $cells
     * @param stdObject $links
     * @param Node $node
     * @return array
     */
    public function GetChildrenFromCells($cells, $links, $node)
    {
        $result = [];
        $linksChildren = $this->GetLinksChildrenFromNode($node, $links);
        if (!is_null($linksChildren)) {
            foreach ($linksChildren as $link) {
                if ($link->SourcePort != "PortModifica") {
                    if ($link->SourceId == $node->Uid) {
                        foreach ($cells as $cell) {
                            if ($cell->id == $link->TargetId) {
                                $nodeTarget = $this->BuildNodeFromCell($cell);
                                if ($nodeTarget->Tipo == "Conditional")
                                    $result = $this->GetChildrenFromCells($cells, $links, $nodeTarget);
                                else
                                    array_push($result, $nodeTarget);
                            }
                        }
                    }
                }
            }
        }
        return $result;
    }

    /**
     * Biuld children from cell 
     * @param stdObject $cell
     * @return Node
     */
    private function BuildNodeFromCell($cell)
    {
        if ($cell->type != "devs.Link") {
            $node = new Node();
            $node->Id = $cell->attrs->root->id;
            $node->Identificativo = $cell->attrs->root->identificativo;
            $node->Stato = $this->GetStatoBool($cell->attrs->root->stato);
            $node->Uid = $cell->id;
            $node->Label = $cell->attrs->label->text;
            $node->Tipo = ($cell->type == "standard.Polygon" ? "Conditional" : "Block");
            return $node;
        }
        return null;
    }

    /**
     * Check if workflow can to go at the next node
     * @param Node $node
     * @return boolean
     */
    private function CanGoNextNode($node)
    {
        $childrens = $node->Children;
        if (!is_null($childrens)) {
            foreach ($childrens as $child) {
                if (!is_null($child->Parents) && count($child->Parents) > 1 && $child->Identificativo != "end") {
                    foreach ($child->Parents as $parent) {
                        if ($parent->Uid != $node->Uid && $parent->Identificativo != "mail" && $parent->Identificativo != "start" && !$parent->Stato) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    /**
     * Check if the children of the current parent's node are completed
     * @param Node $node is a current node
     * @param array $cells 
     * @return boolean
     */
    private function CanClearParent($node, $cells)
    {
        $parents = $node->Parents;
        if (!is_null($parents) && count($parents) >= 1) {
            foreach ($parents as $parent) {
                if (!is_null($parent->Children) && count($parent->Children) > 1) {
                    foreach ($parent->Children as $children)
                        if ($children->Uid != $node->Uid) {
                            $cell = $this->GetCellFromId($children->Id, $cells);
                            if (is_null($cell->attrs->root->endDate))
                                return false;
                        }
                }
            }
        }
        return true;
    }

    private function IsNodeCompleted($node, $cells)
    {
        $cell = $this->GetCellFromId($node->Id, $cells);
        if ($cell != null) {
            return !is_null($cell->attrs->root->endDate);
        }
        return false;
    }

    private function IsRunning($node, $cells)
    {
        $cell = $this->GetCellFromId($node->Id, $cells);
        if ($cell != null) {
            return !is_null($cell->attrs->root->startDate) && $cell->attrs->root->startDate != "" && (is_null($cell->attrs->root->endDate) ||
                (isset($cell->attrs->root->endDate) && $cell->attrs->root->endDate == ""));
        }
        return false;
    }

    /**
     * Set attribete cell
     *
     * @param array $params: associative array
     * @param int $id: cell id
     * @param array $cells
     * @return void
     */
    private function SetCellDigitalSignAttributes($id, $cells, $params)
    {
        if (!is_null($id) && !is_null($cells) && !is_null($params)) {
            $filename = $params["FileName"];
            $folder = $params["Folder"];
            if (!is_null($filename) && !is_null($folder)) {
                $cell = $this->GetCellFromId($id, $cells);
                $cell->attrs->root->filename = str_replace("/", "", $filename);
                $cell->attrs->root->tempfolder = $folder;
            }
        }
    }

    private function GetChildDigitalSignature($cells, $links, $node)
    {
        $childs = $this->GetChildrenFromCells($cells, $links, $node);
        if (!is_null($childs)) {
            foreach ($childs as $child) {
                if (!is_null($child) && ($child->Identificativo == "firmadigitale"))
                    return $child;
            }
        }
        return null;
    }

    public function CanMoveNext($jsonModel, $id)
    {
        $move = false;
        $nodes = $this->GetModelTree($jsonModel->cells);
        $node = $this->GetNode($nodes, $id);
        if ($node) {
            $move = $this->CanGoNextNode($node);
        }
        return $move;
    }
}
