<div class="bnlhr-view">
    <h1>Definisci conseguenze di delibera</h1>
    <input type="hidden" id="WfaId" />
    <!--    Azioni approvazione-->
    <table class="bnlhr-simple-table" style="width: 20%;">
        <thead>
        <tr>
            <td width="300px">Aggiungi azione di approvazione</td>
        </tr>
        </thead>
        <body>
        <tr>
            <td>
                <select class="bnlhr-select" id="bnlhr-selectAzioneApprovazioneDelibera">
                    <!--<option value="-1" selected>Seleziona azione</option>-->
                    <!-- <option value="1">Protocollo Documenti</option>                     -->
                </select>
            </td>
        </tr>
        </body>
    </table>
    <div class="bnlhr-standard" style="width: 100%">
        <table class="bnlhr-table" id="bnlhr-listAzioniApprovazioneDelibera">
            <tbody>

            </tbody>
        </table>
    </div>
    
    <!--    Azioni rifiuto-->
    <table class="bnlhr-simple-table" style="width: 20%;">
        <thead>
        <tr>
            <td width="300px">Aggiungi azione di rifiuto</td>
        </tr>
        </thead>
        <body>
        <tr>
            <td>
                <select class="bnlhr-select" id="bnlhr-selectAzioneRifiutoDelibera">
                    <!--<option value="-1" selected>Seleziona azione</option>-->
                    <!-- <option value="1">Archivia Pratica</option> -->
                </select>
            </td>
        </tr>
        </body>
    </table>
    <div class="bnlhr-standard" style="width: 100%">
        <table class="bnlhr-table" id="bnlhr-listAzioniRifiutoDelibera">
            <tbody>

            </tbody>
        </table>
    </div>

<!--    Pulsanti-->
    <div class="bnlhr-standard" style="width: 50%">
        <table class="bnlhr-simple-table">
            <body>
            <tr>
                <td width="20%" >
                    <input type="button" id="bnlhr-btnAvantiAzioniDelibera" class="bnlhr-button " value="Avanti" />
                </td>
                <td width="5%"></td>
                <td width="20%">
                    <input type="button" id="bnlhr-btnIndietroAzioniDelibera" class="bnlhr-button-white " value="Indietro" />
                </td>
            </tr>
            <tr>
                <td width="20%">
                    <input type="button" id="bnlhr-btnSalvaEsciAzioniDelibera" class="bnlhr-button-white" value="Salva ed esci" />
                </td>
            </tr>
            </body>
        </table>
    </div>
</div>
