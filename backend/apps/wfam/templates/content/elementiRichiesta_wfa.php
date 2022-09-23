<div class="bnlhr-view">
    <span class="section-title" style="padding-left:10px">STEP 04 – DEFINISCI ELEMENTI DELLA RICHIESTA</span>
    <table class="bnlhr-simple-table" style="width: 20%;">
        <thead>
            <tr>
                <input type="hidden" id="WfaId" />
                <td width="300px">Aggiungi elemento di scrittura</td>
            </tr>
        </thead>

        <body>
            <tr>
                <td>
                    <select class="bnlhr-select" id="bnlhr-selectElementiRichiesta">
                        <!--<option value="-1" selected>Seleziona elementi</option>-->
                        <!-- <option value="1">Ricerca dipendente</option>
                    <option value="2">Data decorrenza</option>
                    <option value="3">Importo</option>
                    <option value="4">Motivazione</option>
                    <option value="5">Organo deliberante</option>
                    <option value="6">Allegati</option>
                    <option value="7">Note aggiuntive</option> -->
                    </select>
                </td>
            </tr>
        </body>
    </table>
    <div class="bnlhr-standard" style="width: 100%">
        <table class="bnlhr-table sorted_table" id="bnlhr-listElementiRichiesta" style="width: 100%;">
            <tbody>

            </tbody>
        </table>
    </div>
    <div class="bnlhr-standard" style="width: 50%">
        <table class="bnlhr-simple-table">

            <body>
                <tr>
                    <td width="20%">
                        <input type="button" id="bnlhr-btnAvantiElementiRichiesta" class="bnlhr-button " value="Avanti" />
                    </td>
                    <td width="5%"></td>
                    <td width="20%">
                        <input type="button" id="bnlhr-btnIndietroElementiRichiesta" class="bnlhr-button-white " value="Indietro" />
                    </td>
                </tr>
                <tr>
                    <td width="20%">
                        <input type="button" id="bnlhr-btnSalvaEsciElementiRichiesta" class="bnlhr-button-white" value="Salva ed esci" />
                    </td>
                </tr>
            </body>
        </table>
    </div>
</div>