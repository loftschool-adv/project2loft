'use strict';

module.exports = function() {
  $.gulp.task('copy:fonts', function() {
    return $.gulp.src('./source/fonts/**/*')
      .pipe($.gulp.dest($.config.root + '/fonts'))
  })
};
