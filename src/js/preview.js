/**
 * Client-side scripts for preview.html
 */

'use strict';

// Create the invader component for extended functionality
//AFRAME.registerComponent('invader', {
//	tick: function() {
//		var scale = this.el.getAttribute('scale');
//		var pos = this.el.getAttribute('position');
//
//		if (scale.x == 0 && scale.y == 0 && scale.z == 0) {
//			this.el.parentNode.removeChild(this.el);
//
//			if (!document.querySelector('[invader]')) {
//				document.querySelector('a-scene').pause();
//
//				if (fullscreen)
//					alert('Congratulations! You destroyed the shapes and won.');
//
//				location.reload();
//			}
//		}
//
//		for (var i in pos)
//			if (parseFloat(pos[i]) > 1 || parseFloat(pos[i]) < -1) return false;
//
//		document.querySelector('a-scene').pause();
//
//		if (fullscreen)
//			alert('Game over! You got hit by a shape and lost, try again.');
//
//		location.reload();
//	}
//});

// Default fullscreen mode to false
var fullscreen = true;

var load = function(data) {
	// Remove any previous a-scene element
	//$('a-scene').remove();
	
	// Create the new a-scene element with decompressed code and prepend to body
//	$('<a-scene ' +
//		'wasd-controls="enabled: false" ' +
//		'vr-mode-ui="enabled: ' + fullscreen.toString() +
//	'"></a-scene')
//		.html($('<a-entity></a-entity>').html(
//			LZString.decompressFromEncodedURIComponent(data)
//		))
//		.prependTo('body');
	
	$('body').html(LZString.decompressFromEncodedURIComponent(data));
	
	// If fullscreen mode require double click before execution begins
//	if (fullscreen) {
//		var scene = document.querySelector('a-scene');
//		var entity = document.querySelector('a-entity');
//
//		scene.addEventListener('loaded', function() {
//			entity.pause();
//			scene.addEventListener('dblclick', function() { entity.play() });
//		});
//	}
};

$(function() {
	// Variable to store GET parameters in the URL
	var params = {};

	// Find all the GET parameters in the URL
	location.search.substr(1).split('&').forEach(function(param) {
		params[param.split('=')[0]] = param.split('=')[1]
	});

	// If code has been given as a parameter use this
	if ('q' in params) load(params['q'])

	// Otherwise obtain code from socket connection to editor
	else {
		// Set fullscreen to true
		fullscreen = true;

		// Ask the user for the editor ID
		var editorID = prompt('Enter the editor ID:')

		// Initialise the socket connection after asking for ID to ensure we hear the connect event
		var socket = io.connect();

		// When the socket connects to the server
		socket.on('connect', function() {
			// Send pull event with user provided editor ID
			socket.emit('pull', editorID);
		});

		// On the push event use the compressed code
		socket.on('push', load);
	}
});
