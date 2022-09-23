<div class="bnlhr-view">
    <h1 >Richiedi delibera: <span id="NomeWfa"></span></h1>
    <input type="hidden" id="WfaId" />
    <input type="hidden" id="CategoriaWfa" />
    <br />
    <div style="width: 100%" id="DipendenteSelect">
        <table class="bnlhr-table-filter">            
            <body>           
            <tr width="30%">
                <td>Inserisci dipendente beneficiario</td>
            </tr>
            <tr width="30%">
                <td>                    
                    <div class="autocomplete" style="width:32%;">
                        <input id="Dipendente" data-id="-1" data-uid='-1' type="text" name="Dipendente" placeholder="Cerca dipendente" style="width:95%" autocomplete="off">
                        <span id="autocompleteLoading" class="icon-loading-small-dark" style="display:none;top:0;left: -17px;"></span>
                    </div>
                    <input type="button" id="bnlhr-btnAggiungiDipendente" class="bnlhr-button-white" value="AGGIUNGI" style="width: 8%;min-width: fit-content;" />
                </td>
            </tr>
            </body>
        </table>
    </div>
    <div style="width: 100%">
        <table class="bnlhr-table" id="bnlhr-listDipendenti" >
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
        <table style="width: 100%; height: 400px;display: none" >
            <tr>
                <td align="center" valign="middle">
                    <img src="img/loading-small.gif">
                </td>
            </tr>
        </table>
    </div>
    <div style="width: 30%">
        <input type="button" id="bnlhr-btnAvantiAvviaWFA" class="bnlhr-button" value="AVANTI" />
    </div>
</div>

<!-- 
<div style="width: 100%"> 
        <table class="bnlhr-table-filter">
            <thead>
            <tr>
                <td width="150x">Categoria richiesta</td>
                <td width="150px">Richiesta</td>
            </tr>
            </thead>
            <body>
            <tr>
                <td>
                    <select id="AvviaWFACategoriaId" class="bnlhr-select">
                    </select>
                </td>
                <td>
                    <select id="Richiesta" class="bnlhr-select" style="width:300px">
                    </select>
                </td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td>Inserisci dipendenti beneficiari</td>
            </tr>
            <tr>
                <td>                    
                    <div class="autocomplete" style="width:100%;">
                        <input id="Dipendente" data-id="-1" data-uid='-1' type="text" name="Dipendente" placeholder="Cerca dipendente" style="width:95%" autocomplete="off">
                        <span id="autocompleteLoading" class="icon-loading-small-dark" style="display:none;top:0;left: -17px;"></span>
                    </div>
                    <input type="button" id="bnlhr-btnAggiungiDipendente" class="bnlhr-button-white" value="AGGIUNGI" style="width: 150px" />
                </td>
            </tr>
            </body>
        </table>
    </div>
-->