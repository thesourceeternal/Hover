/* 
* The building blocks of contextual interactivity
* TODO: discuss - should bottombar be in here? Should all
* html be in here?
*/

var hyper = require('hyperscript');

var htmlBlocks = module.exports = {

	// Existing elements
	// majority: document.getElementsByClassName( "majority" )[0],
	// sampler: document.getElementsByClassName( "sampler" )[0],
	// editor-sidebar: document.getElementsByClassName( "editor-sidebar" )[0],
	// inspector: document.getElementsByClassName( "inspector" )[0],
	// assets: document.getElementsByClassName( "assets" )[0],

	_init_: function () {

		var blocks = htmlBlocks;

		document.getElementsByClassName( "editor-sidebar" )[0].innerHTML =
					blocks.editorTabs + blocks.inspector + blocks.assets;

		// Get all the inspector stuff together
		var inspectorContents = blocks.sceneTree + "<hr>" +
							blocks.objectInfo + "<hr>" +
							blocks.transforms + "<hr>";

		var components = blocks.allComponents;

		for ( var compIndx = 0; compIndx < components.length; compIndx++ ) {
			inspectorContents += components[compIndx];

			// Don't put an hr after the last component
			if ( compIndx < components.length - 1 ) {
				inspectorContents += "<hr>";
			}

		}

		document.getElementsByClassName( "inspector" )[0].innerHTML =
					inspectorContents;

		document.getElementsByClassName( "sampler" )[0].appendChild(blocks.sampler);
					// blocks.sampler;

	},


	/* ===================================
	   Blocks
	   ==================================== */

	sampler: hyper('div', 'Test sampler'),

	inspector: "<div class='inspector'></div>",

	assets: "<div class='assets'></div>",

	editorTabs: "<div class='tab-container'>  <!-- in here for js -->\n"+
    "<div class='tab spacer'>Inspector</div>\n"+
    "<menu id='sidebar-nav' class='tab-bar'>  <!-- id for jump to top -->\n"+
    "    <li class='tab inspector-get active-tab'>Inspector</li>\n"+
    "    <li class='tab assets-get'>Assets</li>\n"+
    "</menu>\n"+
    "</div> <!-- end .tab-container -->"
    ,  // end editorTabs

	sceneTree:
		"<section class='scene-tree-container'>" +
			"<h1>" +
				"<button class='collapser expanded'>" +
					"<img src='images/arrow-small.png' alt='Click to collapse'>" +
				"</button>" +
				"Scene Object Tree" +
			"</h1>" +

			"<!-- Maybe this shouldn't be a menu, menu " +
			"isn't supported by most browsers -->" +
            "<menu type='context' class='scene-tree collapsible'> <!-- draggable height change -->" +
                "<!-- Clicking on an object selects it in the scene -->" +

                "<ul>" +
	                "<li class='scene-obj obj-1'>" +
                        "<div class='selectable'>" +
                        // TODO: only give an object a collapser if it has children
                            "<button class='collapser expanded'>" +
	                            "<img src='images/arrow-small.png' alt='Click to collapse'>" +
                            "</button>" +
                            " Some Object 1" +
                        "</div>" +
                    "<li> <!-- end .obj-1 -->" +

                "</ul> <!-- end .scene-tree -->" +

                "<a class='tiny-text jump-to-top' href='#sidebar-nav'>Jump to top</a>" +
            "</menu>" +
            "<!-- Add a search field for searching the objects (lazy search) -->" +

		"</section> <!-- end .scene-tree-container -->"
	,  // end sceneTree

	objectInfo:
		"<section class='component obj-info'>" +
	        "<h1>" +
	            "<button class='collapser expanded'>" +
	            	"<img src='images/arrow-small.png' alt='Click to collapse'>" +
            	"</button> Object Info" +
	        "</h1>" +

	        "<form class='collapsible'>" +
	            "<ul>" +
	                "<li class='child info-field'>" +
	                    "<label>Prefab:" +
	                        "<select name='prefab'>" +
	                            "<option>None (make unique)</option>" +
	                            "<option>prefab 1</option>" +
	                            "<option>prefab 2</option>" +
	                        "</select>" +
	                    "</label>" +
	                "</li>" +
	                "<li class='child info-field'>" +
	                    "<label>name:" +
	                        "<input name='name' type='text'>" +
	                    "</label>" +
	                "</li>" +
	                "<li class='child info-field'>" +
	                    "<label>id:" +
	                        "<input name='id' type='text'>" +
	                    "</label>" +
	                "</li>" +
	                "<li class='child info-field'>" +
	                    "<label>foo:" +
	                        "<input name='foo' type='text'>" +
	                    "</label>" +
	                "</li>" +
	            "</ul>" +

	            "<a class='tiny-text jump-to-top' href='#sidebar-nav'>Jump to top</a>  <!-- is nav needed? -->" +
	        "</form>" +

	    "</section> <!-- end .obj-info -->"
    ,  // end objectInfo

	transforms: "transforms",

	allComponents: [
		"component 1",
		"component 2"
	],

	/* ===================================
	   Functions
	   ==================================== */

	// --- Components --- \\
	createComponent: function () {

	},

	changeComponent: function () {

	},

};  // end htmlBlocks{}
