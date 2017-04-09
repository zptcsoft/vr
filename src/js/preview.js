AFRAME.registerComponent('invader', {
	tick: function () {
		var scale = this.el.getAttribute('scale');
		var pos = this.el.getAttribute('position');

		if (scale.x == 0 && scale.y == 0 && scale.z == 0) {
			this.el.parentNode.removeChild(this.el);

			if (!document.querySelector('[invader]')) {
				document.querySelector('a-scene').pause();

				alert('Congratulations! You destroyed the invaders and won.');
				location.reload();
			}
		}

		for (var k in pos) {
			if (parseFloat(pos[k]) > 1 || parseFloat(pos[k]) < -1) return false;
		}

		document.querySelector('a-scene').pause();

		alert('Game over! You got hit by a shape and lost, try again.');
		location.reload();
	}
});

$(function() {
	var params = {};

	location.search.substr(1).split('&').forEach(function(param) {
		params[param.split('=')[0]] = param.split('=')[1]
	});

	$('<a-scene ' +
		'wasd-controls="enabled: false" ' +
		'vr-mode-ui="enabled: ' + ('v' in params).toString() +
	'"></a-scene')
		.html(LZString.decompressFromEncodedURIComponent(params['q'] || ''))
		.prependTo('body');
});
