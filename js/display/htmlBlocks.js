/* 
* The building blocks of contextual interactivity
* TODO: discuss - should bottombar be in here? Should all
* html be in here?
*/

var htmlBlocks = {

	_init_: function () {

		document.getElementsByClassName( "editor-sidebar" )[0].innerHTML =
					htmlBlocks.editorTabs;
		document.getElementsByClassName( "sampler" )[0]
								.innerHTML = htmlBlocks.sampler;

	},

	editorTabs: "<div class='tab-container'>  <!-- in here for js -->\n"+
    "<div class='tab spacer'>Inspector</div>\n"+
    "<menu id='sidebar-nav' class='tab-bar'>  <!-- id for jump to top -->\n"+
    "    <li class='tab inspector-get active-tab'>Inspector</li>\n"+
    "    <li class='tab assets-get'>Assets</li>\n"+
    "</menu>\n"+
    "</div>",

	sceneTree: null, 

	objectInfo: null,

	transforms: null,

	sampler: "<div>\n"+
	"Test sampler\n"+
	"</div>"

};
