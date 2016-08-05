const gulp = require('gulp');
const minify = require('gulp-minify');
const babel = require('gulp-babel');
const scss = require("gulp-scss");
const path = require('path');
const removeUseStrict = require("gulp-remove-use-strict");
gulp.task('js', function () {
	gulp.src('app/public/scripts/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(minify(
			{
				ext: {
					src: '-debug.js',
					min: '.js'
				},
				mangle:{except : ['$', 'require', 'exports']}
			}
		))

		.pipe(gulp.dest('app/public/build/js'));
});

gulp.task("scss", function () {
	gulp.src(
		"app/public/styles/**/*.scss"
	)
		.pipe(scss())
		.pipe(gulp.dest("app/public/build/css"));
});


gulp.task('dev', ['js', 'scss'], function () {
	//前端
	gulp.watch(
		['app/public/scripts/**/*.js', 'app/public/styles/**/*.scss'],
		['js', 'scss']
	);
});
