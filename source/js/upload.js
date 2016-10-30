// Стандарный input для файлов
var fileInput = $('#file-field');

// ul-список, содержащий миниатюрки выбранных файлов
var imgList = $('ul#img-list');

// Контейнер, куда можно помещать файлы методом drag and drop
var dropBox = $('#img-container');

// Обработка события выбора файлов в стандартном поле
fileInput.bind({
  change: function() {
    displayFiles(this.files);
  }
});

// Обработка событий drag and drop при перетаскивании файлов на элемент dropBox
dropBox.bind({
  dragenter: function() {
    $(this).addClass('highlighted');
    return false;
  },
  dragover: function() {
    return false;
  },
  dragleave: function() {
    $(this).removeClass('highlighted');
    return false;
  },
  drop: function(e) {
    var dt = e.originalEvent.dataTransfer;
    displayFiles(dt.files);
    return false;
  }
});

// Обновление progress bar'а
function updateProgress(bar, value) {
  var width = bar.width();
  var bgrValue = -width + (value * (width / 100));
  bar.attr('rel', value).css('background-position', bgrValue+'px center').text(value+'%');
}


  function displayFiles(files) {
  $.each(files, function(i, file) {
    if (!file.type.match(/image.*/)) {
      // Отсеиваем не картинки
      return true;
    }
    // Создаем элемент li и помещаем в него название, миниатюру и progress bar,
    // а также создаем ему свойство file, куда помещаем объект File (при загрузке понадобится)
    var li = $('<li/>').appendTo(imgList);
    $('<div/>').text(file.name).appendTo(li);
    var img = $('<img/>').appendTo(li);
    $('<div/>').addClass('progress').text('0%').appendTo(li);
    li.get(0).file = file;

    // Создаем объект FileReader и по завершении чтения файла, отображаем миниатюру и обновляем
    // инфу обо всех файлах
    var reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.attr('src', e.target.result);
        aImg.attr('width', 100);
        /* ... обновляем инфу о выбранных файлах ... */
      };
    })(img);

    reader.readAsDataURL(file);
  });
}

// Обаботка события нажатия на кнопку "Загрузить". Проходим по всем миниатюрам из списка,
// читаем у каждой свойство file (добавленное при создании) и начинаем загрузку, создавая
// экземпляры объекта uploaderObject. По мере загрузки, обновляем показания progress bar,
// через обработчик onprogress, по завершении выводим информацию
$("#upload").click(function() {

  imgList.find('li').each(function() {

    var uploadItem = this;
    var pBar = $(uploadItem).find('.progress');
    console.log('Начинаем загрузку `'+uploadItem.file.name+'`...');

    new uploaderObject({
      file:       uploadItem.file,
      url:        '/upload/',
      fieldName:  'my-pic',

      onprogress: function(percents) {
        updateProgress(pBar, percents);
      },

      oncomplete: function(done, data) {
        if(done) {
          updateProgress(pBar, 100);
          console.log('Файл `'+uploadItem.file.name+'` загружен, полученные данные:<br/>*****<br/>'+data+'<br/>*****');
          console.log(uploadItem.file)
        } else {
          console.log('Ошибка при загрузке файла `'+uploadItem.file.name+'`:<br/>'+this.lastError.text);
        }
      }
    });
  });
});


// Проверка поддержки File API в браузере
if(window.FileReader == null) {
  log('Ваш браузер не поддерживает File API!');
}