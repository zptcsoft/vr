'use strict';

var fullscreen = false;

var load = function(data) {
	$('<a-scene ' +
		'wasd-controls="enabled: false" ' +
		'vr-mode-ui="enabled: ' + fullscreen.toString() +
	'"></a-scene')
		.html($('<a-entity></a-entity>').html(
			LZString.decompressFromEncodedURIComponent(data)
		))
		.prependTo('body');

	if (fullscreen) {
		var scene = document.querySelector('a-scene');
		var entity = document.querySelector('a-entity');

		scene.addEventListener('loaded', function() {
			entity.pause();
			scene.addEventListener('dblclick', function() { entity.play() });
		});
	}
};

AFRAME.registerComponent('invader', {
	tick: function() {
		var scale = this.el.getAttribute('scale');
		var pos = this.el.getAttribute('position');

		if (scale.x == 0 && scale.y == 0 && scale.z == 0) {
			this.el.parentNode.removeChild(this.el);

			if (!document.querySelector('[invader]')) {
				document.querySelector('a-scene').pause();

				if (fullscreen)
					alert('Congratulations! You destroyed the shapes and won.');

				location.reload();
			}
		}

		for (var i in pos)
			if (parseFloat(pos[i]) > 1 || parseFloat(pos[i]) < -1) return false;

		document.querySelector('a-scene').pause();

		if (fullscreen)
			alert('Game over! You got hit by a shape and lost, try again.');

		location.reload();
	}
});

$(function() {
	var params = {};

	location.search.substr(1).split('&').forEach(function(param) {
		params[param.split('=')[0]] = param.split('=')[1]
	});

	if ('q' in params) load(params['q'])

	else {
		var peer = new Peer({ key: '9a5ls6yq7ann4s4i' });
		fullscreen = true;

		peer.on('open', function() {
			var conn = peer.connect(prompt('Enter the editor ID...'));

			conn.on('open', function() {
				conn.on('data', function(data) { load(data) });
			});
		});
	}
});
