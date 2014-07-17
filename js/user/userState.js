/*
* User variables that need to be stored and accessed
*/

userState = {

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
			test: ["test", "t", 84],

		},  // end hotkeys{}

		flying: true,

	},  // end preferences{}

}

