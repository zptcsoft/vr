/**
 * Socket.IO and Express server app
 * Handles communication between editor and viewer
 */

const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const morgan = require('morgan')

// Enable request logging in production mode
if (app.get('env') != 'production')
	app.use(morgan(
		'[:date[clf]] :remote-addr - :status ' +
		':method :url :res[content-length] :response-time ms'
	))

// Start server on port 3000
server.listen(3000, 'localhost', () => console.log(
	'VR server listening on http://%s:%s',
	server.address().address,
	server.address().port
))

// Serve static files on server
app.use(express.static('build'))
app.use(express.static('lib'))

// Handle GET requests for index and preview pages
app.get('/', (_, res) => res.sendFile(__dirname + '/build/html/index.html'))
app.get('/preview', (_, res) => res.sendFile(__dirname + '/build/html/preview.html'))

io.on('connection', socket => {
	// Register editor and get it to join the room with it's editor ID
	socket.on('register', id => socket.join(id))

	// Pass on pull event from the viewer to the editor
	socket.on('pull', id => {
		io.to(id).emit('pull', socket.id)
		// Join the room with the ID of the editor it is trying to listen to
		socket.join(id)
	})

	// Pass on push event from the editor to the viewer
	socket.on('push', (id, data) => io.to(id).emit('push', data))
})
