/* 
* Controls the hiding and showing of element blocks
*/

var userState = require('./userState.js');
var select = require('./ui/select.js');


module.exports = displayBlocks = {

	// Bools
	// editorShowing: false,
	// inspectorShowing: true,
	// assetsShowing: false,
	// samplerShowing: false,
	// codeShowing: false,

	// Maybe place in userstate.js
	lockElements: [],  // Elements visible during pointer lock
	freeElements: [],  // Elements visible when pointer is free

	_init_: function () {

		// Used to hide and show for pointer lock
		// Elements visible during pointer lock
		displayBlocks.lockElements = [
			document.getElementsByClassName("sampler")[0],
			document.getElementsByClassName("reticule")[0]
		]

		// Elements visible when pointer is free
		displayBlocks.freeElements = [
			document.getElementsByClassName("editor-sidebar")[0],
			document.getElementsByClassName("bottombar")[0],
			document.getElementsByClassName("code")[0]
		]

		// intro is its own thing
		// sidebar and inventory are always visible after intro


	},  // end _init_


	/* ===================================
	   Functions
	   ==================================== */

	// --- Smaller Effects --- \\

	// Expands and collapses the first sibling of a .collapser element
	// Changes the arrow image too
	toggleCollapse: function (element) {

		var sib = element.parentNode.nextSibling;

		// Uses jquery slideToggle function for nice animation
		$(sib).slideToggle();

		// Change the arrow image and it's alt text (accessibility)
		if ( element.classList.contains("expanded") ) {

			element.classList.remove("expanded");
			element.alt = "Click to expand";

		} else {

			element.classList.add("expanded");
			element.alt = "Click to collapse";

		}

	},


	// --- Editor Blocks --- \\
	toggleEditor: function () {
		
		if (userState.editorShowing) {
			displayBlocks.hideEditor();
		} else {
			displayBlocks.showEditor();
		}

	},  // end toggleEditor()

	showEditor: function () {

		pointerLock.unlockPointer();

		var lockElems = displayBlocks.lockElements;
		var freeElems = displayBlocks.freeElements;

		for ( var indx = 0; indx < lockElems.length; indx++ ) {
			lockElems[indx].classList.add("collapsed");
		}

		for ( var indx = 0; indx < freeElems.length ;indx++ ) {
			freeElems[indx].classList.remove("collapsed");
		}

		userState.editorShowing = true;

		// Start fppov controls
		cubeWorld.controls.enabled = false;
		select.disableHoverSelection();

	},  // end showEditor()

	hideEditor: function () {

		pointerLock.lockPointer();

		var freeElems = displayBlocks.freeElements;
		var lockElems = displayBlocks.lockElements;

		for ( var indx = 0; indx < freeElems.length ;indx++ ) {
			freeElems[indx].classList.add("collapsed");
		}

		for ( var indx = 0; indx < lockElems.length; indx++ ) {
			lockElems[indx].classList.remove("collapsed");
		}

		userState.editorShowing = false;

		// Start fppov controls
		cubeWorld.controls.enabled = true;

		select.enableHoverSelection();

	},  // end hideEditor()

	// --- Tabs --- \\
	// toggleTabs: function () {

	// 	// Toggle visibility of the inspector and assets in sidebar
	// 	if ( userState.inspectorShowing ) {

		// displayBlocks.showAssets();

	// 	} else {

		// displayBlocks.showInspector();

	// 	}

	// },  // end toggleTabs()

	showInspector: function () {

		// Show inspector, hide assets
		document.getElementsByClassName( "inspector" )[0].classList.remove("collapsed");
		document.getElementsByClassName( "assets" )[0].classList.add("collapsed");

		// Change the appearence of the inspector tabs
		document.getElementsByClassName( "inspector-get" )[0].classList.add("active-tab");
		document.getElementsByClassName( "assets-get" )[0].classList.remove("active-tab");

		userState.inspectorShowing = true;

	},  // end showInspector()

	showAssets: function () {

		// Show assets, hide inspector
		document.getElementsByClassName( "assets" )[0].classList.remove("collapsed");
		document.getElementsByClassName( "inspector" )[0].classList.add("collapsed");

		// Change the appearence of the inspector tabs
		document.getElementsByClassName( "assets-get" )[0].classList.add("active-tab");
		document.getElementsByClassName( "inspector-get" )[0].classList.remove("active-tab");

		userState.inspectorShowing = false;


	},  // end showAssets()

	// // --- Sampler --- \\
	// // Sampler? Info box?
	// showSampler: function () {},  // end showSampler()

	// hideSampler: function () {},  // end hideSampler()

	// --- Code --- \\
	toggleCode: function () {
		// toggle code mirror editor
	},  // end toggleCode()

	showCode: function () {},  // end showCode()

	hideCode: function () {},  // end hideCode()

	// --- Intro --- \\
	showIntro: function () {

		// Hide everything other than the intro and canvas
		var freeElems = displayBlocks.freeElements;
		var lockElems = displayBlocks.lockElements;

		for ( var indx = 0; indx < freeElems.length ;indx++ ) {
			freeElems[indx].classList.add("collapsed");
		}

		for ( var indx = 0; indx < lockElems.length; indx++ ) {
			lockElems[indx].classList.add("collapsed");
		}


		document.getElementsByClassName( "sidebar" )[0].classList.add("collapsed");


		// hide any sidebar contents, the bars, reticule and the inventory
		// document.getElementsByClassName( "sampler" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "editor-sidebar" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "bottombar" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "reticule" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "inventory" )[0].classList.add("collapsed");

		// show the majority with the intro in it
		document.getElementsByClassName( "intro" )[0].classList.remove("collapsed");
		// document.getElementsByClassName( "majority" )[0].classList.remove("collapsed");
		// show the sidebar

	},  // end showIntro()

	hideIntro: function () {

		// Remove the intro
		var intro = document.getElementsByClassName( "intro" )[0];
		intro.parentNode.removeChild(intro);

		document.getElementsByClassName( "sidebar" )[0].classList.remove("collapsed");

		// The sidebar and sampler are exposed
		displayBlocks.hideEditor();

		userState.arrival = false;

	},  // end hideIntro()


}
