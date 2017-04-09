const gulp = require('gulp')
const rename = require('gulp-rename')

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')

const uglify = require('gulp-uglify')

gulp.task('sass', function() {
	return gulp.src('./src/sass/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(autoprefixer())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./lib/css'))
})

gulp.task('js', function() {
	return gulp.src('./src/js/*.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./lib/js'))
})

gulp.task('default', ['sass', 'js'])
