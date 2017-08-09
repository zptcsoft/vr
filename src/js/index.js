$(function() {
	$('a.execute').click(function(e) {
		e.preventDefault();

		$('iframe').attr(
			'src', 'preview.html?q=' + LZString.compressToEncodedURIComponent(
				($('article.active textarea.before').val() || '') +
				$('article.active div.CodeMirror').get(0).CodeMirror.getValue() +
				($('article.active textarea.after').val() || '')
			)
		);
	});

	$('textarea[data-mode]').each(function() {
		CodeMirror.fromTextArea(this, {
			lineWrapping: true,
			indentWithTabs: true,
			smartIndent: false,
			autoRefresh: true
		});
	});

	$('a.next').click(function(e) {
		e.preventDefault();

		$(this)
			.parents().eq(2).removeClass('active')
			.next().addClass('active').find('a.execute').click();
	});

	$('a.previous').click(function(e) {
		e.preventDefault();

		$(this)
			.parents().eq(2).removeClass('active')
			.prev().addClass('active').find('a.execute').click();
	});

	// Activate the first tutorial section and disable appropiate buttons for first and last element
	$('section article').first().addClass('active').find('a.previous').addClass('disabled');
	$('section article').last().find('a.next').addClass('disabled');

	$('a.execute').first().click();

	var peer = new Peer(Math.random().toString(36).slice(-5), { key: '9a5ls6yq7ann4s4i' });

	peer.on('open', function(id) {
		$('span.peer').text(id);
	});

	peer.on('connection', function(conn) {
		conn.on('open', function() {
			conn.send(LZString.compressToEncodedURIComponent(
				($('article.active textarea.before').val() || '') +
				$('article.active div.CodeMirror').get(0).CodeMirror.getValue() +
				($('article.active textarea.after').val() || '')
			))
		});
	});
});
