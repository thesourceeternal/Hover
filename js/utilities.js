/* 
* Calculating element info (may expand to other functionality)
*/

var util = {

	// Get all the siblings of the element 'element'
	getSiblings: function (element) {

		var sibList = [];

		// Until there are no elements left
		while (element) {

			var newSib = element.nextSibling;
			sibList.push(newSib)

			// Prepare for the next loop iteration
			element = newSib;

		}

		return sibList;

	},

}
