<div class="bnlhr-view">
    <h1 id=titleView></h1>
    <br>
    <div style="width: 100%">
        <table class="bnlhr-table-filter">
            <thead>
                <tr>
                    <td width="350px">Categoria</td>
                    <td width="350px">Processo</td>
                    <td width="350px">Progressivo</td>
                    <td width="350px">Data richiesta</td>
                </tr>
            </thead>

            <body>
                <tr>
                    <td>
                        <select id="CategoriaCruscotto" class="bnlhr-select">
                        </select>
                    </td>
                    <td>
                        <select id="CruscottoWFA" class="bnlhr-select">
                        </select>
                    </td>
                    <td>
                        <div class="progressivo-filter-grid-container">
                            <div style="border: 1px solid var(--color-border-dark);border-right: 0;">
                                <input class="" type="text" id="Progressivo" placeholder="Inserisci un progressivo" style=" border: 0;margin: 0;">
                            </div>
                            <div class="icon-search" id="IconSearchProgressivo" style="border: 1px solid var(--color-border-dark);border-left: 0;cursor: pointer;"></div>
                        </div>
                    </td>
                    </td>
                    <td>
                        <input class="bnlhr-select" type="text" name="IntervalloCruscotto" value="" readonly placeholder="Intervallo di tempo" />
                    </td>
                </tr>
            </body>
        </table>

        <table class="bnlhr-table" id="bnlhr-listPraticheWfa" data-skip="0" data-page="0">
            <thead>
                <tr>
                    <td width="800px"><span class="bnlhr-icon-caret" data-filter="NomeWfa">&nbsp;</span><span data-filter="NomeWfa">Processo</span></td>
                    <td width="200px"><span class="bnlhr-icon-caret" data-filter="Progressivo">&nbsp;</span><span data-filter="CodificaProgressivo">Progressivo</span></td>
                    <td width="200px"><span class="bnlhr-icon-caret" data-filter="Stato">&nbsp;</span><span data-filter="Stato">Gestione</span></td>
                    <td width="300px" id="tdAzione"><span>&nbsp;</span><span>Azione di</span></td>
                    <td width="300px" id="tdDataDelibera"><span class="bnlhr-icon-caret" data-filter="DataDelibera">&nbsp;</span><span data-filter="DataDelibera">Data delibera</span></td>
                    <td width="300px"><span class="bnlhr-icon-caret" data-filter="DataRichiesta">&nbsp;</span><span data-filter="DataRichiesta">Data richiesta</span></td>
                    <td width="300px"><span class="bnlhr-icon-caret" data-filter="NomeDipendente">&nbsp;</span><span data-filter="NomeDipendente">Richiedente</span></td>
                    <td width="64px">&nbsp;</td>
                </tr>
            </thead>
            <tbody>
            </tbody>
            <tfoot style="display: none;">
                <tr>
                    <td colspan="5" style="text-align: center;">
                        <button id="btnBack" style="width: 100px; border-radius:5px" class="bnlhr-button-white">
                            <span class="icon-play-previous" style="opacity: 1;cursor: pointer;">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </button>
                        <button id="btnNext" class="bnlhr-button" style="width: 100px;border-radius:5px">
                            <span class="icon-play-next-white" style="opacity: 1;cursor: pointer;">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </button>
                    </td>
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
</div>