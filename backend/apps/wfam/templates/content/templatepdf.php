
<div id="pdf">
  

    
    <style type="text/css">
       .app-bnlhr #app-content #app-content-wrapper {
	display: block;
}
.app-bnlhr .bnlhr-view{
	padding: 20px;
	min-height: 200px;
	width: 100%;
}

.app-bnlhr h1 {
	font-size: 2em;
	margin-top: 20px;
	/*margin-bottom: 20px;*/
}

.app-bnlhr .bnlhr-table-filter
{
	width: 100%;
}
.app-bnlhr .bnlhr-table-filter thead tr>td
{
	font-weight: bold;

}
.app-bnlhr .bnlhr-table-filter tbody tr:hover
{
	font-weight: bold;
	background: transparent;

}

.app-bnlhr .bnlhr-select{
	width:-webkit-fill-available;
	width:-moz-available;
	width: 95%;
}

.app-bnlhr .bnlhr-table
{
	margin-top: 20px; 
	margin-bottom: 20px; 
}
.app-bnlhr .bnlhr-table thead tr>td
{
	background-color: black;
	height: 30px;
	color: white;
}
.app-bnlhr .bnlhr-table tbody tr>td
{
	border-bottom: 3px solid var(--color-primary);
	height: 30px;
	padding: 5px 5px 5px 10px;
}

.app-bnlhr .bnlhr-icon-caret
{
	background-image: url('../img/caret-white.png');
	background-repeat: no-repeat;
    background-size: 25px 25px;
	padding-left: 20px;
	top: -3px;
    position: relative;
}
.app-bnlhr .bnlhr-icon-drag
{
	background-image: url('../img/icon-drag.png');
	background-repeat: no-repeat;
	background-size: 25px 25px;
	padding-left: 20px;
	top: -3px;
	position: relative;
}
.app-bnlhr .bnlhr-text-pre-wrap
{
	white-space: pre-wrap;
}

.app-bnlhr .bnlhr-button {
    background-color: var(--color-primary);
    color:white;
	border-radius:0;
	width: 100%;
	text-transform: uppercase;
}

.app-bnlhr .bnlhr-button-white {
	background-color: #FFFFFF;
	color:#000000;
	border-radius:0;
	border:1px solid var(--color-primary);
	width: 100%;
	text-transform: uppercase;
}
.app-bnlhr .bnlhr-button-white:hover {
	background-color: var(--color-primary);
	color:#ffffff;
	border-radius:0;
	border:1px solid var(--color-primary);
	width: 100%;
}

.app-bnlhr .bnlhr-font-weight-bold
{
	font-weight: bold;
}
/*Crea nuovo WFA*/
.app-bnlhr .bnlhr-simple-table
{
	width: 100%;
	padding-top: 20px;
}
.app-bnlhr .bnlhr-simple-table tbody tr:hover
{
	background: transparent;
}

.app-bnlhr .bnlhr-standard .bnlhr-simple-table tbody tr>td
{
	height: 50px;
}

.app-bnlhr .bnlhr-simple-table input[type='text'] {
	width: 100%;
	box-sizing: border-box;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
}
.app-bnlhr .bnlhr-simple-table input[type='checkbox'] {
	 vertical-align: middle;
 }
.app-bnlhr .bnlhr-simple-table label {
	vertical-align: text-top !important;
	padding-right: 10px;
}

.app-bnlhr .bnlhr-simple-table select {
	width: 100%;
	box-sizing: border-box;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
}

.app-bnlhr .bnlhr-simple-table span
{
	padding-left: 10px;
	padding-right: 5px;
}

.app-bnlhr .bnlhr-simple-table.bnlhr-riepilogo
{
	width: 50%;
}
 .app-bnlhr .bnlhr-simple-table.bnlhr-riepilogo thead tr>td{
	width: 300px;
	height: 35px;
	color: var(--color-primary);
	font-weight: bold;
}

.app-bnlhr .bnlhr-simple-table.bnlhr-riepilogo tbody span{
	font-weight: bold;
	padding: 0;
}


/* The container */
.app-bnlhr .container {
	display: inline;
	position: relative;
	padding-left: 25px;
	margin-bottom: 0px;
	cursor: pointer;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

/* Hide the browser's default checkbox */
.app-bnlhr .container input {
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}

/* Create a custom checkbox */
.app-bnlhr .checkmark {
	position: absolute;
	top: 0;
	left: 0;
	height: 15px;
	width: 15px;
	background-color: #ffffff;
	border:1px solid var(--color-primary);
	padding:0 !important;
}

/* On mouse-over, add a grey background color */
.app-bnlhr .container:hover input ~ .checkmark {
	background-color: #ccc;
}

/* When the checkbox is checked, add a green background */
.app-bnlhr .container input:checked ~ .checkmark {
	background-color: var(--color-primary);

}

/* Create the checkmark/indicator (hidden when not checked) */
.app-bnlhr .checkmark:after {
	content: "";
	position: absolute;
	display: none;
}

/* Show the checkmark when checked */
.app-bnlhr .container input:checked ~ .checkmark:after {
	display: block;
}

/* Style the checkmark/indicator */
.app-bnlhr .container .checkmark:after {
	left: 4px;
	top: 2px;
	width: 3px;
	height: 5px;
	border: solid white;
	border-width: 0 2px 2px 0;
	-webkit-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	transform: rotate(45deg);
}


.sorted_table tr {
	cursor: pointer; }
/* line 96, /Users/jonasvonandrian/jquery-sortable/source/css/application.css.sass */
.sorted_table tr.placeholder {
	display: block;
	background: red;
	position: relative;
	margin-bottom: 30px;
	padding: 0;
	border: none; }
/* line 103, /Users/jonasvonandrian/jquery-sortable/source/css/application.css.sass */
.sorted_table tr.placeholder:before {
	content: "";
	position: absolute;
	width: 0;
	height: 0;
	border: 5px solid transparent;
	border-left-color: red;
	margin-top: -5px;
	left: -5px;
	border-right: none; }

.dragged {
	position: absolute;
	top: 0px;
	left:-200px;
	opacity: 0.6;
	z-index: 2000;
}

.bnlhr-drop-target{
	cursor: move;
}

/*breadcrumb*/
.app-bnlhr #bnlhr-breadcrumb {
	height: 40px;
	border-bottom: 1px solid #dedede;
	top: 20px;
	position:relative;
	width: 900px;

}

.app-bnlhr #bnlhr-breadcrumb ul {
	left: 20px;
	position: relative;
	display: inline-flex;
}

.app-bnlhr .active {
	font-weight: bold;
}

.app-bnlhr #bnlhr-breadcrumb .separator {
	padding-right: 10px;
	padding-left: 10px;
}

.app-bnlhr .bnlhr-cursor-pointer
{
	cursor: pointer;
}

.app-bnlhr #ModificaContainer
{
	background-color: #F8D7DA;
	border-radius: 5px;
	padding: 10px 10px 10px 10px;
	width: 500px;

}
.app-bnlhr #ModificaContainer h3
 {
	font-weight: bold;
	color: #84363D;
 }
.app-bnlhr #Modificatext
{
	font-weight: normal;
	color: #84363D;
}

.app-bnlhr .bnlhr-preview {
    vertical-align: top;
    border: 1px solid #dbdbdb;
    padding-left: 8px;
    padding-right: 8px;
    transform: scale(0.7);
    text-align: left;
    transform-origin: left;
    transform-origin: top;
    box-shadow: 0 5px 55px #ededed;
}
.app-bnlhr .autocomplete {
	/*the container must be positioned relative:*/
	position: relative;
	display: inline-block;
}

.app-bnlhr .autocomplete-items {
	position: absolute;
	border: 1px solid #d4d4d4;
	border-bottom: none;
	border-top: none;
	z-index: 99;
	/*position the autocomplete items to be the same width as the container:*/
	top: 100%;
	left: 0;
	right: 0;
}
.app-bnlhr .autocomplete-items div {
	padding: 10px;
	cursor: pointer;
	background-color: #fff;
	border-bottom: 1px solid #d4d4d4;
}
.app-bnlhr .autocomplete-items div:hover {
	/*when hovering an item:*/
	background-color: #e9e9e9;
}
.app-bnlhr .autocomplete-active {
	/*when navigating through the items using the arrow keys:*/
	background-color: DodgerBlue !important;
	color: #ffffff;
}

.app-bnlhr .bubble.menu-left, app-bnlhr .app-navigation-entry-menu.menu-left,app-bnlhr .popovermenu.menu-left {
	right: auto;
	left: 350px;
	margin-right: 0;
}
table {
    border-collapse: separate;
    border-spacing: 0;
    white-space: nowrap;
}

    </style>
