//Обрабатывем DragEndDrops
var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();
// Читаем разметку и сохраняем форму
var $form = $('#upload');
var $input = $('#file');
var $save = $('#save');

// Если чтото закинули добавляем класс
if (isAdvancedUpload) {

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
      droppedFiles = e.originalEvent.dataTransfer.files;
      $form.trigger('submit');
    });

  $input.on('change', function(e) { // drag & drop НЕ поддерживается
    $form.trigger('submit');
  });

  /////////////////


}



// Ручная отправка
$form.on('submit', function(e) {
  if ($form.hasClass('is-uploading')) return false;

  //alert('Отправляем');

  $form.addClass('is-uploading').removeClass('is-error');

  if (isAdvancedUpload) {
    e.preventDefault();



    var photos = $input[0].files;

    async.each(photos, function(photo, callback) {

      var ajaxData = new FormData();
      ajaxData.append("photo", photo);

      $.ajax({
        url: location.href + '/addImg/',
        type: $form.attr('method'),
        data: ajaxData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {

            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);

              console.log(percentComplete);

              // update the Bootstrap progress bar with the new percentage
              //$('.progress-bar').text(percentComplete + '%');
              //$('.progress-bar').width(percentComplete + '%');

              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                //$('.progress-bar').html('Done');
              }

            }

          }, false);

          return xhr;
        },
        complete: function(ans) {
          $form.removeClass('is-uploading');
          console.log(ans.responseText);



          //socket.emit('eventServer', {data: 'Hello Server'});
        },
        success: function(data) {

          $form.addClass( data.success == true ? 'is-success' : 'is-error' );

          callback('upload');

          if (!data.success) $errorMsg.text(data.error);
        },
        error: function() {
          // Log the error, show an alert, whatever works for you
        }
      });

    });

    // $.each( photos, function( key, photo ) {
    //   var ajaxData = new FormData();
    //   ajaxData.append("photo", photo);
    //
    //   $.ajax({
    //     url: location.href + '/addImg/',
    //     type: $form.attr('method'),
    //     data: ajaxData,
    //     dataType: 'json',
    //     cache: false,
    //     contentType: false,
    //     processData: false,
    //     complete: function(ans) {
    //       $form.removeClass('is-uploading');
    //       console.log(ans.responseText);
    //
    //
    //
    //       //socket.emit('eventServer', {data: 'Hello Server'});
    //     },
    //     success: function(data) {
    //
    //       $form.addClass( data.success == true ? 'is-success' : 'is-error' );
    //
    //       if (!data.success) $errorMsg.text(data.error);
    //     },
    //     error: function() {
    //       // Log the error, show an alert, whatever works for you
    //     }
    //   });
    //
    // });

    if (droppedFiles) {
      $.each( droppedFiles, function(i, file) {

        console.log($input.attr('name'));

        ajaxData.append( $input.attr('name'), file );

      });
    }

    //console.log(ajaxData);



    console.log($form.attr('action'));

  } else {

    var iframeName  = 'uploadiframe' + new Date().getTime();
    $iframe   = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

    $('body').append($iframe);
    $form.attr('target', iframeName);

    $iframe.one('load', function() {
      var data = JSON.parse($iframe.contents().find('body' ).text());
      $form
        .removeClass('is-uploading')
        .addClass(data.success == true ? 'is-success' : 'is-error')
        .removeAttr('target');
      if (!data.success) $errorMsg.text(data.error);
      $form.removeAttr('target');
      $iframe.remove();
    });
  }
});

$save.on('click', function () {

  $.ajax({
    type: "POST",
    url: location.href + '/saveImg/',
    data: 'ok',
    cache: false,
    contentType: false,
    processData: false,
    success: function(data) {
      $form.addClass( data.success == true ? 'is-success' : 'is-error' );
      if (!data.success) $errorMsg.text(data.error);
    },
    error: function() {
      // Log the error, show an alert, whatever works for you
    }
  });

});