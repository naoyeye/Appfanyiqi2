var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var prefixer = require('gulp-autoprefixer');

gulp.task('scss-watch', function() {
	gulp.src('./scss/app.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(prefixer({browsers: ['> 0%']}))
		.pipe(concat('combined.css'))
		.pipe(gulp.dest('./build'));
});

gulp.task('scss-build', function() {
	gulp.src('./scss/app.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(prefixer({browsers: ['> 0%']}))
		.pipe(concat('combined.css'))
		.pipe(gulp.dest('./build'));
});

gulp.task('scripts', function() {
	gulp.src('js/**/*.js')
		.pipe(concat('combined.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build'));
});

gulp.task('default', function() {
	gulp.watch('./scss/*.scss', ['scss-watch']);
	gulp.watch('./js/*.js', ['scripts']);
});

gulp.task('build', ['scss-build','scripts']);
