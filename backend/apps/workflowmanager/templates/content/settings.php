<?php
script('workflowmanager', 'workflow_tools');
script('workflowmanager', 'wfm-settings');
style('workflowmanager', 'settings');
?>
<div class="wfm-view">
    <h2>Configurazione parametri</h2>
    <table class="wfm-table-settings">
        <tbody>
            <tr>
                <td align="left" valign="middle" colspan="2">
                    <h4><strong>Account amministratore</strong></h4>
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle" style="width: 14%;"><span>Username:</span></td>
                <td align="left" valign="middle" style="width: 86%;"><input id="username" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Password:</span></td>
                <td align="left" valign="middle"><input id="password" type="password" autocomplete="off" autocapitalize="none" autocorrect="off" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle" style="width: 14%;"><span>Server port:</span></td>
                <td align="left" valign="middle" style="width: 86%;"><input id="server_port" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle" colspan="2">
                    <hr />
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle" colspan="2">
                    <h4><strong>Gruppo Designer WFA</strong></h4>
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle" style="width: 14%;"><span>Gruppo:</span></td>
                <td align="left" valign="middle" style="width: 86%;">
                    <div class="autocomplete" style="width:40%;">
                        <input id="designer_group" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" style="width:100%;" />
                        <span id="autocompleteLoading" class="icon-loading-small-dark" style="display:none;top:0;left: -17px;"></span>
                    </div>

                </td>
            </tr>
            <tr>
                <td align="left" valign="middle" colspan="2">
                    <h4><strong>Gruppo Super Admin</strong></h4>
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle" style="width: 14%;"><span>Gruppo:</span></td>
                <td align="left" valign="middle" style="width: 86%;">
                    <div class="autocomplete" style="width:40%;">
                        <input id="super_admin_group" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" style="width:100%;" />
                        <span id="autocompleteLoading" class="icon-loading-small-dark" style="display:none;top:0;left: -17px;"></span>
                    </div>

                </td>
            </tr>
            <tr>
                <td align="left" valign="middle" colspan="2">
                    <hr />
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle" colspan="2">
                    <h4><strong>Visualizza azioni delibera</strong></h4>
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Abilita:</span></td>
                <td align="left" valign="middle"><input id="enable_page_action" type="checkbox" class="wfm-cursor-pointer" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle" colspan="2">
                    <hr />
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle" colspan="2">
                    <h4><strong>Configurazione SAP</strong></h4>
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Abilita:</span></td>
                <td align="left" valign="middle"><input id="enable_sap" type="checkbox" class="wfm-cursor-pointer" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Url servizio:</span></td>
                <td align="left" valign="middle"><input id="sap_service_url" type="text" style="width: 100%;" autocapitalize="none" autocorrect="off" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Tipo di autenticazione:</span></td>
                <td align="left" valign="middle">
                    <select id="sap_authentication">
                        <option value="NONE">Nessuna</option>
                        <option value="BASIC">Basic</option>
                        <option value="BEARER">Bearer</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Username:</span></td>
                <td align="left" valign="middle"><input id="sap_username" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Password:</span></td>
                <td align="left" valign="middle"><input id="sap_password" type="password" autocomplete="off" autocapitalize="none" autocorrect="off" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle" colspan="2">
                    <hr />
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle" colspan="2">
                    <h4><strong>Progressivo da sistemi esterni</strong></h4>
                </td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Url servizio:</span></td>
                <td align="left" valign="middle"><input id="progressive_service_url" type="text" style="width: 100%;" autocapitalize="none" autocorrect="off" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Username:</span></td>
                <td align="left" valign="middle"><input id="progressive_service_username" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Password:</span></td>
                <td align="left" valign="middle"><input id="progressive_service_password" type="password" autocomplete="off" autocapitalize="none" autocorrect="off" /></td>
            </tr>
            <tr>
                <td align="left" valign="middle"><span>Tipo di autenticazione:</span></td>
                <td align="left" valign="middle">
                    <select id="progressive_service_authentication">
                        <option value="NONE">Nessuna</option>
                        <option value="BASIC">Basic</option>
                        <option value="BEARER">Bearer</option>
                    </select>
                </td>
            </tr>
        </tbody>
        <footer>
            <tr>
                <td align="left" valign="middle">
                    <br><br>
                    <input type="button" id="wfm-btnSaveSettings" class="wfm-button " value="Salva" />
                </td>
            </tr>
        </footer>
    </table>
</div>