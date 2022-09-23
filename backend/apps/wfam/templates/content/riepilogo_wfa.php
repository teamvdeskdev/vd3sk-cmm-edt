<div class="bnlhr-view">
    <input type="hidden" id="WfaId" />

    <table class="bnlhr-simple-table" style="box-sizing:unset;" width="100%">
        <thead>
            <tr>
                <td width="20%" >
                    <h1 style="margin:0">Revisiona e pubblica WFA</h1>
                </td>
                <td style="padding-left:20px" width="80%">
                    <button class="bnlhr-button-white " style="width:200px" id="bnlhr-btnCreaFlusso">Crea / Modifica flusso</button>
                    <button class="bnlhr-button-white " style="width:150px" id="bnlhr-btnCaricaFlusso">Carica flusso</button>
                </td>

            </tr>
        </thead>
        <tbody>
            <tr>
                <td width="20%" style="vertical-align: top !important;">
                    <div>
                        <table class="bnlhr-simple-table bnlhr-riepilogo" id="bnlhr-WFA">
                            <thead>
                                <tr>
                                    <td><label>Controlla definizione WFA</label id></td>
                                </tr>
                            </thead>

                            <body>
                                <tr>
                                    <td>
                                        Nome WFA <span id="Nome"></span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Categoria WFA <span id="NomeCategoria" data-id=""></span>
                                    </td>
                                </tr>
                            </body>
                        </table>
                        <table class="bnlhr-simple-table bnlhr-riepilogo" id="bnlhr-RuoloWFA">
                            <tbody>

                            </tbody>
                        </table>

                        <table class="bnlhr-simple-table bnlhr-riepilogo" id="bnlhr-ElementoWFA">
                            <thead>
                                <tr>
                                    <td><label>Controlla elementi richiesta</label id></td>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>

                        <table class="bnlhr-simple-table bnlhr-riepilogo" id="bnlhr-AzioneWFA">
                            <thead>
                                <tr>
                                    <td><label>Controlla azioni di delibera</label id></td>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>


                        <!--    Pulsanti-->
                        <div class="bnlhr-standard">
                            <table class="bnlhr-simple-table" width="50%">
                                <tbody>
                                    <tr>
                                        <td width="20%">
                                            <input type="button" id="bnlhr-btnPubblicaRiepilogo" class="bnlhr-button " value="Pubblica" />
                                        </td>
                                        <td width="2%"></td>
                                        <td width="20%">
                                            <input type="button" id="bnlhr-btnIndietroRiepilogo" class="bnlhr-button-white " value="Indietro" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="20%">
                                            <input type="button" id="bnlhr-btnSalvaEsciRiepilogo" class="bnlhr-button-white" value="Salva ed esci" />
                                        </td>
                                        <td width="2%"></td>
                                        <td width="20%">
                                            <input type="button" id="bnlhr-btnEditPdf" class="bnlhr-button-white" value="Crea PDF" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </td>
                <td style="padding-left:20px" width="80%">
                    <div style="width:95% !important" id="paper"></div>
                </td>
            </tr>
        </tbody>
    </table>
</div>