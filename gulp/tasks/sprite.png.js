'use strict';

module.exports = function() {
  $.gulp.task('sprite:png', function() {

  	var spriteData = $.gulp.src('./source/images/icons/*.{png,gif}').pipe($.gp.spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    imgPath: '../img/sprite/sprite.png',
    padding: 10,
    algorithm: 'left-right'
  }));

  	spriteData.img
    	.pipe($.gulp.dest($.config.root + '/assets/img/sprite'));
    
    spriteData.css
      .pipe($.gulp.dest('./source/style/common'));

    return spriteData;
  })
};