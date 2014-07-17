/* 
* Controls the hiding and showing of element blocks
*/

var displayBlocks = {

	// Bools
	editorShowing: false,
	inspectorShowing: false,
	assetsShowing: false,
	// samplerShowing: false,
	codeShowing: false,

	/* ===================================
	   Functions
	   ==================================== */

	// --- Editor --- \\
	toggleEditor: function () {
		
		if (displayBlocks.editorShowing) {
			displayBlocks.hideEditor();
		} else {
			displayBlocks.showEditor();
		}


	},  // end toggleEditor()

	showEditor: function () {

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

	// --- Inspector --- \\
	showInspector: function () {},  // end showInspector()

	hideInspector: function () {},  // end hideInspector()

	// --- Assets --- \\
	showAssets: function () {},  // end showAssets()

	hideAssets: function () {},  // end hideAssets()

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

	},  // end hideIntro()


}
