/**
 * Client-side scripts for index.html
 */

'use strict';

$(function() {
	var code;

	// Handle click on execute button
	$('a.execute').click(function(e) {
		e.preventDefault();

		// Compress the new code
		code = LZString.compressToEncodedURIComponent(
			($('article.active textarea.before').val() || '') +
			$('article.active div.CodeMirror').get(0).CodeMirror.getValue() +
			($('article.active textarea.after').val() || '')
		)

		// Update the preview frame with the compressed code
		$('iframe').attr('src', 'preview.html?q=' + code);
	});

	// Setup textarea with CodeMirror
	$('textarea[data-mode]').each(function() {
		CodeMirror.fromTextArea(this, {
			lineWrapping: true,
			indentWithTabs: true,
			smartIndent: false,
			autoRefresh: true
		});
	});

	// Next button click event
	$('a.next').click(function(e) {
		e.preventDefault();

		// Update window hash for anchor
		window.location.hash = $(this)
			.parents().eq(2).removeClass('active')
			.next().addClass('active')
			.find('a.execute').click().closest('article').attr('id');
	});

	// Previous button click event
	$('a.previous').click(function(e) {
		e.preventDefault();

		// Update window hash for anchor
		window.location.hash = $(this)
			.parents().eq(2).removeClass('active')
			.prev().addClass('active')
			.find('a.execute').click().closest('article').attr('id');
	});

	// If window.location.hash not  no article with that ID use first tutorial
	if (
		!window.location.hash ||
		!$('section article' + window.location.hash).addClass('active').length
	)
		$('section article').first().addClass('active');

	// Activate the first tutorial section and disable appropiate buttons
	$('section article').first().find('a.previous').addClass('disabled');
	$('section article').last().find('a.next').addClass('disabled');

	// Execute the currently visible code on startup
	$('a.execute').first().click();

	// Pick a random ID of 5 characters
	var id = Math.random().toString(36).slice(-5);

	// Initialise the socket connection
	var socket = io.connect();

	socket.on('connect', function() {
		// Show the generated ID in the editor
		$('span.peer').text(id);

		// Send the register event with the generated ID
		socket.emit('register', id);
	});

	// Handle pull request from viewer
	socket.on('pull', function(viewer) {
		// Send the push event with the compressed code
		socket.emit('push', viewer, code);
	});
});
