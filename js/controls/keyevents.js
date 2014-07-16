/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/


keyEvents = function () {

	document.addEventListener('keyup', function () {
		
		/* ===================================
		   RUNNING TESTS
		   ==================================== */

		var keyCode = ('which' in event) ? event.which : event.keyCode;

		// 't'
		if (keyCode === 84) {

			runTests();

		}

	});

};
