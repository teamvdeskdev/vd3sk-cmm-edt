<ul>
	<li>

	<li>
		<a style="opacity:1 !important;margin-top: -15px;">
			<b>Operazioni su Workflow</b>
			<hr>
		</a>
	</li>
	<li><a class="menuItem" id="btnWriteDb" href="#"><i class="icon-add"></i>Salva</a></li>
	<li><a class="menuItem" id="btnWriteDbandExit" href="#"><i class="icon-add"></i>Salva e pubblica</a></li>
	<li><a class="menuItem" id="btnLoadDb" href="#"><i class="icon-external"></i>Carica</a></li>
	<li><a class="menuItem" id="btnClearPaper" href="#"><i class="icon-clippy"></i>Pulisci Paper</a></li>
	<!-- <li><a class="menuItem" id="btnEnabDisab" href="#"><i class="icon-password"></i>Edit On/Off</a></li> -->
	<li><a class="menuItem" id="btnStartWorkflow" style="display:none" href=""><i class="icon-play"></i>Start Workflow</a></li>
	<li><a class="menuItem" id="btnLoadEngineLabels" style="display:none" href=""><i class="icon-settings-dark"></i>Engine On/Off</a></li>

	</li>
	<li>&nbsp;</li>
	<li>

	<li><a style="opacity:1 !important;">
			<b>Importa / Esporta</b>
			<hr>
		</a>
	</li>
	<li>
		<div id='wfImporta-pupupMenu' class="newFileMenu popovermenu bubble menu open menu-left" style="display: none;">
			<ul>
				<li>
					<label id='wf-lnkDriveImporta' for="file_upload_start-driveImporta" class="menuitem" data-action="upload" title="" tabindex="0"><span class="svg icon icon-upload"></span><span class="displayname">Carica file dal cloud</span></label>
				</li>
				<li>
					<label id='wf-lnkLocalImporta' for="file_upload_startImporta" class="menuitem" data-action="upload" title="" tabindex="0"><span class="svg icon icon-upload"></span><span class="displayname">Carica file locale</span></label>
					<input type="file" id="file_upload_startImporta" class="hiddenuploadfield" >

				</li>
			</ul>
		</div>
		<a class="menuItem" href="#" id="btnFileInput"><i class="icon-upload"></i><label>Carica da File</label></a>
		<!-- <input type="file" name="fileInput" id="fileInput"> -->
	</li>
	<li>
		<a class="menuItem" href="#" id="btnVisioInput"><i class="icon-upload"></i><label>Importa da Visio</label></a>
		<div id='wfImportaVisio-pupupMenu' class="newFileMenu popovermenu bubble menu open menu-left" style="display: none;">
			<ul>
				<li>
					<label id='wf-lnkDriveVisio' for="file_upload_start-driveImporta" class="menuitem" data-action="upload" title="" tabindex="0"><span class="svg icon icon-upload"></span><span class="displayname">Carica file dal cloud</span></label>
				</li>
				<li>
					<label id='wf-lnkLocalVisio' for="visioInput" class="menuitem" data-action="upload" title="" tabindex="0"><span class="svg icon icon-upload"></span><span class="displayname">Carica file locale</span></label>
					<input type="file" id="visioInput" class="hiddenuploadfield" >

				</li>
			</ul>
		</div>
		
	</li>
	<li><a class="menuItem" id="btnWriteFile" href="#"><i class="icon-download"></i>Esporta su File</a><a id="downloadlink" style="display: none"></a></li>
	</li>
	</li>
	<li>&nbsp;</li>
	<li>

	<li><a style="opacity:1 !important;">
			<b>Monitor</b>
			<hr>
		</a>
	</li>
	<li>
		<a class="menuItem" id="btnWfLog"><i class="icon-category-monitoring"></i>Workflow Logs</a>
	</li>

	</li>
	<li>&nbsp;</li>
	<li id="libraryMenu">
		<a style="opacity:1 !important;">
			<b>Library</b>
			<hr>
		</a>
	</li>


	</li>
</ul>