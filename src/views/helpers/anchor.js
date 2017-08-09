module.exports = {
	'anchor': (title, id) => title.replace(/\s/g, '-').toLowerCase() + '-' + (id + 1)
}
