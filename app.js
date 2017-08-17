/**
 * Socket.IO and Express server app
 * Handles communication between editor and viewer
 */

const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

// Logging
const morgan = require('morgan')
if (app.get('env') != 'production')
	app.use(morgan(
		'[:date[clf]] :remote-addr - :status ' +
		':method :url :res[content-length] :response-time ms'
	))

// Object of editor IDs (key) and their socket IDs (value)
const clients = {}

// Start server on port 3000
server.listen(3000, function() {
	console.log('VR server listening on http://localhost:3000')
})

// Serve static files on server
app.use(express.static('build'))
app.use(express.static('lib'))

// Handle GET requests for index and preview pages
app.get('/', (_, res) => res.sendFile(__dirname + '/build/html/index.html'))
app.get('/preview', (_, res) => res.sendFile(__dirname + '/build/html/preview.html'))

io.on('connection', socket => {
	// Add editor to clients list on register event
	socket.on('register', id => clients[id] = socket.id)

	// Pass on pull event from the viewer to the editor
	socket.on('pull', id => {
		// Lookup the socket ID of the editor
		if (id in clients) io.to(clients[id]).emit('pull', socket.id)
	})

	// Pass on push event from the editor to the viewer
	socket.on('push', (id, data) => io.to(id).emit('push', data))

	// Remove editor from clients object on disconnect
	socket.on('disconnect', () => {
		for (var id in clients)
			if (clients[id] == socket.id) delete clients[id]
	})
})
