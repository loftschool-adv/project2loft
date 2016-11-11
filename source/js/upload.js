//Обрабатывем DragEndDrops
var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();
// Объявление библиотеки
  var base = new BaseModule;
// Читаем разметку и сохраняем форму
var $form = $('#upload');
var $input = $('#file');
var $save = $('#save');
var $closeUploaderImg = $('.modal__close-img');
var simpleUpload = false;

// Если чтото закинули добавляем класс
if (isAdvancedUpload) {

  var tmpFiles = false;
  var droppedFiles = false;

  $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
    .on('dragover dragenter', function() {
      $form.addClass('is-dragover');
    })
    .on('dragleave dragend drop', function() {
      $form.removeClass('is-dragover');
    })
    .on('drop', function(e) {
      simpleUpload = false;
      droppedFiles = [];
      tmpFiles = e.originalEvent.dataTransfer.files;
      console.log(tmpFiles);

      for (var i = 0; i < tmpFiles.length; i++) {
        console.log(tmpFiles[i].type);
        droppedFiles.push(tmpFiles[i]);
      }

      $form.trigger('submit');
    });

  $input.on('change', function(e) { // drag & drop НЕ поддерживается
    simpleUpload = true;
    $form.trigger('submit');
  });

  /////////////////


}



// Ручная отправка
$form.on('submit', function(e) {
  if ($form.hasClass('is-uploading')) return false;
  $form.addClass('is-uploading').removeClass('is-error');

  if (isAdvancedUpload) {
    e.preventDefault();

    if (simpleUpload) {
      var photos = $input[0].files;

      ajaxUploadImg(photos);
    }


    if (droppedFiles) {
      ajaxUploadImg(droppedFiles);
    }

  }
});

$save.on('click', function (e) {
  e.preventDefault();
  //закрыли большое окно
  $('.modal_add-photo .modal__header-close').click();

  // открыли маленькое
  base.changeClass('.modal-overlay, .modal_notification ','hide','del');

  $.ajax({
    type: "POST",
    url: location.href + 'saveImg/',
    data: 'ok',
    cache: false,
    contentType: false,
    processData: false,
    success: function(data) {

      //$('li .preload__container').removeClass('active');
    },
    error: function() {
      // Log the error, show an alert, whatever works for you
    }
  });
    
});

$closeUploaderImg.on('click', function () {

  $.ajax({
    type: "POST",
    url: location.href + 'closeUploaderImg/',
    data: 'ok',
    cache: false,
    contentType: false,
    processData: false,
    success: function(data) {
      droppedFiles = false;
    },
    error: function() {
      // Log the error, show an alert, whatever works for you
    }
  });

});

function ajaxUploadImg(photos) {
  async.eachSeries(photos, function(photo, callbackEach) {

    $('.modal__load-img').hide();
    var li = $('<li/>').addClass('img-item').appendTo($('ul#img-list'));
    var ImgCont = $('<div/>').addClass('img-cont').appendTo(li);
    var preCont = $('<div/>').addClass('preload__container').appendTo(ImgCont);
    var preLoad = $('<div/>').addClass('preload__loading').appendTo(preCont);
    var i = 0;
    while (i < 3){ 
      var preItem = $('<i/>').appendTo(preLoad);
      i++;
    }
    preCont.addClass('active');
    var ajaxData = new FormData();
    ajaxData.append("photo", photo);

    $.ajax({
      url: location.href + 'addImg/',
      type: $form.attr('method'),
      data: ajaxData,
      dataType: 'json',
      cache: false,
      contentType: false,
      processData: false,
      complete: function(data) {
        $form.removeClass('is-uploading');

        ////////////////////////////////////////////
        ////////////////////////////////////////////
        var src = data.responseText;
        src =String(src).replace(/\\/g, "/");
        src = src.substr(6);
        console.log(src);

        var image =$('<img>', {
          src: '/'+src});
        
        // Когда картинка загрузится, ставим её на фон
        image.on("load", function(){
          ImgCont.css('background-image', 'url("/'+src+'")');
          preCont.removeClass('active');

        });

        ///////////////////////////////////////////
        ////////////////////////////////////////////

        callbackEach();

        //socket.emit('eventServer', {data: 'Hello Server'});
      },
      success: function(data) {

        $form.addClass( data.success == true ? 'is-success' : 'is-error' );

        if (!data.success) $errorMsg.text(data.error);
      },
      error: function() {
        // Log the error, show an alert, whatever works for you
      }
    });

  });
}