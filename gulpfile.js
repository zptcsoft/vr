const gulp = require('gulp')
const rename = require('gulp-rename')

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')

const uglify = require('gulp-uglify')
const connect = require('gulp-connect')

const yaml = require('js-yaml')
const fs = require('fs')

const gulpHandlebars = require('gulp-handlebars-html')(require('handlebars'))

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

gulp.task('handlebars', () => {
	try {
  	var doc = yaml.safeLoad(fs.readFileSync('./src/tutorials/1-getting-started.yaml', 'utf8'));
  	console.log(doc);
	} catch (e) {
  	console.log(e);
	}

	return gulp.src('./src/views/*.handlebars')
		.pipe(gulpHandlebars({ tutorials: [doc] }, { }))
		.pipe(rename('hello.html'))
		.pipe(gulp.dest('./'));
})

gulp.task('build', ['sass', 'js', 'handlebars'])
gulp.task('run', () => connect.server())

gulp.task('watch', () => {
	gulp.watch('./src/sass/*.scss', ['sass'])
	gulp.watch('./src/js/*.js', ['js'])
	gulp.watch('./src/views/*.handlebars', ['handlebars'])
	gulp.watch('./src/tutorials/*.yaml', ['handlebars'])
})

gulp.task('default', ['build', 'run'])
gulp.task('live', ['default', 'watch'])
