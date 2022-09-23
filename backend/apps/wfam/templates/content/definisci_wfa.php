<div class="bnlhr-view">
    <span class="section-title" style="padding-left:10px">STEP 01 – CREA NUOVO WFA</span>

    <div class="bnlhr-standard" style="width: 100%;">
        <table class="bnlhr-simple-table">
            <tbody>
                <tr>
                    <td width="100px">
                        <input type="hidden" id="WfaId" />
                        <span class="bnlhr-font-weight-bold">Nome WFA</span>
                    </td>
                    <td width="200px"><input id="Nome" type="text"></td>
                    <td width="100px">
                        <span class="bnlhr-font-weight-bold">Progressivo</span>
                    </td>
                    <td width="200px"><input id="CodificaAlfanumerica" maxlength="50" type="text" placeholder="Codifica alfanumerica(es.PID#)"></td>
                    <td width="200px">
                        <span class="bnlhr-font-weight-bold">
                            Cifre numeriche &nbsp;&nbsp;<input id="CifreNumericheProgressivo" type="number" value="5" style="width:50px ">
                        </span>
                    </td>
                </tr>
                <tr>
                    <td width="100px"><span class="bnlhr-font-weight-bold">Categoria WFA</span></td>
                    <td width="200px">
                        <select id="CategoriaId">
                        </select>
                    </td>
                    <td width="100px"><span class="bnlhr-font-weight-bold">Nuova Categoria</span></td>
                    <td width="200px"><input id="NuovaCategoria" type="text"></td>
                    <td width="100px">
                        <input type="button" id="bnlhr-btnAggiungiCategoria" class="bnlhr-button-white button-form" style="width: 200px" value="AGGIUNGI CATEGORIA" />
                    </td>
                </tr>
                <tr data-name="formUpload">
                    <td width="100px"><span class="bnlhr-font-weight-bold">Seleziona icona</span></td>
                    <td width="200px" colspan="2">
                        <div class="actions creatable">
                            <input class="bnlhr-select" type="text" id="txtIcona" style="width: 246px" disabled />
                            <input type="file" id="file_upload_start" class="hiddenuploadfield" name="files[]">
                            <input type="button" id="bnlhr-btnCaricaAllegati" class="svg icon icon-upload" value="" title="seleziona icona" style="position:absolute;width: 35px;" />
                            <input type="button" id="bnlhr-btnDeleteIcon" class="svg icon svg icon icon-delete" value="" title="Elimina icona" style="position:absolute;width: 35px;margin-left:40px" />
                            <div id="uploadprogresswrapper">
                                <div id="uploadprogressbar">
                                    <em class="label outer" style="display:none"><span class="desktop">Caricamento in corso...</span><span class="mobile">…</span></em>
                                </div>
                                <button class="stop icon-close" style="display:none">
                                    <span class="hidden-visually">Annulla caricamento</span>
                                </button>
                            </div>
                            <div id='bnlhr-pupupMenu' class="newFileMenuIcon popovermenu bubble menu open menu-left" style="display: none; left: auto;">
                                <ul>
                                    <li>
                                        <label id='bnlhr-lnkDrive' for="file_upload_start-drive" class="menuitem" data-action="upload" title="" tabindex="0"><span class="svg icon icon-upload"></span><span class="displayname">Carica file dal cloud</span></label>
                                    </li>
                                    <li>
                                        <label id='bnlhr-lnkLocal' for="file_upload_start" class="menuitem" data-action="upload" title="" tabindex="0"><span class="svg icon icon-upload"></span><span class="displayname">Carica file locale</span></label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </td>
                    
                </tr>
                <tr>
                    <td width="100px" colspan="2">
                        <span class="bnlhr-font-weight-bold" style="padding-right:10px">Solo richieste personali</span>
                        <label class="container">
                            <input type="checkbox" id="chbRichiestePersonali">
                            <span class="checkmark"></span>
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="bnlhr-standard" style="width: 80%">
        <table class="bnlhr-simple-table" id="tableAssegnaRuoliWfa">
            <tbody>
                <tr>
                    <td colspan="5"><span class="section-title">STEP 02 – ASSEGNA RUOLI</span></td>
                </tr>
                <tr id="RowUtenteR">
                    <td width="100px">
                        <span id="lblUtenteR" class="bnlhr-font-weight-bold ">Ruolo R</span>
                        <span class="icon-info" id="icon-info-R"></span>
                    </td>
                    <td>
                        <div class="autocomplete" style="width: 100%;">
                            <input id="utentiR" data-id="-1" type="text" name="utentiR" data-ruolo="R" placeholder="Cerca gruppo utenti" autocomplete="off" style="width:100%;border-radius: 5px 0 0 5px;">
                            <span id="autocompleteLoading" class="icon-loading-small-dark" style="display:none;top:0;left: -22px;padding:0"></span>
                        </div>
                    </td>
                    <td>
                        <input type="button" id="btnSelezionaUtenteR" class="bnlhr-button-white button-form" style="width: 100px" value="AGGIUNGI" />
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr id="RowUtenteC1">
                    <td width="100px"><span class="bnlhr-font-weight-bold" id="lblUtenteC">Ruolo C1</span>
                    <span class="icon-info" id="icon-info-C1"></span>
                    </td>
                    <td>
                        <div class="autocomplete" style="width:100%;">
                            <input id="utentiC1" data-id="-1" type="text" name="utentiC1" data-ruolo="C1" placeholder="Cerca gruppo utenti" autocomplete="off" style="width:100%;border-radius: 5px 0 0 5px;">
                            <span id="autocompleteLoading" class="icon-loading-small-dark" style="display:none;top:0;left: -22px;padding:0"></span>
                        </div>
                    </td>
                    <td>
                        <input type="button" id="btnSelezionaUtenteC" class="bnlhr-button-white button-form" style="width: 100px" data-index-ruolo="C1" value="AGGIUNGI" />
                        <input type="button" id="btnAddUtenteC2" class="bnlhr-button-white" data-index="C2" value="+" title="Aggiungi utente C2" style="width:50px" />
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr id="RowUtenteA">
                    <td width="100px"><span class="bnlhr-font-weight-bold" id="lblUtenteA">Ruolo A</span>
                    <span class="icon-info" id="icon-info-A"></span>
                </td>
                    <td>

                        <div class="autocomplete" style="width:100%;">
                            <input id="utentiA" data-id="-1" type="text" name="utentiA" data-ruolo="A" placeholder="Cerca gruppo utenti" autocomplete="off" style="width:100%;border-radius: 5px 0 0 5px;">
                            <span id="autocompleteLoading" class="icon-loading-small-dark" style="display:none;top:0;left: -22px;padding:0"></span>
                        </div>
                    </td>
                    <td>
                        <input type="button" id="btnSelezionaUtenteA" class="bnlhr-button-white button-form" style="width: 100px" value="AGGIUNGI" />
                    </td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="bnlhr-standard" style="width: 100%">
        <table class="bnlhr-table" id="bnlhr-ruoliWfa">
            <tbody>
            </tbody>
        </table>
    </div>

    <div style="width: 100%" id="bnlhr-panelNotifiche">
        <table class="bnlhr-simple-table" id="bnlhr-notificheRuoloWfa">
            <thead>
                <tr>
                    <td colspan="3"><span class="section-title">STEP 03 – ASSEGNA NOTIFICHE</span></td>
                </tr> <!--
                <tr>
                    <td></td>
                    <td width="250px" height="35px">
                    <div class="custom-select">
                        <input id="cmbRuoliFaseR" data-id="-1" type="text" name="utentiR" data-ruolo="R" placeholder="SEL. RUOLO" autocomplete="off" readonly="readonly" data-multiselect="true">
                        <span id="cmbRuoliFaseRArrow" class="icon-triangle-s"></span>
                        </input>
                    </div>
                    </td>
                    <td>
                        <span class="bnlhr-font-weight-bold" style="padding: 0;padding-right:22px">SEL. GRUPPI</span>
                    </td>
                </tr> -->
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    <div class="bnlhr-standard" style="width: 50%">
        <table class="bnlhr-simple-table">
            <body>
                <tr>
                    <td width="20%">
                        <input type="button" id="bnlhr-btnAvantiDefinidciWFA" class="bnlhr-button " value="Avanti" />
                    </td>
                    <td width="5%"></td>
                    <td width="20%">
                        <input type="button" id="bnlhr-btnIndietroDefinidciWFA" class="bnlhr-button-white " value="Indietro" />
                    </td>
                </tr>
                <tr>
                    <td width="20%">
                        <input type="button" id="bnlhr-btnSalvaEsciDefinidciWFA" class="bnlhr-button-white" value="Salva ed esci" />
                    </td>
                    <td width="5%"></td>
                    <td width="20%">
                        <input type="button" id="bnlhr-btnEliminaWfa" data-action="" class="bnlhr-button-white " value="Elimina" style="display: none" />
                    </td>
                </tr>
            </body>
        </table>
    </div>
</div>