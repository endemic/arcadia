var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('coffee', function() {
  gulp.src('src/vectr.coffee', { read: false })
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee']
    }))
    .pipe(gulp.dest('./dist'))
});