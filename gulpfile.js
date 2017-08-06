const gulp = require('gulp')
const rename = require('gulp-rename')

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')

const uglify = require('gulp-uglify')
const connect = require('gulp-connect')

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

gulp.task('build', ['sass', 'js'])
gulp.task('run', () => connect.server())

gulp.task('watch', () => {
	gulp.watch('./src/sass/*.scss', ['sass'])
	gulp.watch('./src/js/*.js', ['js'])
})

gulp.task('default', ['build', 'run'])
gulp.task('live', ['default', 'watch'])
