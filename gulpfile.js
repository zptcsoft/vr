/**
 * Gulpfile to handle build automation
 */

const gulp = require('gulp')
const rename = require('gulp-rename')

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const uglify = require('gulp-uglify')

const fs = require('fs')
const glob = require('glob')

const yaml = require('js-yaml')
const handlebars = require('gulp-hb')

// Compile SASS files into CSS
// Also autoprefix, compress and add .min extension
gulp.task('sass', () => {
	return gulp.src('./src/sass/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(autoprefixer())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./build/css'))
})

// Minimise JS files and add .min extension
gulp.task('js', () => {
	return gulp.src('./src/js/*.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./build/js'))
})

// Compile handlebars files into html using YAML data
gulp.task('handlebars', callback => {
	// Find all YAML files and parse their data
	// Files are automatically sorted so the tutorials will be ordered correctly
	glob('./src/tutorials/*.yml', {}, function (e, files) {
		if (e) console.error('Error with glob: ' + e)
		tutorials = []

		for (i in files) {
			try { tutorials.push(yaml.safeLoad(fs.readFileSync(files[i], 'utf8'))) }
			catch (e) { console.error('Error loading ' + files[i] + ': ' + e) }
		}

		gulp.src('./src/views/*.handlebars')
			.pipe(handlebars({
				data: { tutorials },
				helpers: './src/views/helpers/*'
			}))
			.pipe(rename({ extname: '.html' }))
			.pipe(gulp.dest('./build/'))
			.on('end', callback)
	})
})

// For live mode, watch for updates
gulp.task('watch', () => {
	gulp.watch('./src/sass/*.scss', ['sass'])
	gulp.watch('./src/js/*.js', ['js'])
	gulp.watch([
		'./src/views/*.handlebars',
		'./src/views/helpers/*.js',
		'./src/tutorials/*.yml'
	], ['handlebars'])
})

gulp.task('default', ['sass', 'js', 'handlebars'])
gulp.task('live', ['default', 'watch'])
