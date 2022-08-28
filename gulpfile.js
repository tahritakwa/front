var gulp = require('gulp');
var bump = require('gulp-bump');
var runSequence = require('run-sequence');

//Bumping version
function incrementVersion(importance) {
  // get all the files to bump version in
  var base = gulp.src(['./JenkinsEnv.groovy','./package.json'])
  // bump the version number in those files
    .pipe(bump({type: importance}))
    // save it back to filesystem
    .pipe(gulp.dest('./'))
    return base;
}
gulp.task('patch', function() { return incrementVersion('patch'); })
gulp.task('feature', function() { return incrementVersion('minor'); })
gulp.task('release', function() { return incrementVersion('major'); })
