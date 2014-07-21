/* 
* Controls the hiding and showing of element blocks
*/

var displayBlocks = {

	// Bools
	editorShowing: false,
	inspectorShowing: true,
	assetsShowing: false,
	// samplerShowing: false,
	codeShowing: false,

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
		
		if (displayBlocks.editorShowing) {
			displayBlocks.hideEditor();
		} else {
			displayBlocks.showEditor();
		}

	},  // end toggleEditor()

	showEditor: function () {

		pointerLock.unlockPointer();

		// Hide the object info sampler and reticule
		document.getElementsByClassName( "sampler" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "reticule" )[0].classList.add("collapsed");

		// Show majority element and editor sidebar
		document.getElementsByClassName( "majority" )[0].classList.remove("collapsed");
		document.getElementsByClassName( "editor-sidebar" )[0].classList.remove("collapsed");
		document.getElementsByClassName( "bottombar" )[0].classList.remove("collapsed");

		displayBlocks.editorShowing = true;

	},  // end showEditor()

	hideEditor: function () {

		pointerLock.lockPointer();

		// Hide the majority element with the code and bars, and the sidebar editor
		document.getElementsByClassName( "majority" )[0].classList.add("collapsed");
		document.getElementsByClassName( "editor-sidebar" )[0].classList.add("collapsed");
		document.getElementsByClassName( "bottombar" )[0].classList.add("collapsed");

		// Show the object info sampler and reticule
		document.getElementsByClassName( "sampler" )[0].classList.remove("collapsed");
		// document.getElementsByClassName( "reticule" )[0].classList.remove("collapsed");

		// Show inventory perhaps
		// document.getElementsByClassName( "inventory" )[0].classList.remove("collapsed");

		displayBlocks.editorShowing = false;

	},  // end hideEditor()

	// --- Tabs --- \\
	// toggleTabs: function () {

	// 	// Toggle visibility of the inspector and assets in sidebar
	// 	if ( displayBlocks.inspectorShowing ) {

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

		displayBlocks.inspectorShowing = true;

	},  // end showInspector()

	showAssets: function () {

		// Show assets, hide inspector
		document.getElementsByClassName( "assets" )[0].classList.remove("collapsed");
		document.getElementsByClassName( "inspector" )[0].classList.add("collapsed");

		// Change the appearence of the inspector tabs
		document.getElementsByClassName( "assets-get" )[0].classList.add("active-tab");
		document.getElementsByClassName( "inspector-get" )[0].classList.remove("active-tab");

		displayBlocks.inspectorShowing = false;


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

		// hide any sidbar contents, the bars, reticule and the inventory
		document.getElementsByClassName( "sampler" )[0].classList.add("collapsed");
		document.getElementsByClassName( "editor-sidebar" )[0].classList.add("collapsed");
		document.getElementsByClassName( "bottombar" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "reticule" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "inventory" )[0].classList.add("collapsed");

		// show the majority with the intro in it
		document.getElementsByClassName( "intro" )[0].classList.remove("collapsed");
		document.getElementsByClassName( "majority" )[0].classList.remove("collapsed");
		// show the sidebar

	},  // end showIntro()

	hideIntro: function () {

		// Remove the intro
		var intro = document.getElementsByClassName( "intro" )[0];
		intro.parentNode.removeChild(intro);

		// The sidebar and sampler are exposed
		displayBlocks.hideEditor();

		userState.arrival = false;

	},  // end hideIntro()


}
