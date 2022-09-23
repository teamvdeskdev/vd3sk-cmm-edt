<div class="bnlhr-view">
    <h1>WFA disponibili</h1>
    <br />
    <div style="width: 100%">
        <table class="bnlhr-table-filter">
            <thead>
                <tr>
                    <td width="300px">Categoria</td>
                    <td width="300px">Stato</td>
                    <td width="300px">Intervallo di tempo di creazione</td>
                </tr>
            </thead>

            <body>
                <tr>
                    <td>
                        <select id="CategoriaIdFilter" class="bnlhr-select">

                        </select>
                    </td>
                    <td>
                        <select id="StatoWFA" class="bnlhr-select">
                        </select>
                    </td>
                    <td>
                        <input class="bnlhr-select" type="text" name="IntervalloCreazione" value="" readonly />
                    </td>
                </tr>
            </body>
        </table>
    </div>
    <div style="width: 100%">
        <table class="bnlhr-table" id="bnlhr-listWfa" data-skip="0" data-page="0">
            <thead>
                <tr>
                    <td width="500px"><span class="bnlhr-icon-caret" data-filter="Nome">&nbsp;</span><span data-filter="Nome">Nome</span></td>
                    <td width="300px"><span class="bnlhr-icon-caret" data-filter="NomeCategoria">&nbsp;</span><span data-filter="NomeCategoria">Categoria</span></td>
                    <td width="300px"><span class="bnlhr-icon-caret" data-filter="Stato">&nbsp;</span><span data-filter="Stato">Stato</span></td>
                    <td width="300px"><span class="bnlhr-icon-caret" data-filter="DataCreazione">&nbsp;</span><span data-filter="DataCreazione">Data creazione</span></td>
                    <td width="300px"><span class="bnlhr-icon-caret" data-filter="Creatore">&nbsp;</span><span data-filter="Creatore">Creatore</span></td>
                    <td align='center' valign='middle' width="85px">&nbsp;</td>
                    <td align='center' valign='middle' width="85px">&nbsp;</td>
                    <td width="60px"><span>&nbsp;</span></td>
                </tr>
            </thead>
            <tbody>
                <!--<tr>
                <td><span class="bnlhr-text-pre-wrap bnlhr-font-weight-bold">Piano di valorizzazione del portafoglio foglio clienti private</span></td>
                <td><span class="bnlhr-text-pre-wrap">Compensation e avanzamenti di carriera</span></td>
                <td><span class="bnlhr-text-pre-wrap">Bozza</span></td>
                <td><span class="bnlhr-text-pre-wrap">10/02/20109</span></td>
                <td><span class="bnlhr-text-pre-wrap">Mario Rossi</span></td>
            </tr>-->
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
    <div style="width: 30%">
        <input type="button" id="bnlhr-btnCreaWFA" class="bnlhr-button" value="CREA NUOVO WFA" style="display: none" />
    </div>


</div>