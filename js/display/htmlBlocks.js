/* 
* The building blocks of contextual interactivity
* TODO: discuss - should bottombar be in here? Should all
* html be in here?
*/

var htmlBlocks = {

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
		document.getElementsByClassName( "inspector" )[0].innerHTML =
					blocks.sceneTree;

		document.getElementsByClassName( "sampler" )[0].innerHTML =
					blocks.sampler;

	},


	/* ===================================
	   Blocks
	   ==================================== */

	inspector: "<div class='inspector'></div>",

	assets: "<div class='assets'></div>",

	editorTabs: "<div class='tab-container'>  <!-- in here for js -->\n"+
    "<div class='tab spacer'>Inspector</div>\n"+
    "<menu id='sidebar-nav' class='tab-bar'>  <!-- id for jump to top -->\n"+
    "    <li class='tab inspector-get active-tab'>Inspector</li>\n"+
    "    <li class='tab assets-get'>Assets</li>\n"+
    "</menu>\n"+
    "</div> <!-- end .tab-container -->"
    ,

	sceneTree:
		"<section class='scene-tree-container'>" +
			"<h1>" +
				"<button class='collapser'>" +
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
                            "<button class='collapser'>" +
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
	, 

	objectInfo: null,

	transforms: null,

	sampler: "<div>\n"+
	"Test sampler\n"+
	"</div>",


	/* ===================================
	   Functions
	   ==================================== */

	// --- Components --- \\
	createComponent: function () {

	},

	changeComponent: function () {

	},

};  // end htmlBlocks{}
