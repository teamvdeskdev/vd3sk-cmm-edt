<div class="bnlhr-view">
    <!-- <input type="button" id="btnPDFTEST" value="pdf"> -->
    <h1 id="FormTitle"></h1>
    <!-- <span id="workflowPreview" class="button-link"><i class="icon-settings-dark">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i> Stato Workflow</span> -->

    <div style="width: 80%;float: left;">
        <table class="bnlhr-table" id="bnlhr-listDipendenti">
            <thead>
                <tr>
                    <td width="300px" style="padding-left:10px">Beneficiario</td>
                    <td width="400px" style="padding-left:10px">Sede</td>
                    <td width="300px" style="padding-left:10px">Mansione</td>
                    <td width="300px" style="padding-left:10px">Inquadramento</td>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>

        <table width="100%" class="bnlhr-simple-table">
            <thead>
                <tr>
                    <td style="text-align: right;text-align: left;transform: scale(0.8);transform-origin: top right;transform-origin: left;">
                        <a id="bnlhr-showAnteprima" class="button-link" style="padding-left:10px;"> <img src="/apps/wfam/img/icona-pdf.png" style="width:20px; height:20px; left:5px;" class="bnlhr-cursor-pointer"> <span style="position:relative; top:-5px;">Visualizza Anteprima </span> </a>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="vertical-align: top;">
                        <table class="bnlhr-simple-table" id="bnlhr-modifichePraticaWfaForm" style="display: none">
                            <tbody>
                                <tr>
                                    <td>
                                        <div id="ModificaContainer">
                                            <h3><span>Modifiche</span></h3>
                                            <span id="Modificatext"></span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="bnlhr-simple-table" id="bnlhr-praticaWfaForm">
                            <tbody>
                            </tbody>
                        </table>
                        <div class="bnlhr-standard" style="width: 500px;padding-left: 10px;display: none" id="panelActions">
                            <table class="bnlhr-simple-table" id="bnlhr-tableAzioni">
                                <tbody>
                                    <tr>
                                        <td width="20%">
                                            <input type="button" id="bnlhr-btnInviaPraticaForm" class="bnlhr-button " value="INVIA RICHIESTA" />
                                        </td>
                                        <td width="5%"></td>
                                        <td width="20%">
                                            <input type="button" id="bnlhr-btnIndietroPraticaForm" class="bnlhr-button-white " value="INDIETRO" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="20%">
                                            <input type="button" id="bnlhr-btnSalvaBozzaPraticaForm" class="bnlhr-button-white" value="SALVA BOZZA" />
                                        </td>
                                        <td width="5%"></td>
                                        <td width="20%">
                                            <input type="button" id="bnlhr-btnAnnullaPraticaForm" class="bnlhr-button-white " value="ANNULLA RICHIESTA" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="20%">
                                            <input type="button" id="bnlhr-btnDelegaPraticaForm" class="bnlhr-button-white" style="display: none;" value="DELEGA" />
                                        </td>
                                        <td width="5%"></td>
                                        <td width="20%">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>

            </tbody>
            <tfoot>
                <tr>

                </tr>

            </tfoot>
        </table>
        <table style="width: 100%; height: 400px;display: none">
            <tr>
                <td align="center" valign="middle">
                    <img src="img/loading-small.gif">
                </td>
            </tr>
        </table>
    </div>
    <div id="sintesi-processo">
    </div>
    <div class="container-lnklegenda">
        <span id="btnLegenda">Legenda</span>
    </div>

</div>