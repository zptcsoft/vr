const gulp = require('gulp')
const rename = require('gulp-rename')

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')

const uglify = require('gulp-uglify')
const connect = require('gulp-connect')

const fs = require('fs')
const glob = require('glob')

const yaml = require('js-yaml')
const handlebars = require('gulp-hb')

gulp.task('sass', () => {
	return gulp.src('./src/sass/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(autoprefixer())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./css'))
})

gulp.task('js', () => {
	return gulp.src('./src/js/*.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./js'))
})

gulp.task('handlebars', callback => {
	// Files are automatically sorted so the tutorials will be ordered correctly
	glob('./src/tutorials/*.yaml', {}, function (e, files) {
		if (e) console.error('Error with glob: ' + e)
		tutorials = []

		for (i in files) {
			try { tutorials.push(yaml.safeLoad(fs.readFileSync(files[i], 'utf8'))) }
			catch (e) { console.error('Error loading ' + files[i] + ': ' + e) }
		}

		gulp.src('./src/views/*.handlebars')
			.pipe(handlebars({ data: { tutorials },
				helpers: './src/views/helpers/*' }))
			.pipe(rename({ extname: '.html' }))
			.pipe(gulp.dest('.'))
			.on('end', callback)
	})
})

gulp.task('build', ['sass', 'js', 'handlebars'])
gulp.task('run', () => connect.server())

gulp.task('watch', () => {
	gulp.watch('./src/sass/*.scss', ['sass'])
	gulp.watch('./src/js/*.js', ['js'])
	gulp.watch(['./src/views/*.handlebars',
		'./src/tutorials/*.yaml',
		'./src/views/helpers/*.js'], ['handlebars'])
})

gulp.task('default', ['build', 'run'])
gulp.task('live', ['default', 'watch'])
