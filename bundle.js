(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Starts things off

// Server stuff
var cubeWorld = require('./server/worlds/cubeworld.js');
var html = require('./server/htmlBlocks.js');

// User stuff
var pointerLock = require('./js/controls/pointerlock.js');
var mouseEvents = require('./js/controls/mouseevents.js');
var keyEvents = require('./js/controls/keyevents.js');

window.addEventListener( 'load', function () {

	/* ===================================
	    Server
	   ==================================== */

	// TODO: Need to seperate client stuff from this file
	cubeWorld();

	// The editor element representations of the objects
	html._init_();


	/* ===================================
	    User/Client
	   ==================================== */

	// Make all the pointer lock things work
	pointerLock._init_();

	// Add event listeners
	mouseEvents();
	keyEvents();

} );  // end window on load

},{"./js/controls/keyevents.js":2,"./js/controls/mouseevents.js":3,"./js/controls/pointerlock.js":4,"./server/htmlBlocks.js":17,"./server/worlds/cubeworld.js":18}],2:[function(require,module,exports){
/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/

var display = require('../display.js');
var userState = require('../userstate.js');


module.exports = keyEvents = function () {

	document.addEventListener( 'keyup', function () {

		var keyCode = ( 'which' in event ) ? event.which : event.keyCode;

		/* ===================================
		   UI
		   ==================================== */
		if ( keyCode === userState.preferences.hotkeys.pointerLock[2] ) {

			// Toggle display of inspector/assests vs. object sampler
			// but not on first arrival where hideIntro() will take care of it
			if ( userState.arrival ) {

				// This will take care of pointer lock too
				display.hideIntro();

			} else {  // just lock the pointer

				// Keyup so it waits till after all other pointer
				// changes have been made, after toggleEditor() so arrival
				// will stay true and intro will hide properly
				display.toggleEditor();
			}

		}  // end keyCode pointerLock


		/* ===================================
		   RUNNING TESTS
		   ==================================== */
		else if ( keyCode === userState.preferences.hotkeys.tests[2] ) {

			if (pointerLock.isLocked) {

				runTests();

			} else {  // the user may have not engaged pointerlock
				// so pointerlock tests can't run properly,
				// will give incorrect results
				console.log("Pressing 't' for tests is only " +
					"for use while pointer is locked. Using it while " +
					"pointer is unlocked may cause errors in testing.");
			}

		}  // end keyCode tests

	} );  // end document on keyup ()

};

},{"../display.js":5,"../userstate.js":7}],3:[function(require,module,exports){
/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/

var display = require('../display.js');
var userState = require('../userstate.js');


module.exports = mouseEvents = function () {

	// --- Input Elements --- \\
	document.addEventListener( 'click', function (event) {

		var eventTarget = event.target;
		var targetClasses = eventTarget.classList;

		// Keep buttons from scrolling to top of sidebar, etc.
		if ( eventTarget.tagName === "BUTTON" ) {
			event.preventDefault();
		}

		// -- Editor Functionality -- \\

		// Switch between inspector and assets
		if ( targetClasses.contains("tab") ) {

			if ( targetClasses.contains("inspector-get") ) {

				display.showInspector();

			} else if ( targetClasses.contains("assets-get") ) {

				display.showAssets();

			} else {

				console.log("You clicked a tab that does not exist...");

			}  // end if inspector or assets

		}  // end if .tab


		// Collapsing and expanding
		// NOTE: a .collaper's image has pointer-events: none so that it
		// won't become the target element and eat the click
		if ( targetClasses.contains("collapser") ) {

			display.toggleCollapse(eventTarget);

		}  // end if collapser


		// Pointer lock, get it back
		if ( targetClasses.contains("esc-clause") ) {

			display.toggleEditor();

		}  // end if .esc-clause

	} );


	// --- Intro --- \\
	// When first landing on the site. Escape key works too.
	// This event listener will not be removed, it's too much work for
	// one little event listener
	document.addEventListener( 'click', function () {

		if ( userState.arrival ) {

			// Will take care of pointer lock and all that jazz
			display.hideIntro();

		}

	} );

};

},{"../display.js":5,"../userstate.js":7}],4:[function(require,module,exports){
/*
* http://www.html5rocks.com/en/tutorials/pointerlock/intro/
* Also with functionality to toggle pointer lock
*/

// var controls = require('./controls.js');
var cubeWorld = require('../../server/worlds/cubeworld.js');


module.exports = pointerLock = {

	/* ===================================
	   Setup
	   ==================================== */

	// Element the pointer lock is assigned to
	lockElement: null,
	havePointerLock: null,
	// For toggling pointer lock (function below)
	isLocked: false,

	_init_: function () {

		// Does the user's browser support pointerlock
		pointerLock.havePointerLock = 'pointerLockElement' in document ||
		    'mozPointerLockElement' in document ||
		    'webkitPointerLockElement' in document;

		if ( !pointerLock.havePointerLock ) {  // For browsers that don't support pointerlock

			alert( "Sorry, your browser does not support pointer lock." );

		} else {  // This is the bulk of the action

			pointerLock.lockElement = document.body;
			lockElement = pointerLock.lockElement;

			// Normalize the name for the function that locks the pointer, no
			// matter the browser
			lockElement.requestPointerLock = lockElement.requestPointerLock ||
				     lockElement.mozRequestPointerLock ||
				     lockElement.webkitRequestPointerLock;

			// Normalize the name for the function that releases/unlocks the pointer
			document.exitPointerLock = document.exitPointerLock ||
					   document.mozExitPointerLock ||
					   document.webkitExitPointerLock;

			// Hook pointer lock state change events (event names assigned by browser)
			document.addEventListener('pointerlockchange', pointerLock.changePointerLock, false);
			document.addEventListener('mozpointerlockchange', pointerLock.changePointerLock, false);
			document.addEventListener('webkitpointerlockchange', pointerLock.changePointerLock, false);

			document.addEventListener( 'pointerlockerror', pointerLock.pointerLockError, false );
			document.addEventListener( 'mozpointerlockerror', pointerLock.pointerLockError, false );
			document.addEventListener( 'webkitpointerlockerror', pointerLock.pointerLockError, false );

		}

	},  // end _init_()


	/* ===================================
	   Functions
	   ==================================== */

	// Normalizes locking the pointer for all browsers
	lockPointer: function () {
		pointerLock.lockElement.requestPointerLock =
			pointerLock.lockElement.requestPointerLock ||
			pointerLock.lockElement.mozRequestPointerLock ||
			pointerLock.lockElement.webkitRequestPointerLock;

		pointerLock.lockElement.requestPointerLock();

		pointerLock.isLocked = true;

	},

	// Normalize unlocking the pointer for all browsers
	unlockPointer: function () {

		document.exitPointerLock = document.exitPointerLock ||
			document.mozExitPointerLock ||
			document.webkitExitPointerLock;

		document.exitPointerLock();

		pointerLock.isLocked = false;

	},

	// Toggles pointer lock independent of automatic changes
	toggleLock: function () {

		if ( pointerLock.isLocked ) {

			// Accessing our own function so isLocked changes
			pointerLock.unlockPointer();

		} else {

			pointerLock.lockPointer();

		}

	},  // end toggleLock()

	// Always happens when the pointer lock is changed
	changePointerLock: function ( event ) {

		// lockElement is passed into here automatically, event is not needed
		if ( document.pointerLockElement === lockElement ||  // pointer locked
			document.mozPointerLockElement === lockElement ||
			document.webkitPointerLockElement === lockElement ) {

			// Start fppov controls
			cubeWorld.controls.enabled = true;

		} else {  // pointer is NOT locked

			// Stop fppov controls
			cubeWorld.controls.enabled = false;

		}

	},  // end changePointerLock()

	// TODO: Comb https://dvcs.w3.org/hg/pointerlock/raw-file/default/index.html#dfn-target
	// to see if there are any other conditions to check for.
	pointerLockError: function () {

		console.log( "Pointer lock error:" );

		
		if ( document.pointerLockElement !== lockElement ||  // pointer locked
			document.mozPointerLockElement !== lockElement ||
			document.webkitPointerLockElement !== lockElement ) {

			console.log("The document pointer lock element is not the same as pointerlock.lockElement.");

		} else if ( !pointerLock.havePointerLock ) {

			console.log("This browser doesn't support pointer lock.");

		} else {

			console.log("I'm not sure what's wrong. Probably the user didn't make an engagement gesture.");

		}

	},  // end pointerLockError()

};  // end pointerLock {}

},{"../../server/worlds/cubeworld.js":18}],5:[function(require,module,exports){
/* 
* Controls the hiding and showing of element blocks
*/

var userState = require('./userState.js');


module.exports = displayBlocks = {

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
		// This is for just after the intro
		document.getElementsByClassName( "bottombar" )[0].classList.remove("collapsed");

		displayBlocks.editorShowing = true;

	},  // end showEditor()

	hideEditor: function () {

		pointerLock.lockPointer();

		// Hide the majority element with the code and bars, and the sidebar editor
		document.getElementsByClassName( "majority" )[0].classList.add("collapsed");
		document.getElementsByClassName( "editor-sidebar" )[0].classList.add("collapsed");

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

},{"./userState.js":6}],6:[function(require,module,exports){
/*
* User variables that need to be stored and accessed
*/

module.exports = userState = {

	arrival: true,

	preferences: {

		hotkeys: {

			// --- FPS Movement --- \\
			// NOT YET IMPLEMENTED
			forwards: ["forwards", "w", 87],
			left: ["left", "a", 65],
			backwards: ["backwards", "s", 83],
			right: ["right", "d", 68],
			jumpup: ["jump/up", "spacebar", 32],  // just up
			crouchdown: ["crouch/down", "shift", 16],  // just down
			// TODO: Implement double tapping, holding, and other behavior
			// TODO: Discuss implications of this behavior for user experience
			// startFlying: ["start flying", "double tap space bar", 32],
			toggleFlying: ["toggle flying", "f", 70],

			// --- pointerlock --- \\
			pointerLock: ["pointer lock", "esc", 27],

			// --- Testing --- \\
			tests: ["run tests", "t", 84],

		},  // end hotkeys{}

		flying: true,

	},  // end preferences{}

}


},{}],7:[function(require,module,exports){
module.exports=require(6)
},{}],8:[function(require,module,exports){

},{}],9:[function(require,module,exports){
var split = require('browser-split')
var ClassList = require('class-list')
var DataSet = require('data-set')
require('html-element')

function context () {

  var cleanupFuncs = []

  function h() {
    var args = [].slice.call(arguments), e = null
    function item (l) {
      var r
      function parseClass (string) {
        var m = split(string, /([\.#]?[a-zA-Z0-9_:-]+)/)
        if(/^\.|#/.test(m[1]))
          e = document.createElement('div')
        forEach(m, function (v) {
          var s = v.substring(1,v.length)
          if(!v) return
          if(!e)
            e = document.createElement(v)
          else if (v[0] === '.')
            ClassList(e).add(s)
          else if (v[0] === '#')
            e.setAttribute('id', s)
        })
      }

      if(l == null)
        ;
      else if('string' === typeof l) {
        if(!e)
          parseClass(l)
        else
          e.appendChild(r = document.createTextNode(l))
      }
      else if('number' === typeof l
        || 'boolean' === typeof l
        || l instanceof Date
        || l instanceof RegExp ) {
          e.appendChild(r = document.createTextNode(l.toString()))
      }
      //there might be a better way to handle this...
      else if (isArray(l))
        forEach(l, item)
      else if(isNode(l))
        e.appendChild(r = l)
      else if(l instanceof Text)
        e.appendChild(r = l)
      else if ('object' === typeof l) {
        for (var k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              if (e.addEventListener){
                e.addEventListener(k.substring(2), l[k], false)
                cleanupFuncs.push(function(){
                  e.removeEventListener(k.substring(2), l[k], false)
                })
              }else{
                e.attachEvent(k, l[k])
                cleanupFuncs.push(function(){
                  e.detachEvent(k, l[k])
                })
              }
            } else {
              // observable
              e[k] = l[k]()
              cleanupFuncs.push(l[k](function (v) {
                e[k] = v
              }))
            }
          }
          else if(k === 'style') {
            if('string' === typeof l[k]) {
              e.style.cssText = l[k]
            }else{
              for (var s in l[k]) (function(s, v) {
                if('function' === typeof v) {
                  // observable
                  e.style.setProperty(s, v())
                  cleanupFuncs.push(v(function (val) {
                    e.style.setProperty(s, val)
                  }))
                } else
                  e.style.setProperty(s, l[k][s])
              })(s, l[k][s])
            }
          } else if (k.substr(0, 5) === "data-") {
            DataSet(e)[k.substr(5)] = l[k]
          } else {
            e[k] = l[k]
          }
        }
      } else if ('function' === typeof l) {
        //assume it's an observable!
        var v = l()
        e.appendChild(r = isNode(v) ? v : document.createTextNode(v))

        cleanupFuncs.push(l(function (v) {
          if(isNode(v) && r.parentElement)
            r.parentElement.replaceChild(v, r), r = v
          else
            r.textContent = v
        }))
      }

      return r
    }
    while(args.length)
      item(args.shift())

    return e
  }

  h.cleanup = function () {
    for (var i = 0; i < cleanupFuncs.length; i++){
      cleanupFuncs[i]()
    }
  }

  return h
}

var h = module.exports = context()
h.context = context

function isNode (el) {
  return el && el.nodeName && el.nodeType
}

function isText (el) {
  return el && el.nodeName === '#text' && el.nodeType == 3
}

function forEach (arr, fn) {
  if (arr.forEach) return arr.forEach(fn)
  for (var i = 0; i < arr.length; i++) fn(arr[i], i)
}

function isArray (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}

},{"browser-split":10,"class-list":11,"data-set":13,"html-element":8}],10:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],11:[function(require,module,exports){
// contains, add, remove, toggle
var indexof = require('indexof')

module.exports = ClassList

function ClassList(elem) {
    var cl = elem.classList

    if (cl) {
        return cl
    }

    var classList = {
        add: add
        , remove: remove
        , contains: contains
        , toggle: toggle
        , toString: $toString
        , length: 0
        , item: item
    }

    return classList

    function add(token) {
        var list = getTokens()
        if (indexof(list, token) > -1) {
            return
        }
        list.push(token)
        setTokens(list)
    }

    function remove(token) {
        var list = getTokens()
            , index = indexof(list, token)

        if (index === -1) {
            return
        }

        list.splice(index, 1)
        setTokens(list)
    }

    function contains(token) {
        return indexof(getTokens(), token) > -1
    }

    function toggle(token) {
        if (contains(token)) {
            remove(token)
            return false
        } else {
            add(token)
            return true
        }
    }

    function $toString() {
        return elem.className
    }

    function item(index) {
        var tokens = getTokens()
        return tokens[index] || null
    }

    function getTokens() {
        var className = elem.className

        return filter(className.split(" "), isTruthy)
    }

    function setTokens(list) {
        var length = list.length

        elem.className = list.join(" ")
        classList.length = length

        for (var i = 0; i < list.length; i++) {
            classList[i] = list[i]
        }

        delete list[length]
    }
}

function filter (arr, fn) {
    var ret = []
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i])
    }
    return ret
}

function isTruthy(value) {
    return !!value
}

},{"indexof":12}],12:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],13:[function(require,module,exports){
var Weakmap = require("weakmap")
var Individual = require("individual")

var datasetMap = Individual("__DATA_SET_WEAKMAP", Weakmap())

module.exports = DataSet

function DataSet(elem) {
    if (elem.dataset) {
        return elem.dataset
    }

    var hash = datasetMap.get(elem)

    if (!hash) {
        hash = createHash(elem)
        datasetMap.set(elem, hash)
    }

    return hash
}

function createHash(elem) {
    var attributes = elem.attributes
    var hash = {}

    if (attributes === null || attributes === undefined) {
        return hash
    }

    for (var i = 0; i < attributes.length; i++) {
        var attr = attributes[i]

        if (attr.name.substr(0,5) !== "data-") {
            continue
        }

        hash[attr.name.substr(5)] = attr.value
    }

    return hash
}

},{"individual":14,"weakmap":16}],14:[function(require,module,exports){
var root = require("global")

module.exports = Individual

function Individual(key, value) {
    if (root[key]) {
        return root[key]
    }

    Object.defineProperty(root, key, {
        value: value
        , configurable: true
    })

    return value
}

},{"global":15}],15:[function(require,module,exports){
(function (global){
/*global window, global*/
if (typeof global !== "undefined") {
    module.exports = global
} else if (typeof window !== "undefined") {
    module.exports = window
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
/* (The MIT License)
 *
 * Copyright (c) 2012 Brandon Benvie <http://bbenvie.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the 'Software'), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included with all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Original WeakMap implementation by Gozala @ https://gist.github.com/1269991
// Updated and bugfixed by Raynos @ https://gist.github.com/1638059
// Expanded by Benvie @ https://github.com/Benvie/harmony-collections

void function(global, undefined_, undefined){
  var getProps = Object.getOwnPropertyNames,
      defProp  = Object.defineProperty,
      toSource = Function.prototype.toString,
      create   = Object.create,
      hasOwn   = Object.prototype.hasOwnProperty,
      funcName = /^\n?function\s?(\w*)?_?\(/;


  function define(object, key, value){
    if (typeof key === 'function') {
      value = key;
      key = nameOf(value).replace(/_$/, '');
    }
    return defProp(object, key, { configurable: true, writable: true, value: value });
  }

  function nameOf(func){
    return typeof func !== 'function'
          ? '' : 'name' in func
          ? func.name : toSource.call(func).match(funcName)[1];
  }

  // ############
  // ### Data ###
  // ############

  var Data = (function(){
    var dataDesc = { value: { writable: true, value: undefined } },
        datalock = 'return function(k){if(k===s)return l}',
        uids     = create(null),

        createUID = function(){
          var key = Math.random().toString(36).slice(2);
          return key in uids ? createUID() : uids[key] = key;
        },

        globalID = createUID(),

        storage = function(obj){
          if (hasOwn.call(obj, globalID))
            return obj[globalID];

          if (!Object.isExtensible(obj))
            throw new TypeError("Object must be extensible");

          var store = create(null);
          defProp(obj, globalID, { value: store });
          return store;
        };

    // common per-object storage area made visible by patching getOwnPropertyNames'
    define(Object, function getOwnPropertyNames(obj){
      var props = getProps(obj);
      if (hasOwn.call(obj, globalID))
        props.splice(props.indexOf(globalID), 1);
      return props;
    });

    function Data(){
      var puid = createUID(),
          secret = {};

      this.unlock = function(obj){
        var store = storage(obj);
        if (hasOwn.call(store, puid))
          return store[puid](secret);

        var data = create(null, dataDesc);
        defProp(store, puid, {
          value: new Function('s', 'l', datalock)(secret, data)
        });
        return data;
      }
    }

    define(Data.prototype, function get(o){ return this.unlock(o).value });
    define(Data.prototype, function set(o, v){ this.unlock(o).value = v });

    return Data;
  }());


  var WM = (function(data){
    var validate = function(key){
      if (key == null || typeof key !== 'object' && typeof key !== 'function')
        throw new TypeError("Invalid WeakMap key");
    }

    var wrap = function(collection, value){
      var store = data.unlock(collection);
      if (store.value)
        throw new TypeError("Object is already a WeakMap");
      store.value = value;
    }

    var unwrap = function(collection){
      var storage = data.unlock(collection).value;
      if (!storage)
        throw new TypeError("WeakMap is not generic");
      return storage;
    }

    var initialize = function(weakmap, iterable){
      if (iterable !== null && typeof iterable === 'object' && typeof iterable.forEach === 'function') {
        iterable.forEach(function(item, i){
          if (item instanceof Array && item.length === 2)
            set.call(weakmap, iterable[i][0], iterable[i][1]);
        });
      }
    }


    function WeakMap(iterable){
      if (this === global || this == null || this === WeakMap.prototype)
        return new WeakMap(iterable);

      wrap(this, new Data);
      initialize(this, iterable);
    }

    function get(key){
      validate(key);
      var value = unwrap(this).get(key);
      return value === undefined_ ? undefined : value;
    }

    function set(key, value){
      validate(key);
      // store a token for explicit undefined so that "has" works correctly
      unwrap(this).set(key, value === undefined ? undefined_ : value);
    }

    function has(key){
      validate(key);
      return unwrap(this).get(key) !== undefined;
    }

    function delete_(key){
      validate(key);
      var data = unwrap(this),
          had = data.get(key) !== undefined;
      data.set(key, undefined);
      return had;
    }

    function toString(){
      unwrap(this);
      return '[object WeakMap]';
    }

    try {
      var src = ('return '+delete_).replace('e_', '\\u0065'),
          del = new Function('unwrap', 'validate', src)(unwrap, validate);
    } catch (e) {
      var del = delete_;
    }

    var src = (''+Object).split('Object');
    var stringifier = function toString(){
      return src[0] + nameOf(this) + src[1];
    };

    define(stringifier, stringifier);

    var prep = { __proto__: [] } instanceof Array
      ? function(f){ f.__proto__ = stringifier }
      : function(f){ define(f, stringifier) };

    prep(WeakMap);

    [toString, get, set, has, del].forEach(function(method){
      define(WeakMap.prototype, method);
      prep(method);
    });

    return WeakMap;
  }(new Data));

  var defaultCreator = Object.create
    ? function(){ return Object.create(null) }
    : function(){ return {} };

  function createStorage(creator){
    var weakmap = new WM;
    creator || (creator = defaultCreator);

    function storage(object, value){
      if (value || arguments.length === 2) {
        weakmap.set(object, value);
      } else {
        value = weakmap.get(object);
        if (value === undefined) {
          value = creator(object);
          weakmap.set(object, value);
        }
      }
      return value;
    }

    return storage;
  }


  if (typeof module !== 'undefined') {
    module.exports = WM;
  } else if (typeof exports !== 'undefined') {
    exports.WeakMap = WM;
  } else if (!('WeakMap' in global)) {
    global.WeakMap = WM;
  }

  WM.createStorage = createStorage;
  if (global.WeakMap)
    global.WeakMap.createStorage = createStorage;
}((0, eval)('this'));

},{}],17:[function(require,module,exports){
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

		// Add the main elements of .editor-sidebar
		var editorSidebar = document.getElementsByClassName( "editor-sidebar" )[0];
		editorSidebar.appendChild(blocks.editorTabs);
		editorSidebar.appendChild(blocks.inspector);
		editorSidebar.appendChild(blocks.assets);

		// Fill in the inspector
		// TODO: discuss - have a bool to determine if values will be updated?
		var inspector = document.getElementsByClassName( "inspector" )[0];

		// Assign allPermanent its values
		htmlBlocks.allPermanent = [
			htmlBlocks.sceneTree,
			htmlBlocks.objectInfo,
			htmlBlocks.transforms,
			htmlBlocks.material
		];

		// Cycle through the permanent inspector elements and add them to inspector
		var permanentElements = htmlBlocks.allPermanent;
		var numPermanent = permanentElements.length;

		for ( var indx = 0; indx < numPermanent; indx++ ) {
			inspector.appendChild(permanentElements[indx]);

			// Add an hr after, but not after the last component
			// To better understand, see userComponents loop
			if ( indx < numPermanent - 1 ) {
				var hr = document.createElement('hr');
				inspector.appendChild(hr);
			}
		}

		// Assign userComponents its values (hard coded right now)
		htmlBlocks.userComponents = [
			htmlBlocks.sample1
		];

		// Iterate through components, adding each to the inspector
		var userComponents = htmlBlocks.userComponents;
		var numComponents = userComponents.length;

		for ( var indx = 0; indx < numComponents; indx++ ) {

			// This time add a hr above each element
			var hr = document.createElement('hr');
			inspector.appendChild(hr);

			inspector.appendChild(userComponents[indx]);

		}

		document.getElementsByClassName( "sampler" )[0].appendChild(blocks.sampler);

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

	assets: hyper( 'div.assets.collapsed' ),
	// "<div class='assets'></div>",

	sceneTree:
		hyper( 'section.scene-tree-container',

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img', { src: 'images/arrow-small.png', alt: 'Click to collapse' })
				),
				'Scene Object Tree'
			),

			hyper( 'div.collapsible',
				// Maybe not a menu, menu isn't supported by most browsers
				hyper( 'menu.scene-tree',
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

						)  // end li.obj-1
					)  // end ul

				),  // end menu.scene-tree
					
				hyper( 'div.jump-container',
					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)
				)
			)  // end div.collapsible

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

			hyper( 'div.collapsible',
				hyper( 'form',

					hyper( 'ul',

						hyper( 'li.child',
							hyper( 'label', 'Prefab:',
								hyper( 'select', {name: 'prefab'},
									hyper('option', 'None (make unique)'),
									hyper('option', 'Prefab 1'),
									hyper('option', 'Prefab 2')
								)
							)  // end label (Prefab)
						),  // end li

						hyper( 'li.child',
							hyper( 'label', 'name:',
								hyper( 'input', {name: 'name', type: 'text'}
								)
							)  // end label (name)
						),  // end li

						hyper( 'li.child',
							hyper( 'label', 'id:',
								hyper( 'input', {name: 'id', type: 'text'}
								)
							)  // end label (id)
						),  // end li

						hyper( 'li.child',
							hyper( 'label', 'foo:',
								hyper( 'input', {name: 'foo', type: 'text'}
								)
							)  // end label (foo)
						)  // end li

					)  // end ul

				),  // end form

				hyper( 'div.jump-container',
					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)
				)
			)  // end div.collapsible

		),  // end objectInfo

	// Editable transforms with buttons to activate manipulation
	// of position, rotation, and scale
	transforms:
		hyper( 'section.component.transforms',

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img',  { src: 'images/arrow-small.png',
						alt: 'Click to collapse' })
				),  // end button.collapser
				'Transforms'
			),

			hyper( 'div.collapsible',

				hyper( 'form',

					hyper( 'fieldset.position',
						hyper( 'legend', hyper('button', 'position')),

						hyper( 'ul',

							hyper( 'li.child',
								hyper( 'label', 'x:',
									// .number for alternative num manipulation
									hyper('input.x-coord.number', {name: 'x-coord', type: 'number'})
								)
							),  // end li

							hyper( 'li.child',
								hyper( 'label', 'y:',
									hyper('input.y-coord.number', {name: 'y-coord', type: 'number'})
								)
							),

							hyper( 'li.child',
								hyper( 'label', 'z:',
									hyper('input.z-coord.number', {name: 'z-coord', type: 'number'})
								)
							)

						)  // end ul

					),  // end .position

					hyper( 'fieldset.rotation',
						hyper( 'legend', hyper('button', 'rotation')),

						hyper( 'ul',

							hyper( 'li.child',
								hyper( 'label', 'x:',
									hyper('input.x-rot.number', {name: 'x-rot', type: 'number'})
								)
							),  // end li

							hyper( 'li.child',
								hyper( 'label', 'y:',
									hyper('input.y-rot.number', {name: 'y-rot', type: 'number'})
								)
							),  // end li

							hyper( 'li.child',
								hyper( 'label', 'z:',
									hyper('input.z-rot.number', {name: 'z-rot', type: 'number'})
								)
							)  // end li

						)  // end ul

					),  // end .rotation

					hyper( 'fieldset.scale',
						hyper( 'legend', hyper('button', 'scale')),

						hyper( 'ul',

							hyper( 'li.child',
								hyper( 'label', 'x:',
									// .number for alternative num manipulation
									hyper('input.x-scale.number', {name: 'x-scale', type: 'number'})
								)
							),  // end li

							hyper( 'li.child',
								hyper( 'label', 'y:',
									// .number for alternative num manipulation
									hyper('input.y-scale.number', {name: 'y-scale', type: 'number'})
								)
							),  // end li

							hyper( 'li.child',
								hyper( 'label', 'z:',
									// .number for alternative num manipulation
									hyper('input.z-scale.number', {name: 'z-scale', type: 'number'})
								)
							)  // end li

						)  // end ul

					)  // end .scale

				),  // end form

				hyper( 'div.jump-container',
					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)
				)
			)  // end div.collapsible

		)  // end .transforms
	,  // end transforms

	material:
		hyper( 'section.component.material',
			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img',  { src: 'images/arrow-small.png',
						alt: 'Click to collapse' })
				),  // end button.collapser
				'Material'
			),

			hyper ( 'div.collapsible',
				hyper( 'form',

					hyper( 'ul',

						hyper( 'li.child',
							hyper( 'label', 'var blar:',
								// .number for alternative num manipulation
								hyper('input.blar.number', {type: 'number'})
							)
						),  // end li

						hyper( 'li.child',
							'color interface'
						)  // end li

					)  // end ul

				),  // end form

				hyper( 'div.jump-container',
					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)
				)
			)  // end div.collapsible

		)  // end section.material
	,  // end material

	sample1:
		hyper( 'section.component.componentType',

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img',  { src: 'images/arrow-small.png',
						alt: 'Click to collapse' })
				),  // end button.collapser
				'Sample Component 1'
			),

			hyper( 'div.collapsible',
				hyper( 'form',

					hyper( 'ul',

						hyper( 'li.child',
							hyper( 'label', 'var num 2:',
								// .number for alternative num manipulation
								hyper('input.num1.number', {type: 'number'})
							)
						),  // end li

						hyper( 'li.child',
							hyper( 'label', 'var num 1:',
								// .number for alternative num manipulation
								hyper('input.num2.number', {type: 'number'})
							)
						)  // end li

					)  // end ul

				),  // end form

				hyper( 'div.jump-container',
					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)
				)
			)  // end div.collapsible

		)  // end .componentType
	,  // end sample1

	// 'Components' that are always present
	allPermanent: [
		// Will contain (assigned in _init_()):
		// htmlBlocks.sceneTree,
		// htmlBlocks.objectInfo,
		// htmlBlocks.transforms
		// htmlBlocks.material
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

},{"hyperscript":9}],18:[function(require,module,exports){
/* based on libraries of three.js with @author mrdoob / http://mrdoob.com/ */

module.exports = cubeWorld = function () {

	// Hack to get require working
	this.controls = null;

	var camera, scene, renderer;
	var geometry, material, mesh;

	var objects = [];

	var ray;

	init();
	animate();

	function init() {

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

		var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
		light.position.set( 1, 1, 1 );
		scene.add( light );

		var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
		light.position.set( -1, - 0.5, -1 );
		scene.add( light );

		cubeWorld.controls = new THREE.PointerLockControls( camera );
		scene.add( cubeWorld.controls.getObject() );

		ray = new THREE.Raycaster();
		ray.ray.direction.set( 0, -1, 0 );

		// floor

		geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

			var vertex = geometry.vertices[ i ];
			vertex.x += Math.random() * 20 - 10;
			vertex.y += Math.random() * 2;
			vertex.z += Math.random() * 20 - 10;

		}

		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

			var face = geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		}

		material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		// objects

		geometry = new THREE.BoxGeometry( 20, 20, 20 );

		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

			var face = geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		}

		for ( var i = 0; i < 500; i ++ ) {

			material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
			mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
			mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
			scene.add( mesh );

			material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

			objects.push( mesh );

		}

		//

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff );
		renderer.setSize( window.innerWidth, window.innerHeight );

		document.body.appendChild( renderer.domElement );

		//

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function animate() {

		requestAnimationFrame( animate );

		cubeWorld.controls.isOnObject( false );

		ray.ray.origin.copy( cubeWorld.controls.getObject().position );
		ray.ray.origin.y -= 10;

		var intersections = ray.intersectObjects( objects );

		if ( intersections.length > 0 ) {

			var distance = intersections[ 0 ].distance;

			if ( distance > 0 && distance < 10 ) {

				cubeWorld.controls.isOnObject( true );

			}

		}

		cubeWorld.controls.update();

		renderer.render( scene, camera );

	}

};

},{}]},{},[1])