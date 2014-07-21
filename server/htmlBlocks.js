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

		var editorSidebar = document.getElementsByClassName( "editor-sidebar" )[0];
		editorSidebar.appendChild(blocks.editorTabs);
		editorSidebar.appendChild(blocks.inspector);
		editorSidebar.appendChild(blocks.assets);

		var inspector = document.getElementsByClassName( "inspector" )[0];

		htmlBlocks.allPermanent = [
			htmlBlocks.sceneTree,
			htmlBlocks.objectInfo,
			htmlBlocks.transforms
		];

		htmlBlocks.userComponents = [
			htmlBlocks.sample1
		];

		var permanentElements = htmlBlocks.allPermanent;
		var numPermanent = permanentElements.length;

		for ( var indx = 0; indx < numPermanent; indx++ ) {
			inspector.appendChild(permanentElements[indx]);

			// Don't put an hr after the last component
			if ( indx < numPermanent - 1 ) {
				var hr = document.createElement('hr');
				inspector.appendChild(hr);
			}
		}

		document.getElementsByClassName( "sampler" )[0].appendChild(blocks.sampler);
					// blocks.sampler;

	},


	/* ===================================
	   Blocks
	   ==================================== */

	sampler: hyper( 'div', 'Test sampler' ),

	editorTabs:
		hyper( 'div.tab-container',  // element for js
			hyper( 'div.tab.spacer', 'Inspector' ),
			hyper( 'menu#sidebar-nav.tab-bar',  // id for jump to top
				hyper( 'li.tab.inspector-get.active-tab', 'Inspector' ),
				hyper( 'li.tab.assets-get', 'Assets' )
			)
		),  // end editorTabs

	inspector: hyper( 'div.inspector' ),
	// "<div class='inspector'></div>",

	assets: hyper( 'div.assets' ),
	// "<div class='assets'></div>",

	sceneTree:
		hyper( 'section.scene-tree-container',

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img', { src: 'images/arrow-small.png', alt: 'Click to collapse' })
				),
				'Scene Object Tree'
			),

			// Maybe not a menu, menu isn't supported by most browsers
			hyper( 'menu.scene-tree.collapsible',
				// Clicking on an object should select it in the scene
				hyper( 'ul',

					hyper( 'li.scene-obj.obj-1',

						hyper( 'div.selectable',
							// TODO: only give an object a collapser if it has children
							hyper( 'button.collapser.expanded',
								hyper('img',  { src: 'images/arrow-small.png',
									alt: 'Click to collapse' })
							),  // end button.collapser
							'Some Object 1'
						)

					),  // end .obj-1

					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)

				)  // end ul
			)  // end menu.scene-tree
		)  // end .scene-tree-container
	,  // end sceneTree

	objectInfo:
		hyper( 'section.component.obj-info', 

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img',  { src: 'images/arrow-small.png',
						alt: 'Click to collapse' })
				),  // end button.collapser
				'Object Info'
			),

			hyper( 'form.collapsible',
				hyper( 'ul',

					hyper( 'li.child',
						'Prefabs'
					),  // end li

					hyper( 'li.child',
						'name'
					),  // end li

					hyper( 'li.child',
						'id'
					),  // end li

					hyper( 'li.child',
						'foo'
					)  // end li

				),  // end ul

				hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
					'Jump to top'
				)

			)  // end form

		),  // end objectInfo

	transforms:
		hyper( 'section.component.transforms',

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img',  { src: 'images/arrow-small.png',
						alt: 'Click to collapse' })
				),  // end button.collapser
				'Transforms'
			),

			hyper( 'form.collapsible',
				'contents',

				hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
					'Jump to top'
				)

			)  // end form

		)  // end .transforms
	,  // end transforms

	sample1:
		hyper( 'section.component.componentType',

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img',  { src: 'images/arrow-small.png',
						alt: 'Click to collapse' })
				),  // end button.collapser
				'Sample Component 1'
			),

			hyper( 'form.collapsible',
				'contents',

				hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
					'Jump to top'
				)

			)  // end form

		)  // end .componentType
	,  // end sample1

	// 'Components' that are always present
	allPermanent: [
		// Will contain (assigned in _init_()):
		// htmlBlocks.sceneTree,
		// htmlBlocks.objectInfo,
		// htmlBlocks.transforms
		// perhaps materials as well
	],

	// Components the user adds
	userComponents: [
		// htmlBlocks.sample1
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
