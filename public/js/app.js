// =========== Base module ===========

var BaseModule = function(){

	//====== Объекты,массивы ======
	this.errors = {
  	0 : 'Заполнены не все поля',
  	1 : 'Введите корректный e-mail',
  	2	: 'Длина пароля меньше 8 символов',
  	3 : 'Выберите обложку'
  };

  this.RegPatterns = {
  	email : /^([0-9a-zA-Z_-]+\.)*[0-9a-zA-Z_-]+@[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)*\.[a-z]{2,6}$/,
  };

  this.global = {};




  //====== Функции ======


	this.ajaxData = function(form,_type){
		var elem = form.find('input[type != submit],textarea');
		var data = {};
		$.each(elem, function(){
				data[$(this).attr('name')] = $(this).val();
		})
		var format = _type || JSON.stringify(data)
		return format;
	};

	this.ajax = function(form, url, _method){
			var method = _method || 'POST';
			var data = this.ajaxData(form);
			return $.ajax({
				url: url,
				type: method,
				contentType: 'application/json',
				data: data
			});
	}

	this.ajaxDataObj = function(obj,url,method){
		method = method || 'POST'
		var data = JSON.stringify(obj);
		return $.ajax({
			url: url,
			type: method,
			contentType: 'application/json',
			data: data
		});
	}

	this.showError = function(errorIndex,elem,_ms){
		var thisFrom = elem.closest('form');
		var time = _ms || 2000;
		if(typeof(errorIndex) == 'string'){
			elem.text(errorIndex)
		}else{
			elem.text(this.errors[errorIndex]);
		}
		if(thisFrom.find(elem).is(':visible')){
			clearTimeout(this.global.timer);
			this.global.timer = setTimeout(function(){
				elem.text();
				elem.removeClass('show').addClass('hide');
			}, time);
			return;
		}

		
		elem.removeClass('hide').addClass('show');


		this.global.timer = setTimeout(function(){
			elem.text();
			elem.removeClass('show').addClass('hide');
		}, time);

	}

	this.hideError = function(elem){
		elem.removeClass('show').addClass('hide');
	}

	this.validEmail = function(input, patter){
		return patter.test(input.val());
	};

	this.validPass = function(input,length){
		var len = length || 8;
		if(!(input.val().length < len)){
			return true;
		}
	};

	this.validFiles = function(input,length){
		var len = length || 0;
		if(!(input[0].files.length <= len)){
			return true;
		};
	}
	
	this.validateForm = function(form) {
		var thisModule = this;
		var pattern = thisModule.RegPatterns.email;
		var $thisForm = form;
		var elements = $thisForm.find('textarea,input:not(input[type="submit"])');
		var errors = thisModule.errors;
		var output = [];

		$.each(elements, function(){
			if(!$(this).val() && $(this).attr('type') != 'file'){
					output[0] = 0;
			}
		});

		if(output.length == 0){
			$.each(elements, function(){
				var $this = $(this);
				var type = $this.attr('type');
				var nameAttr = $this.attr('name');
				switch(type){
					case 'password' :
						if(!thisModule.validPass($this)){
							output.push(2);
						}
						break;
					case 'email' :
						if(!thisModule.validEmail($this,pattern)){
							output.push(1);
						}
						break;
				};
				switch(nameAttr){
					case 'addAlbumCover' :
						if(!thisModule.validFiles($this)){
							output.push(3);
						}
						break;
				};
			})
		};

		return output;
	};

	this.clearInputs = function(form){
		var elem = form.find('input[type != submit],textarea');
		elem.val('');
	}

	this.scrollToPosition = function(position, duration){
  	var position = position || 0;
		var duration = duration || 1000;


		$("body, html").animate({
				scrollTop: position
		}, duration)
  };

  this.changeClass = function(parent,className,type){
  	if(typeof(parent) == 'string'){
  		var parent = $(parent);
  	}
  	switch(type){
  		case 'add':
  			parent.addClass(className);
  			break;
  		case 'del':
  			parent.removeClass(className);
  			break;

  	}
  };

	

}
// =========== Common module ===========
// Этот модуль содержит в себе общие скрипты, присущие всем страницам сайта.

var commonModule = (function() {

	// Объявление библиотеки
  var base = new BaseModule;



// Прокрутить страницу до ...
	var scrollTo = function(e){
		e.preventDefault();

		var btn        = $(this);
		var target     = btn.attr('data-go');
		var container  = null;

		if (target == 'top') {
			base.scrollToPosition();
		}
	}


// Сворачивание блока с комментариями
	var commentsToggle = function(e){
		e.preventDefault();

		var btn       = $(this);
		var container = btn.closest('.comments');
		var comments  = container.find('.comments__list');

		if(container.hasClass('comments--show')) {
			container.removeClass('comments--show');
			comments.slideUp();
		} else {
			container.addClass('comments--show');
			comments.slideDown();
		}
	}


	// drop - элемент с выпадающим блоком
	var addDrop = function(e) {
		e.preventDefault();

		var trigger     = $(this);
		var container   = trigger.closest('.drop');
		var content     = container.find('.drop__main');
		var classActive = 'drop--open';

		if(container.hasClass('drop--hover')) return;

		container.toggleClass( classActive );
	};


	// Кастомный вид для загрузки файлов
	// Пожалуйста, исправьте эту функцию, не понятно где она используеться и нужно вытащить on click в _setUplistner
	var fileUpload = function(){
		var el = $('.upload');

		if(el.length === 0) return;

		$(document).on('click', '.upload', function(e) {
			var el    = $(this);
			var input = el.children('[type=file]');

			input[0].click();
		});
	}


	// Разлогин пользователя
	// Нужно доработать
	var logoutUser = function(){
		var obj = {
			req: "logout"
		}
		var data = JSON.stringify(obj);

			var xhr = new XMLHttpRequest;
			var id = window.location.pathname;
			xhr.open('POST', id + 'logout/',true);
			xhr.setRequestHeader('Content-type','application/json');
			xhr.send(data);
			xhr.onreadystatechange = function() {
				if (xhr.readyState != 4) return;
				// Перезагрузка страницы
				if(JSON.parse(xhr.responseText).status == "logout"){
					//window.location.reload(true);
					var site = window.location.protocol+ '//' + window.location.host + '/';
					console.log(window.location.pathname);
					window.location.href = site;
				}
			}
}

	var editUserData = function(){
		console.log(12);
	}



	// Прослушка
	var _setUpListners = function() {
			$(document).on('click', '.comments__toggle' , commentsToggle);
			$(document).on('click', '[data-go]' , scrollTo);
			$(document).on('click', '.drop__trigger', addDrop);
			$('.logout').on('click', logoutUser)
	};




  return {
    init: function () {
    	_setUpListners();
    }

  };
})();
// =========== Login module ===========
// Этот модуль содержит в себе все что связанно с формой авторизации и регистрации.


var loginModule = (function() {

	// Глобальные переменные модуля.
  var base = new BaseModule;
  
  var toSendRequest = function(){
  	var $form = $('.popup__form');
  	var $formLogin = $form.filter('.popup__form-login');
  	var $formReg = $form.filter('.popup__form-registration');
  	var $formRecover = $form.filter('.popup__form-recover');
  	var button = 'input[type = submit]';
  	var popupTime = 5000;

  	// Отправляем ajax на login
  	$formLogin.find(button).on('click', function(e){
  		e.preventDefault();
	  		var $thisForm = $(this).closest('form');
	  		// Параметры для popup
	  		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
	  		var $errorContainer = $thisForm.find('.popup__error');
	  		if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
	  			errorArray.forEach(function(index){
	  				base.showError(index,$errorContainer, popupTime);
	  			});
	  		}else{ // Если массив пустой, выполняем дальше
	  			servAns = base.ajax($thisForm,'/login/');
	  			servAns.done(function(ans){
	  				if(!ans.status){
	  					base.showError(ans.message,$errorContainer, popupTime);
	  				}else{
	  					window.location.reload(true);
	  				}
	  			});
	  		}
  		
  	})

  	// Отправляем ajax на reg
  	$formReg.find(button).on('click', function(e){
  		e.preventDefault();
	  		var $thisForm = $(this).closest('form');
	  		// Параметры для popup
	  		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
	  		var $errorContainer = $thisForm.find('.popup__error');
	  		if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
	  			errorArray.forEach(function(index){
	  				base.showError(index,$errorContainer, popupTime);
	  			});
	  		}else{ // Если массив пустой, выполняем дальше
	  			servAns = base.ajax($thisForm,'/reg/');
	  			servAns.done(function(ans){
	  				if(!ans.status){
	  					base.showError(ans.message,$errorContainer, popupTime);
	  				}else{
	  					window.location.reload(true);
	  				}
	  			});
	  		}
  		
  	})

  	// Отправляем ajax на recover

  	$formRecover.find(button).on('click', function(e){
  		e.preventDefault();
	  		var $thisForm = $(this).closest('form');
	  		// Параметры для popup
	  		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
	  		var $errorContainer = $thisForm.find('.popup__error');
	  		if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
	  			errorArray.forEach(function(index){
	  				base.showError(index,$errorContainer, popupTime);
	  			});
	  		}else{ // Если массив пустой, выполняем дальше
	  			servAns = base.ajax($thisForm,'/recover/');
	  			servAns.done(function(ans){
	  				if(!ans.status){
	  					return base.showError(ans.message,$errorContainer, popupTime);
	  				}else{
	  					base.clearInputs($thisForm);
	  					return base.showError(ans.message,$errorContainer, popupTime);
	  					
	  				}
	  			});
	  		}
  		
  	})

  }

 

  var popupWindowAnimate = function(){
  	// анимация popup
		// при нажатии на "зарегистрироваться"
		var flipp 	= 'flipp';
		var hide 		= 'hide';
		var $flipContainer = $('.flipper-container');
		var $backPass = $('.back-pass');
		var $backReg = $('.back-reg');

		$('.popup__link_registr').click(function(e){
			e.preventDefault();
			$backPass.addClass(hide);
			$backReg.removeClass(hide);
		 	$flipContainer.addClass(flipp);
	 });


		// при нажатии на "войти"
		$('.popup__link_enter').click(function(e){
		 	e.preventDefault();
	 		$flipContainer.removeClass(flipp);
	 });


		// при нажатии на "забыли пароль"
		$('.popup__link_forget-pass').click(function(e){
			e.preventDefault();
			$backPass.removeClass(hide);
			$backReg.addClass(hide);
		 	$flipContainer.addClass(flipp);
	 });
  };


 



  return {
      init: function () {
      	popupWindowAnimate();
      	toSendRequest();
      }

  };
})();
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
      console.log(droppedFiles);
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

    var ajaxData = new FormData($form.get(0));

    if (droppedFiles) {
      $.each( droppedFiles, function(i, file) {

        ajaxData.append( $input.attr('name'), file );

      });
    }

    $.ajax({
      url: location.href + '/addImg/',
      type: $form.attr('method'),
      data: ajaxData,
      dataType: 'json',
      cache: false,
      contentType: false,
      processData: false,
      complete: function(ans) {
        $form.removeClass('is-uploading');
        console.log(ans.responseText);


      
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
// =========== Main-page module ===========
// Этот модуль содержит в себе скрипты которые используються только на главной странице
// авторизованного пользователя (main-page)

var mainPageModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  //Общие переменные
 


  var $header = $('.header-main');
  var $footer = $('.footer');
  var headerBg = $('.header-main').attr('style');
  var footerBg = $('.footer').attr('style');


  var $headerFront = $header.find('.header__section_main-front');
  var $headrBack = $header.find('.header__section_main-back');

  var $avatarFront = $headerFront.find('.user-block__photo');
  var $avatarBack = $headrBack.find('.user-block__photo');
  var avatarFrontVal = $avatarFront.attr('style');
  var avatarBackVal = $avatarBack.attr('style');


  var $userBlockFront = $headerFront.find('.user-block');
  // Окно редактирования
  var $headerEdit = $header.find('.header__section_main-back');
  var $headerEditAvatar = $header.find('.user-block__photo-edit');
  var $headerEdidBg = $headerEdit.find('.header__part--zip_main');
  var $headerEditData = $headerEdit.find('.user-block--edit');
  var $userBlockMain = $headerEditData.find('.user-block__main');
  var $formRow = $userBlockMain.find('.form__row');
  var $avatarEdit = $headerEditData.find('.user-block__photo');
  var avatarBg = $avatarEdit.attr('style');
  var frontAvatar = $headerFront.find('.user-block__photo');
  var frontAvatarBg = frontAvatar.attr('style');
  
  // Кнопки формы редактирования
  var fileUploadBg = $headerEdidBg.find('input[name="bg"]');
  var fileUploadAvtar = $headerEditAvatar.find('input[name="photo"]')
  var btnReset = $('#cancel_edit_header');
  var btnSave = $header.find('.btn--save');





  // Валидация изображения(Перенести в base)
	var validateImg = function(photo){
		var maxSize = 2 * 1024 * 1024;
    var flag = true;
		if(!photo.type.match(/image\/(jpeg|jpg|png|gif)/) ) {
      flag = false;

      return alert('Фотография должна быть в формате jpg, png или gif');
    }
		if(photo.size > maxSize){
      flag = false;
			return alert("Фотография больше 2мб");
		}
    return flag;
	}

  // Показываем новый бекраунд, еще без отправки на сервер
  var previeUserBackGround = function(){
  	
  	var photo = $(this)[0].files[0];
  	if(!validateImg(photo)){
      return
    }

		var reader = new FileReader();
		reader.readAsDataURL(photo);
		
		reader.onload = (function (photo) {
      return function (e) {
          $header.removeAttr('style').attr('style','background-image : url('+ e.target.result +')')
          $footer.removeAttr('style').attr('style','background-image : url('+ e.target.result +')')
      }
      }) (photo);
  }

  // Показываем новую аватарку , еще без отправки на сервер
  var previeUserAvatar = function(){
    var photo = $(this)[0].files[0];
    if(!validateImg(photo)){
      return
    }

    var reader = new FileReader();
    reader.readAsDataURL(photo);

    reader.onload = (function (photo) {
    return function (e) {
      $avatarFront.removeAttr('style').attr('style','background-image : url('+ e.target.result +')');
      $avatarBack.removeAttr('style').attr('style','background-image : url('+ e.target.result +')');
    }
    }) (photo);

   

  }

  // Скидываем параметры при отмене
  var resetUserData = function(){
  	$header.removeAttr('style').attr('style',headerBg);
  	$footer.removeAttr('style').attr('style',footerBg);
    $avatarFront.removeAttr('style').attr('style',avatarFrontVal);
    $avatarBack.removeAttr('style').attr('style',avatarBackVal);

  }

  // Получаем новый бекраунд
  var setUserBackGround = function(){
    headerBg = $header.attr('style');
    footerBg = $footer.attr('style');
  }

  var setAvatar = function(){
    avatarBg = $avatarEdit.attr('style');
    frontAvatar = $avatarEdit.attr('style');
  }




  // Проуслушка
  var _setUplistner = function(){
  	fileUploadBg.on('change',previeUserBackGround);
    fileUploadAvtar.on('change',previeUserAvatar);
  	btnReset.on('click',resetUserData);
  }
  

  // Отправляем данные на сервер
  var _editUserData = function(){
  	
  	btnSave.on('click', function(e){
  		e.preventDefault();
      setUserBackGround();
      setAvatar();
  		var userName = $userBlockFront.find('.user-block__name');
  		var userAbout = $userBlockFront.find('.user-block__desc');
  		var inputName = $formRow.find('input[name = "name"]');
  		var inputAbout = $formRow.find('textarea[name = "desc"]');
  		var id = window.location.pathname;
  		var photo = fileUploadBg[0].files[0];
      var avatar = fileUploadAvtar[0].files[0];


  		// Обновляем текстовые данные на странице(еще без базы)
  		userName.text(inputName.val());
  		userAbout.text(inputAbout.val());

  		
  		// Формируем ajax объект для отправки на сервер
  			var formData = new FormData();
        formData.append("userAvatar",avatar);
  			formData.append("userBackGround",photo);
        formData.append("userName",inputName.val());
        formData.append("userAbout",inputAbout.val());


  			var xhr = new XMLHttpRequest;
        xhr.open('POST', id + 'editUserData/',true);
        xhr.send(formData);
        xhr.onreadystatechange = function() {
          if (xhr.readyState != 4) return;

          if (xhr.status == 200) {
            //$avatarFront.removeAttr('style').attr('style','background-image : url('+ e.target.result +')');
            //$avatarBack.removeAttr('style').attr('style','background-image : url('+ e.target.result +')');
            //alert("Пришел ответ от сервера")
          }

        }
  	})
  }
  // Прослушка событий

  return {
    init: function () {
    	_editUserData();
    	_setUplistner();
    },
    
  };
})();
// =========== Album module ===========
// Этот модуль содержит в себе скрипты которые используються только на странице альбомов.

var albumModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  // Общиие переменные
  var $form = $('.popup__form');
  var $formAddAlbum = $form.filter('.popup__form-add-album');
  var button = 'input[type = submit]';
  var popupTime = 5000;
  var albumCoverInput = $form.find('input[name="addAlbumCover"]');
  var loader = 'loader';

	// Открыть окно для загрузки изображений
	var openUpload = function(){
		base.changeClass('.modal_add-photo, .modal-overlay','hide','del')
	};

	// Закрыть окно для загрузки изображений
	var closeUpload = function(e){
		e.preventDefault();
		var modal = $(this).closest('.modal');
		base.changeClass(modal,'hide','add');
		base.changeClass('.modal-overlay','hide','add');
		$(".img-list").empty();
		$('.modal__load-img').show();
	};

	// Открыть окно для редактирования фото и отправить ajax при сохранении редактирования

	var openEditPhoto = function(){
		// Открыть окно
		base.changeClass('.modal_edit-photo, .modal-overlay','hide','del');

		// Данные для ajax
		var $formEditImg = $('.modal__form-edit');
  	var button = 'input[type = submit]';
  	var popupTime = 5000;
	// Отправляем ajax на ????
    $('.submit-edit').on('click', function(e){
      e.preventDefault();
      // Параметры для popup
      var errorArray = base.validateForm($formEditImg); // Проверяем текущую форму и выдаем массив индексов ошибок
      var $errorContainer = $formEditImg.find('.popup__error');
      if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
        errorArray.forEach(function(index){
          base.showError(index,$errorContainer, popupTime);
        });
      }else{ 
      	// Если массив пустой, выполняем дальше
        var servAns = base.ajax($formEditImg,'/album/???/');
      }    
	});
};

	// Отмена загрузки для одной картинки
	var _cancelLoad = function(e){
		alert("Отменить загрузку?");
		$(this).remove();
		console.log($('.img-list li').length);
		if($('.img-list li').length == 0){
			$('.modal__load-img').show();
		}
		
};
	// Функция при скролле
	var _fixedAdd = function() {
		var $albumContainer = $('.header-album__content');
		var $albumBtn = $('.btn_album-add');
		var $backSide = $('.header-album__about-side_back');
		var $frontSide = $('.header-album__about-side_front');
		var fixed = 'fixed';
		var hide = 'hide';

		if(($('html').scrollTop()>=$albumContainer.height()) || ($('body').scrollTop()>=$albumContainer.height())){

			if (!($albumBtn.hasClass(fixed))){
		    		base.changeClass($albumBtn,fixed,'add');
		    }
		   $backSide.removeClass(hide).addClass('fixedHeader');
		   base.changeClass($frontSide,hide,'add');
	  }
	  else{
	    		if ($albumBtn.hasClass(fixed)){
		    		base.changeClass($albumBtn,fixed,'del');
		    	}
		    	$backSide.addClass(hide).removeClass('fixedHeader');
		    	base.changeClass($frontSide,hide,'del');

	    	}
	};


	// Отправляем ajax на addAlbumCover

	albumCoverInput.on('change',function(){
		var $this = $(this);
		var form = $this.closest('form');
		var veiwCover = form.find('.user-block__photo');
		var id = window.location.pathname;
		var cover = $this[0].files[0];
		var formData = new FormData();
		var xhr = new XMLHttpRequest;

		
		formData.append("albumCover",cover);
		xhr.open('POST', id + 'addAlbumCover/',true);
    xhr.send(formData);
    base.changeClass(veiwCover,loader,'add');
    veiwCover.removeAttr('style');
    if(!cover){
    	base.changeClass(veiwCover,loader,'del');
    	return;
    }
    
    xhr.onreadystatechange = function() {

      if (xhr.readyState != 4) return;

      if (xhr.status == 200) {
      	
      	var data = JSON.parse(xhr.response);
      	veiwCover.css({
      		'background-image' : 'url('+ data.newAlbomCover.replace('./users','') +')'
      	})
      	base.changeClass(veiwCover,loader,'del');
      }
     }

	})

	// Добавление альбома
  // Отправляем ajax на addlbum
  $formAddAlbum.find(button).on('click', function(e){
    e.preventDefault();
    var $thisForm = $(this).closest('form');
    var veiwCover = $thisForm.find('.user-block__photo');
    if(veiwCover.hasClass(loader)){
    	return;
    }
    // Параметры для popup
    var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
    var $errorContainer = $thisForm.find('.popup__error');
    if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
      errorArray.forEach(function(index){
        //base.showError(index,$errorContainer, popupTime);
        alert(base.errors[index]);
        return false;
      });
    }else{ // Если массив пустой, выполняем дальше
      var id = window.location.pathname;
      //servAns = base.ajax($thisForm, id + 'addAlbum/');
    	var formData = new FormData();
      formData.append("albumName",$thisForm.find('.add-album__name-input').val());
			formData.append("albumText",$thisForm.find('.add-album__textarea').val());
      formData.append("albumCover",$thisForm.find('.btn__upload')[0].files[0]);


			var xhr = new XMLHttpRequest;
      xhr.open('POST', id + 'addAlbum/',true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status == 200) {
        	var data = JSON.parse(xhr.response);
        	alert(data.message);
        	
        }
      }
      
    }

  });






	// Анимация для редактирования хедера
	var editAllHeader = (function() {

		var $this,
				front,
				back,
				headerBottom,
				headerBottomEdit;

		var _setUpListners = function() {
			$('.btn_edit-header').on('click', _editHeader);
			$('#cancel_edit_header').on('click', _returnHeader);
			$('.btn--save').on('click', _returnHeader);
		};

		var _editHeader = function() {

			$this = $(this);
			front = $this.closest('.header__section');
			back = front.next();
			headerBottom = front.parent().siblings().children('.header-bottom-front');
			headerBottomEdit  = headerBottom.prev();

			back.css('top','0');
			headerBottomEdit.css('transform','translateY(0)');
			front.fadeOut(500);
			$('.header-edit-overlay').fadeIn(500);
			headerBottom.fadeOut(500);
		}
		var _returnHeader = function(ev) {
			ev.preventDefault();
			back.css('top','-100%');
			headerBottomEdit.css('transform','translateY(100%)');
			front.fadeIn(500);
			$('.header-edit-overlay').fadeOut(500);
			headerBottom.fadeIn(500);
		}
		return{
			init : function() {
				_setUpListners();
			},
		}
});


	var _setUpListners = function() {
		$('.btn_album-add').on('click', openUpload);
		$('.btn_edit-photo').on('click', openEditPhoto);
		$('.modal__header-close').on('click', closeUpload);
		$(window).on('scroll', _fixedAdd);
		$('body').on('click','.img-item',_cancelLoad);
	};



  return {
  	edit: editAllHeader(),
    init: function () {
    	_setUpListners();
    },

  };
})();
function initPopup () {

	// Функция открытия попапа
	function popup(id, action) {
		var body      = $('body');
		var className = 'hide';

		if(action == 'open') {
			body.addClass('no-scroll');

			$('#' + id)
				.removeClass( className )
				.parent()
					.removeClass( className );
		} else if(action == 'close') {

			body.removeClass('no-scroll');

			if(id == 'all') {
				$('.modal')
					.addClass( className )
					.parent()
						.addClass( className );
			} else {
				$('#' + id)
					.addClass( className )
					.parent()
						.addClass( className );
			}
		}
	}


	// Открытие попапов по клику на элементы с атрибутом data-modal
	$(document).on('click', '[data-modal]', function(e) {
			var $el     = $(this);
			var popupId = $el.attr('data-modal');

			popup('all', 'close');
			popup(popupId, 'open');
	});


	// События при клике элемент с атрибутом data-action="close"
	$(document).on('click', '[data-action="close"]', function(e) {
			var btn   = $(this);
			var modal = btn.closest('.modal');

			popup(modal.attr('id'), 'close');
	});

} // initPopup()



initPopup();
// Слайдер
(function() {
	var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd';

	function Slider(options) {
		var gallery     = options.elem;
		var prev        = gallery.find('.slider__control--prev');
		var next        = gallery.find('.slider__control--next');

		var slides         = gallery.find('.slider__item');
		var activeSlide    = slides.filter('.slider__item--active');
		var slidesCnt      = slides.length;
		var activeSlideIdx = activeSlide.index();

		var isReady    = true;


		function showedSlide(slider, idx) {
			slider
				.eq(idx).addClass('slider__item--active')
				.siblings().removeClass('slider__item--active');
		}

		// function dataChange(direction) {
		// 	activeSlideIdx = (direction === 'next') ? getIdx(activeSlideIdx, 'next') : getIdx(activeSlideIdx, 'prev');
		// }

		function getIdx(currentIdx, dir) {
			if(dir === 'prev') {
				return (currentIdx - 1 < 0) ? slidesCnt - 1 : currentIdx - 1 ;
			}
			if(dir === 'next') {
				return (currentIdx + 1 >= slidesCnt) ? 0 : currentIdx + 1 ;
			}

			return currentIdx;
		}

		function changeSlide(slides, direction, className) {
			var currentSlide    = slides.filter('.slider__item--active');
			var currentSlideIdx = currentSlide.index();
			var newSlideIdx;

			if (direction === 'prev') {
				 newSlideIdx = getIdx(currentSlideIdx, 'prev');
			}
			if (direction === 'next') {
				newSlideIdx = getIdx(currentSlideIdx, 'next');
			}

			slides.eq(newSlideIdx)
				.addClass( className )
				.one(transitionEnd, function() {
					$(this)
						.removeClass( className )
						.addClass('slider__item--active')
						.trigger('changed-slide');
				});

			currentSlide
				.addClass( className )
				.one(transitionEnd, function() {
					$(this).removeClass('slider__item--active ' + className);
				});
		}


		$(document).on('changed-slide', function() {
			isReady = true;
		});




		this.prev = function() {
			if( !isReady ) return;
			isReady = false;

			changeSlide(slides, 'prev', 'slider__item--animate-fade');
			// dataChange('prev');
		};


		this.next = function() {
			if( !isReady ) return;
			isReady = false;

			changeSlide(slides, 'next', 'slider__item--animate-fade');
			// dataChange('next');
		};


		prev.on('click', this.prev);
		next.on('click', this.next);
	} // Slider



	var slider = new Slider({
		elem: $('#slider')
	});
})();
// Создание модуля.
// 1) Cоздаем файл с модулем в папке sourse/js/modules
// 2) Желательно называть файлы с нижнего подчеркивания(Что бы не отходить от традиций)
// 3) Копируем структуру из файла _login или любого другово модуля(но не base).
// 4) в return модуля нужно вставить объект с методом init.
// 5) в метод init записываем функции, которые будут вызываться автоматически при инициализации модуля.
// 6) Что бы получить доступ к библиотеке, в начале модуля нужно ее объявить, напирмер так var base = new BaseModule;
// теперь все свойства и методы библиотеки доступны через точку, напирмер так base.ajaxData(form);
// 7) В библиотеку можно дописывать все что угодно, главное чтобы функция начиналась с this, так модуль base является конструктором.
// 8) Для того чтобы модуль собрался в один файл app.js его нужно прописать в в gulpfile.js.
// Документация по фунциям base, будет чуть позже...



$( document ).ready(function() {
    var base = new BaseModule; // Инициализируем библиотеку. (Пока не нужно)
    commonModule.init();
    loginModule.init();
    mainPageModule.init();
    albumModule.init();
    albumModule.edit.init();
});

	// Кастомный вид для загрузки файлов
	(function() {
		var el = $('.upload');

		if(el.length === 0) return;

		$(document).on('click', '.upload', function(e) {
			var el    = $(this);
			var input = el.children('[type=file]');

			input[0].click();
		});
	})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9iYXNlLmpzIiwiX2NvbW1vbi5qcyIsIl9sb2dpbi5qcyIsInVwbG9hZC5qcyIsIl9tYWluLXBhZ2UuanMiLCJfYWxidW0uanMiLCJtb2RhbC5qcyIsInNsaWRlci5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gPT09PT09PT09PT0gQmFzZSBtb2R1bGUgPT09PT09PT09PT1cclxuXHJcbnZhciBCYXNlTW9kdWxlID0gZnVuY3Rpb24oKXtcclxuXHJcblx0Ly89PT09PT0g0J7QsdGK0LXQutGC0Yss0LzQsNGB0YHQuNCy0YsgPT09PT09XHJcblx0dGhpcy5lcnJvcnMgPSB7XHJcbiAgXHQwIDogJ9CX0LDQv9C+0LvQvdC10L3RiyDQvdC1INCy0YHQtSDQv9C+0LvRjycsXHJcbiAgXHQxIDogJ9CS0LLQtdC00LjRgtC1INC60L7RgNGA0LXQutGC0L3Ri9C5IGUtbWFpbCcsXHJcbiAgXHQyXHQ6ICfQlNC70LjQvdCwINC/0LDRgNC+0LvRjyDQvNC10L3RjNGI0LUgOCDRgdC40LzQstC+0LvQvtCyJyxcclxuICBcdDMgOiAn0JLRi9Cx0LXRgNC40YLQtSDQvtCx0LvQvtC20LrRgydcclxuICB9O1xyXG5cclxuICB0aGlzLlJlZ1BhdHRlcm5zID0ge1xyXG4gIFx0ZW1haWwgOiAvXihbMC05YS16QS1aXy1dK1xcLikqWzAtOWEtekEtWl8tXStAWzAtOWEtekEtWl8tXSsoXFwuWzAtOWEtekEtWl8tXSspKlxcLlthLXpdezIsNn0kLyxcclxuICB9O1xyXG5cclxuICB0aGlzLmdsb2JhbCA9IHt9O1xyXG5cclxuXHJcblxyXG5cclxuICAvLz09PT09PSDQpNGD0L3QutGG0LjQuCA9PT09PT1cclxuXHJcblxyXG5cdHRoaXMuYWpheERhdGEgPSBmdW5jdGlvbihmb3JtLF90eXBlKXtcclxuXHRcdHZhciBlbGVtID0gZm9ybS5maW5kKCdpbnB1dFt0eXBlICE9IHN1Ym1pdF0sdGV4dGFyZWEnKTtcclxuXHRcdHZhciBkYXRhID0ge307XHJcblx0XHQkLmVhY2goZWxlbSwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRkYXRhWyQodGhpcykuYXR0cignbmFtZScpXSA9ICQodGhpcykudmFsKCk7XHJcblx0XHR9KVxyXG5cdFx0dmFyIGZvcm1hdCA9IF90eXBlIHx8IEpTT04uc3RyaW5naWZ5KGRhdGEpXHJcblx0XHRyZXR1cm4gZm9ybWF0O1xyXG5cdH07XHJcblxyXG5cdHRoaXMuYWpheCA9IGZ1bmN0aW9uKGZvcm0sIHVybCwgX21ldGhvZCl7XHJcblx0XHRcdHZhciBtZXRob2QgPSBfbWV0aG9kIHx8ICdQT1NUJztcclxuXHRcdFx0dmFyIGRhdGEgPSB0aGlzLmFqYXhEYXRhKGZvcm0pO1xyXG5cdFx0XHRyZXR1cm4gJC5hamF4KHtcclxuXHRcdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0XHR0eXBlOiBtZXRob2QsXHJcblx0XHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0XHRkYXRhOiBkYXRhXHJcblx0XHRcdH0pO1xyXG5cdH1cclxuXHJcblx0dGhpcy5hamF4RGF0YU9iaiA9IGZ1bmN0aW9uKG9iaix1cmwsbWV0aG9kKXtcclxuXHRcdG1ldGhvZCA9IG1ldGhvZCB8fCAnUE9TVCdcclxuXHRcdHZhciBkYXRhID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcclxuXHRcdHJldHVybiAkLmFqYXgoe1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0dHlwZTogbWV0aG9kLFxyXG5cdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG5cdFx0XHRkYXRhOiBkYXRhXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHRoaXMuc2hvd0Vycm9yID0gZnVuY3Rpb24oZXJyb3JJbmRleCxlbGVtLF9tcyl7XHJcblx0XHR2YXIgdGhpc0Zyb20gPSBlbGVtLmNsb3Nlc3QoJ2Zvcm0nKTtcclxuXHRcdHZhciB0aW1lID0gX21zIHx8IDIwMDA7XHJcblx0XHRpZih0eXBlb2YoZXJyb3JJbmRleCkgPT0gJ3N0cmluZycpe1xyXG5cdFx0XHRlbGVtLnRleHQoZXJyb3JJbmRleClcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRlbGVtLnRleHQodGhpcy5lcnJvcnNbZXJyb3JJbmRleF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYodGhpc0Zyb20uZmluZChlbGVtKS5pcygnOnZpc2libGUnKSl7XHJcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLmdsb2JhbC50aW1lcik7XHJcblx0XHRcdHRoaXMuZ2xvYmFsLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGVsZW0udGV4dCgpO1xyXG5cdFx0XHRcdGVsZW0ucmVtb3ZlQ2xhc3MoJ3Nob3cnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9LCB0aW1lKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdFxyXG5cdFx0ZWxlbS5yZW1vdmVDbGFzcygnaGlkZScpLmFkZENsYXNzKCdzaG93Jyk7XHJcblxyXG5cclxuXHRcdHRoaXMuZ2xvYmFsLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRlbGVtLnRleHQoKTtcclxuXHRcdFx0ZWxlbS5yZW1vdmVDbGFzcygnc2hvdycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9LCB0aW1lKTtcclxuXHJcblx0fVxyXG5cclxuXHR0aGlzLmhpZGVFcnJvciA9IGZ1bmN0aW9uKGVsZW0pe1xyXG5cdFx0ZWxlbS5yZW1vdmVDbGFzcygnc2hvdycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0fVxyXG5cclxuXHR0aGlzLnZhbGlkRW1haWwgPSBmdW5jdGlvbihpbnB1dCwgcGF0dGVyKXtcclxuXHRcdHJldHVybiBwYXR0ZXIudGVzdChpbnB1dC52YWwoKSk7XHJcblx0fTtcclxuXHJcblx0dGhpcy52YWxpZFBhc3MgPSBmdW5jdGlvbihpbnB1dCxsZW5ndGgpe1xyXG5cdFx0dmFyIGxlbiA9IGxlbmd0aCB8fCA4O1xyXG5cdFx0aWYoIShpbnB1dC52YWwoKS5sZW5ndGggPCBsZW4pKXtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0dGhpcy52YWxpZEZpbGVzID0gZnVuY3Rpb24oaW5wdXQsbGVuZ3RoKXtcclxuXHRcdHZhciBsZW4gPSBsZW5ndGggfHwgMDtcclxuXHRcdGlmKCEoaW5wdXRbMF0uZmlsZXMubGVuZ3RoIDw9IGxlbikpe1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMudmFsaWRhdGVGb3JtID0gZnVuY3Rpb24oZm9ybSkge1xyXG5cdFx0dmFyIHRoaXNNb2R1bGUgPSB0aGlzO1xyXG5cdFx0dmFyIHBhdHRlcm4gPSB0aGlzTW9kdWxlLlJlZ1BhdHRlcm5zLmVtYWlsO1xyXG5cdFx0dmFyICR0aGlzRm9ybSA9IGZvcm07XHJcblx0XHR2YXIgZWxlbWVudHMgPSAkdGhpc0Zvcm0uZmluZCgndGV4dGFyZWEsaW5wdXQ6bm90KGlucHV0W3R5cGU9XCJzdWJtaXRcIl0pJyk7XHJcblx0XHR2YXIgZXJyb3JzID0gdGhpc01vZHVsZS5lcnJvcnM7XHJcblx0XHR2YXIgb3V0cHV0ID0gW107XHJcblxyXG5cdFx0JC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZighJCh0aGlzKS52YWwoKSAmJiAkKHRoaXMpLmF0dHIoJ3R5cGUnKSAhPSAnZmlsZScpe1xyXG5cdFx0XHRcdFx0b3V0cHV0WzBdID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYob3V0cHV0Lmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0JC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdFx0dmFyIHR5cGUgPSAkdGhpcy5hdHRyKCd0eXBlJyk7XHJcblx0XHRcdFx0dmFyIG5hbWVBdHRyID0gJHRoaXMuYXR0cignbmFtZScpO1xyXG5cdFx0XHRcdHN3aXRjaCh0eXBlKXtcclxuXHRcdFx0XHRcdGNhc2UgJ3Bhc3N3b3JkJyA6XHJcblx0XHRcdFx0XHRcdGlmKCF0aGlzTW9kdWxlLnZhbGlkUGFzcygkdGhpcykpe1xyXG5cdFx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKDIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnZW1haWwnIDpcclxuXHRcdFx0XHRcdFx0aWYoIXRoaXNNb2R1bGUudmFsaWRFbWFpbCgkdGhpcyxwYXR0ZXJuKSl7XHJcblx0XHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goMSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRzd2l0Y2gobmFtZUF0dHIpe1xyXG5cdFx0XHRcdFx0Y2FzZSAnYWRkQWxidW1Db3ZlcicgOlxyXG5cdFx0XHRcdFx0XHRpZighdGhpc01vZHVsZS52YWxpZEZpbGVzKCR0aGlzKSl7XHJcblx0XHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goMyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSlcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9O1xyXG5cclxuXHR0aGlzLmNsZWFySW5wdXRzID0gZnVuY3Rpb24oZm9ybSl7XHJcblx0XHR2YXIgZWxlbSA9IGZvcm0uZmluZCgnaW5wdXRbdHlwZSAhPSBzdWJtaXRdLHRleHRhcmVhJyk7XHJcblx0XHRlbGVtLnZhbCgnJyk7XHJcblx0fVxyXG5cclxuXHR0aGlzLnNjcm9sbFRvUG9zaXRpb24gPSBmdW5jdGlvbihwb3NpdGlvbiwgZHVyYXRpb24pe1xyXG4gIFx0dmFyIHBvc2l0aW9uID0gcG9zaXRpb24gfHwgMDtcclxuXHRcdHZhciBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IDEwMDA7XHJcblxyXG5cclxuXHRcdCQoXCJib2R5LCBodG1sXCIpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdHNjcm9sbFRvcDogcG9zaXRpb25cclxuXHRcdH0sIGR1cmF0aW9uKVxyXG4gIH07XHJcblxyXG4gIHRoaXMuY2hhbmdlQ2xhc3MgPSBmdW5jdGlvbihwYXJlbnQsY2xhc3NOYW1lLHR5cGUpe1xyXG4gIFx0aWYodHlwZW9mKHBhcmVudCkgPT0gJ3N0cmluZycpe1xyXG4gIFx0XHR2YXIgcGFyZW50ID0gJChwYXJlbnQpO1xyXG4gIFx0fVxyXG4gIFx0c3dpdGNoKHR5cGUpe1xyXG4gIFx0XHRjYXNlICdhZGQnOlxyXG4gIFx0XHRcdHBhcmVudC5hZGRDbGFzcyhjbGFzc05hbWUpO1xyXG4gIFx0XHRcdGJyZWFrO1xyXG4gIFx0XHRjYXNlICdkZWwnOlxyXG4gIFx0XHRcdHBhcmVudC5yZW1vdmVDbGFzcyhjbGFzc05hbWUpO1xyXG4gIFx0XHRcdGJyZWFrO1xyXG5cclxuICBcdH1cclxuICB9O1xyXG5cclxuXHRcclxuXHJcbn0iLCIvLyA9PT09PT09PT09PSBDb21tb24gbW9kdWxlID09PT09PT09PT09XHJcbi8vINCt0YLQvtGCINC80L7QtNGD0LvRjCDRgdC+0LTQtdGA0LbQuNGCINCyINGB0LXQsdC1INC+0LHRidC40LUg0YHQutGA0LjQv9GC0YssINC/0YDQuNGB0YPRidC40LUg0LLRgdC10Lwg0YHRgtGA0LDQvdC40YbQsNC8INGB0LDQudGC0LAuXHJcblxyXG52YXIgY29tbW9uTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuXHQvLyDQntCx0YrRj9Cy0LvQtdC90LjQtSDQsdC40LHQu9C40L7RgtC10LrQuFxyXG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XHJcblxyXG5cclxuXHJcbi8vINCf0YDQvtC60YDRg9GC0LjRgtGMINGB0YLRgNCw0L3QuNGG0YMg0LTQviAuLi5cclxuXHR2YXIgc2Nyb2xsVG8gPSBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHR2YXIgYnRuICAgICAgICA9ICQodGhpcyk7XHJcblx0XHR2YXIgdGFyZ2V0ICAgICA9IGJ0bi5hdHRyKCdkYXRhLWdvJyk7XHJcblx0XHR2YXIgY29udGFpbmVyICA9IG51bGw7XHJcblxyXG5cdFx0aWYgKHRhcmdldCA9PSAndG9wJykge1xyXG5cdFx0XHRiYXNlLnNjcm9sbFRvUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuLy8g0KHQstC+0YDQsNGH0LjQstCw0L3QuNC1INCx0LvQvtC60LAg0YEg0LrQvtC80LzQtdC90YLQsNGA0LjRj9C80LhcclxuXHR2YXIgY29tbWVudHNUb2dnbGUgPSBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHR2YXIgYnRuICAgICAgID0gJCh0aGlzKTtcclxuXHRcdHZhciBjb250YWluZXIgPSBidG4uY2xvc2VzdCgnLmNvbW1lbnRzJyk7XHJcblx0XHR2YXIgY29tbWVudHMgID0gY29udGFpbmVyLmZpbmQoJy5jb21tZW50c19fbGlzdCcpO1xyXG5cclxuXHRcdGlmKGNvbnRhaW5lci5oYXNDbGFzcygnY29tbWVudHMtLXNob3cnKSkge1xyXG5cdFx0XHRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2NvbW1lbnRzLS1zaG93Jyk7XHJcblx0XHRcdGNvbW1lbnRzLnNsaWRlVXAoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnRhaW5lci5hZGRDbGFzcygnY29tbWVudHMtLXNob3cnKTtcclxuXHRcdFx0Y29tbWVudHMuc2xpZGVEb3duKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gZHJvcCAtINGN0LvQtdC80LXQvdGCINGBINCy0YvQv9Cw0LTQsNGO0YnQuNC8INCx0LvQvtC60L7QvFxyXG5cdHZhciBhZGREcm9wID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdHZhciB0cmlnZ2VyICAgICA9ICQodGhpcyk7XHJcblx0XHR2YXIgY29udGFpbmVyICAgPSB0cmlnZ2VyLmNsb3Nlc3QoJy5kcm9wJyk7XHJcblx0XHR2YXIgY29udGVudCAgICAgPSBjb250YWluZXIuZmluZCgnLmRyb3BfX21haW4nKTtcclxuXHRcdHZhciBjbGFzc0FjdGl2ZSA9ICdkcm9wLS1vcGVuJztcclxuXHJcblx0XHRpZihjb250YWluZXIuaGFzQ2xhc3MoJ2Ryb3AtLWhvdmVyJykpIHJldHVybjtcclxuXHJcblx0XHRjb250YWluZXIudG9nZ2xlQ2xhc3MoIGNsYXNzQWN0aXZlICk7XHJcblx0fTtcclxuXHJcblxyXG5cdC8vINCa0LDRgdGC0L7QvNC90YvQuSDQstC40LQg0LTQu9GPINC30LDQs9GA0YPQt9C60Lgg0YTQsNC50LvQvtCyXHJcblx0Ly8g0J/QvtC20LDQu9GD0LnRgdGC0LAsINC40YHQv9GA0LDQstGM0YLQtSDRjdGC0YMg0YTRg9C90LrRhtC40Y4sINC90LUg0L/QvtC90Y/RgtC90L4g0LPQtNC1INC+0L3QsCDQuNGB0L/QvtC70YzQt9GD0LXRgtGM0YHRjyDQuCDQvdGD0LbQvdC+INCy0YvRgtCw0YnQuNGC0Ywgb24gY2xpY2sg0LIgX3NldFVwbGlzdG5lclxyXG5cdHZhciBmaWxlVXBsb2FkID0gZnVuY3Rpb24oKXtcclxuXHRcdHZhciBlbCA9ICQoJy51cGxvYWQnKTtcclxuXHJcblx0XHRpZihlbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnVwbG9hZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0dmFyIGVsICAgID0gJCh0aGlzKTtcclxuXHRcdFx0dmFyIGlucHV0ID0gZWwuY2hpbGRyZW4oJ1t0eXBlPWZpbGVdJyk7XHJcblxyXG5cdFx0XHRpbnB1dFswXS5jbGljaygpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8g0KDQsNC30LvQvtCz0LjQvSDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y9cclxuXHQvLyDQndGD0LbQvdC+INC00L7RgNCw0LHQvtGC0LDRgtGMXHJcblx0dmFyIGxvZ291dFVzZXIgPSBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIG9iaiA9IHtcclxuXHRcdFx0cmVxOiBcImxvZ291dFwiXHJcblx0XHR9XHJcblx0XHR2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9iaik7XHJcblxyXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xyXG5cdFx0XHR2YXIgaWQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcblx0XHRcdHhoci5vcGVuKCdQT1NUJywgaWQgKyAnbG9nb3V0LycsdHJ1ZSk7XHJcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCdhcHBsaWNhdGlvbi9qc29uJyk7XHJcblx0XHRcdHhoci5zZW5kKGRhdGEpO1xyXG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcclxuXHRcdFx0XHQvLyDQn9C10YDQtdC30LDQs9GA0YPQt9C60LAg0YHRgtGA0LDQvdC40YbRi1xyXG5cdFx0XHRcdGlmKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuc3RhdHVzID09IFwibG9nb3V0XCIpe1xyXG5cdFx0XHRcdFx0Ly93aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xyXG5cdFx0XHRcdFx0dmFyIHNpdGUgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wrICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArICcvJztcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7XHJcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHNpdGU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbn1cclxuXHJcblx0dmFyIGVkaXRVc2VyRGF0YSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRjb25zb2xlLmxvZygxMik7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vINCf0YDQvtGB0LvRg9GI0LrQsFxyXG5cdHZhciBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmNvbW1lbnRzX190b2dnbGUnICwgY29tbWVudHNUb2dnbGUpO1xyXG5cdFx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtZ29dJyAsIHNjcm9sbFRvKTtcclxuXHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5kcm9wX190cmlnZ2VyJywgYWRkRHJvcCk7XHJcblx0XHRcdCQoJy5sb2dvdXQnKS5vbignY2xpY2snLCBsb2dvdXRVc2VyKVxyXG5cdH07XHJcblxyXG5cclxuXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBcdF9zZXRVcExpc3RuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gIH07XHJcbn0pKCk7IiwiLy8gPT09PT09PT09PT0gTG9naW4gbW9kdWxlID09PT09PT09PT09XHJcbi8vINCt0YLQvtGCINC80L7QtNGD0LvRjCDRgdC+0LTQtdGA0LbQuNGCINCyINGB0LXQsdC1INCy0YHQtSDRh9GC0L4g0YHQstGP0LfQsNC90L3QviDRgSDRhNC+0YDQvNC+0Lkg0LDQstGC0L7RgNC40LfQsNGG0LjQuCDQuCDRgNC10LPQuNGB0YLRgNCw0YbQuNC4LlxyXG5cclxuXHJcbnZhciBsb2dpbk1vZHVsZSA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0Ly8g0JPQu9C+0LHQsNC70YzQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LUg0LzQvtC00YPQu9GPLlxyXG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XHJcbiAgXHJcbiAgdmFyIHRvU2VuZFJlcXVlc3QgPSBmdW5jdGlvbigpe1xyXG4gIFx0dmFyICRmb3JtID0gJCgnLnBvcHVwX19mb3JtJyk7XHJcbiAgXHR2YXIgJGZvcm1Mb2dpbiA9ICRmb3JtLmZpbHRlcignLnBvcHVwX19mb3JtLWxvZ2luJyk7XHJcbiAgXHR2YXIgJGZvcm1SZWcgPSAkZm9ybS5maWx0ZXIoJy5wb3B1cF9fZm9ybS1yZWdpc3RyYXRpb24nKTtcclxuICBcdHZhciAkZm9ybVJlY292ZXIgPSAkZm9ybS5maWx0ZXIoJy5wb3B1cF9fZm9ybS1yZWNvdmVyJyk7XHJcbiAgXHR2YXIgYnV0dG9uID0gJ2lucHV0W3R5cGUgPSBzdWJtaXRdJztcclxuICBcdHZhciBwb3B1cFRpbWUgPSA1MDAwO1xyXG5cclxuICBcdC8vINCe0YLQv9GA0LDQstC70Y/QtdC8IGFqYXgg0L3QsCBsb2dpblxyXG4gIFx0JGZvcm1Mb2dpbi5maW5kKGJ1dHRvbikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHQgIFx0XHR2YXIgJHRoaXNGb3JtID0gJCh0aGlzKS5jbG9zZXN0KCdmb3JtJyk7XHJcblx0ICBcdFx0Ly8g0J/QsNGA0LDQvNC10YLRgNGLINC00LvRjyBwb3B1cFxyXG5cdCAgXHRcdHZhciBlcnJvckFycmF5ID0gYmFzZS52YWxpZGF0ZUZvcm0oJHRoaXNGb3JtKTsgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8INGC0LXQutGD0YnRg9GOINGE0L7RgNC80YMg0Lgg0LLRi9C00LDQtdC8INC80LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINC+0YjQuNCx0L7QulxyXG5cdCAgXHRcdHZhciAkZXJyb3JDb250YWluZXIgPSAkdGhpc0Zvcm0uZmluZCgnLnBvcHVwX19lcnJvcicpO1xyXG5cdCAgXHRcdGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxyXG5cdCAgXHRcdFx0ZXJyb3JBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuXHQgIFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG5cdCAgXHRcdFx0fSk7XHJcblx0ICBcdFx0fWVsc2V7IC8vINCV0YHQu9C4INC80LDRgdGB0LjQsiDQv9GD0YHRgtC+0LksINCy0YvQv9C+0LvQvdGP0LXQvCDQtNCw0LvRjNGI0LVcclxuXHQgIFx0XHRcdHNlcnZBbnMgPSBiYXNlLmFqYXgoJHRoaXNGb3JtLCcvbG9naW4vJyk7XHJcblx0ICBcdFx0XHRzZXJ2QW5zLmRvbmUoZnVuY3Rpb24oYW5zKXtcclxuXHQgIFx0XHRcdFx0aWYoIWFucy5zdGF0dXMpe1xyXG5cdCAgXHRcdFx0XHRcdGJhc2Uuc2hvd0Vycm9yKGFucy5tZXNzYWdlLCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuXHQgIFx0XHRcdFx0fWVsc2V7XHJcblx0ICBcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuXHQgIFx0XHRcdFx0fVxyXG5cdCAgXHRcdFx0fSk7XHJcblx0ICBcdFx0fVxyXG4gIFx0XHRcclxuICBcdH0pXHJcblxyXG4gIFx0Ly8g0J7RgtC/0YDQsNCy0LvRj9C10LwgYWpheCDQvdCwIHJlZ1xyXG4gIFx0JGZvcm1SZWcuZmluZChidXR0b24pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gIFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0ICBcdFx0dmFyICR0aGlzRm9ybSA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpO1xyXG5cdCAgXHRcdC8vINCf0LDRgNCw0LzQtdGC0YDRiyDQtNC70Y8gcG9wdXBcclxuXHQgIFx0XHR2YXIgZXJyb3JBcnJheSA9IGJhc2UudmFsaWRhdGVGb3JtKCR0aGlzRm9ybSk7IC8vINCf0YDQvtCy0LXRgNGP0LXQvCDRgtC10LrRg9GJ0YPRjiDRhNC+0YDQvNGDINC4INCy0YvQtNCw0LXQvCDQvNCw0YHRgdC40LIg0LjQvdC00LXQutGB0L7QsiDQvtGI0LjQsdC+0LpcclxuXHQgIFx0XHR2YXIgJGVycm9yQ29udGFpbmVyID0gJHRoaXNGb3JtLmZpbmQoJy5wb3B1cF9fZXJyb3InKTtcclxuXHQgIFx0XHRpZihlcnJvckFycmF5Lmxlbmd0aCA+IDApe1x0Ly8g0JXRgdC70Lgg0LIg0LzQsNGB0YHQuNCy0LUg0LXRgdGC0Ywg0L7RiNC40LHQutC4LCDQt9C90LDRh9C40YIg0LLRi9C00LDQtdC8INC+0LrQvdC+LCDRgSDQvdC+0LzQtdGA0L7QvCDQvtGI0LjQsdC60LhcclxuXHQgIFx0XHRcdGVycm9yQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XHJcblx0ICBcdFx0XHRcdGJhc2Uuc2hvd0Vycm9yKGluZGV4LCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuXHQgIFx0XHRcdH0pO1xyXG5cdCAgXHRcdH1lbHNleyAvLyDQldGB0LvQuCDQvNCw0YHRgdC40LIg0L/Rg9GB0YLQvtC5LCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQsNC70YzRiNC1XHJcblx0ICBcdFx0XHRzZXJ2QW5zID0gYmFzZS5hamF4KCR0aGlzRm9ybSwnL3JlZy8nKTtcclxuXHQgIFx0XHRcdHNlcnZBbnMuZG9uZShmdW5jdGlvbihhbnMpe1xyXG5cdCAgXHRcdFx0XHRpZighYW5zLnN0YXR1cyl7XHJcblx0ICBcdFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoYW5zLm1lc3NhZ2UsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG5cdCAgXHRcdFx0XHR9ZWxzZXtcclxuXHQgIFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xyXG5cdCAgXHRcdFx0XHR9XHJcblx0ICBcdFx0XHR9KTtcclxuXHQgIFx0XHR9XHJcbiAgXHRcdFxyXG4gIFx0fSlcclxuXHJcbiAgXHQvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCBhamF4INC90LAgcmVjb3ZlclxyXG5cclxuICBcdCRmb3JtUmVjb3Zlci5maW5kKGJ1dHRvbikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHQgIFx0XHR2YXIgJHRoaXNGb3JtID0gJCh0aGlzKS5jbG9zZXN0KCdmb3JtJyk7XHJcblx0ICBcdFx0Ly8g0J/QsNGA0LDQvNC10YLRgNGLINC00LvRjyBwb3B1cFxyXG5cdCAgXHRcdHZhciBlcnJvckFycmF5ID0gYmFzZS52YWxpZGF0ZUZvcm0oJHRoaXNGb3JtKTsgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8INGC0LXQutGD0YnRg9GOINGE0L7RgNC80YMg0Lgg0LLRi9C00LDQtdC8INC80LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINC+0YjQuNCx0L7QulxyXG5cdCAgXHRcdHZhciAkZXJyb3JDb250YWluZXIgPSAkdGhpc0Zvcm0uZmluZCgnLnBvcHVwX19lcnJvcicpO1xyXG5cdCAgXHRcdGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxyXG5cdCAgXHRcdFx0ZXJyb3JBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuXHQgIFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG5cdCAgXHRcdFx0fSk7XHJcblx0ICBcdFx0fWVsc2V7IC8vINCV0YHQu9C4INC80LDRgdGB0LjQsiDQv9GD0YHRgtC+0LksINCy0YvQv9C+0LvQvdGP0LXQvCDQtNCw0LvRjNGI0LVcclxuXHQgIFx0XHRcdHNlcnZBbnMgPSBiYXNlLmFqYXgoJHRoaXNGb3JtLCcvcmVjb3Zlci8nKTtcclxuXHQgIFx0XHRcdHNlcnZBbnMuZG9uZShmdW5jdGlvbihhbnMpe1xyXG5cdCAgXHRcdFx0XHRpZighYW5zLnN0YXR1cyl7XHJcblx0ICBcdFx0XHRcdFx0cmV0dXJuIGJhc2Uuc2hvd0Vycm9yKGFucy5tZXNzYWdlLCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuXHQgIFx0XHRcdFx0fWVsc2V7XHJcblx0ICBcdFx0XHRcdFx0YmFzZS5jbGVhcklucHV0cygkdGhpc0Zvcm0pO1xyXG5cdCAgXHRcdFx0XHRcdHJldHVybiBiYXNlLnNob3dFcnJvcihhbnMubWVzc2FnZSwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcblx0ICBcdFx0XHRcdFx0XHJcblx0ICBcdFx0XHRcdH1cclxuXHQgIFx0XHRcdH0pO1xyXG5cdCAgXHRcdH1cclxuICBcdFx0XHJcbiAgXHR9KVxyXG5cclxuICB9XHJcblxyXG4gXHJcblxyXG4gIHZhciBwb3B1cFdpbmRvd0FuaW1hdGUgPSBmdW5jdGlvbigpe1xyXG4gIFx0Ly8g0LDQvdC40LzQsNGG0LjRjyBwb3B1cFxyXG5cdFx0Ly8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAgXCLQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIlxyXG5cdFx0dmFyIGZsaXBwIFx0PSAnZmxpcHAnO1xyXG5cdFx0dmFyIGhpZGUgXHRcdD0gJ2hpZGUnO1xyXG5cdFx0dmFyICRmbGlwQ29udGFpbmVyID0gJCgnLmZsaXBwZXItY29udGFpbmVyJyk7XHJcblx0XHR2YXIgJGJhY2tQYXNzID0gJCgnLmJhY2stcGFzcycpO1xyXG5cdFx0dmFyICRiYWNrUmVnID0gJCgnLmJhY2stcmVnJyk7XHJcblxyXG5cdFx0JCgnLnBvcHVwX19saW5rX3JlZ2lzdHInKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHQkYmFja1Bhc3MuYWRkQ2xhc3MoaGlkZSk7XHJcblx0XHRcdCRiYWNrUmVnLnJlbW92ZUNsYXNzKGhpZGUpO1xyXG5cdFx0IFx0JGZsaXBDb250YWluZXIuYWRkQ2xhc3MoZmxpcHApO1xyXG5cdCB9KTtcclxuXHJcblxyXG5cdFx0Ly8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAgXCLQstC+0LnRgtC4XCJcclxuXHRcdCQoJy5wb3B1cF9fbGlua19lbnRlcicpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0IFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCBcdFx0JGZsaXBDb250YWluZXIucmVtb3ZlQ2xhc3MoZmxpcHApO1xyXG5cdCB9KTtcclxuXHJcblxyXG5cdFx0Ly8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAgXCLQt9Cw0LHRi9C70Lgg0L/QsNGA0L7Qu9GMXCJcclxuXHRcdCQoJy5wb3B1cF9fbGlua19mb3JnZXQtcGFzcycpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdCRiYWNrUGFzcy5yZW1vdmVDbGFzcyhoaWRlKTtcclxuXHRcdFx0JGJhY2tSZWcuYWRkQ2xhc3MoaGlkZSk7XHJcblx0XHQgXHQkZmxpcENvbnRhaW5lci5hZGRDbGFzcyhmbGlwcCk7XHJcblx0IH0pO1xyXG4gIH07XHJcblxyXG5cclxuIFxyXG5cclxuXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgXHRwb3B1cFdpbmRvd0FuaW1hdGUoKTtcclxuICAgICAgXHR0b1NlbmRSZXF1ZXN0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgfTtcclxufSkoKTsiLCIvL9Ce0LHRgNCw0LHQsNGC0YvQstC10LwgRHJhZ0VuZERyb3BzXHJcbnZhciBpc0FkdmFuY2VkVXBsb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHJldHVybiAoKCdkcmFnZ2FibGUnIGluIGRpdikgfHwgKCdvbmRyYWdzdGFydCcgaW4gZGl2ICYmICdvbmRyb3AnIGluIGRpdikpICYmICdGb3JtRGF0YScgaW4gd2luZG93ICYmICdGaWxlUmVhZGVyJyBpbiB3aW5kb3c7XHJcbn0oKTtcclxuLy8g0KfQuNGC0LDQtdC8INGA0LDQt9C80LXRgtC60YMg0Lgg0YHQvtGF0YDQsNC90Y/QtdC8INGE0L7RgNC80YNcclxudmFyICRmb3JtID0gJCgnI3VwbG9hZCcpO1xyXG52YXIgJGlucHV0ID0gJCgnI2ZpbGUnKTtcclxudmFyICRzYXZlID0gJCgnI3NhdmUnKTtcclxuXHJcbi8vINCV0YHQu9C4INGH0YLQvtGC0L4g0LfQsNC60LjQvdGD0LvQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LrQu9Cw0YHRgVxyXG5pZiAoaXNBZHZhbmNlZFVwbG9hZCkge1xyXG5cclxuICB2YXIgZHJvcHBlZEZpbGVzID0gZmFsc2U7XHJcblxyXG4gICRmb3JtLm9uKCdkcmFnIGRyYWdzdGFydCBkcmFnZW5kIGRyYWdvdmVyIGRyYWdlbnRlciBkcmFnbGVhdmUgZHJvcCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfSlcclxuICAgIC5vbignZHJhZ292ZXIgZHJhZ2VudGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICRmb3JtLmFkZENsYXNzKCdpcy1kcmFnb3ZlcicpO1xyXG4gICAgfSlcclxuICAgIC5vbignZHJhZ2xlYXZlIGRyYWdlbmQgZHJvcCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnaXMtZHJhZ292ZXInKTtcclxuICAgIH0pXHJcbiAgICAub24oJ2Ryb3AnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGRyb3BwZWRGaWxlcyA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZmlsZXM7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRyb3BwZWRGaWxlcyk7XHJcbiAgICAgICRmb3JtLnRyaWdnZXIoJ3N1Ym1pdCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICRpbnB1dC5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkgeyAvLyBkcmFnICYgZHJvcCDQndCVINC/0L7QtNC00LXRgNC20LjQstCw0LXRgtGB0Y9cclxuICAgICRmb3JtLnRyaWdnZXIoJ3N1Ym1pdCcpO1xyXG4gIH0pO1xyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcbn1cclxuXHJcblxyXG4vLyDQoNGD0YfQvdCw0Y8g0L7RgtC/0YDQsNCy0LrQsFxyXG4kZm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gIGlmICgkZm9ybS5oYXNDbGFzcygnaXMtdXBsb2FkaW5nJykpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgLy9hbGVydCgn0J7RgtC/0YDQsNCy0LvRj9C10LwnKTtcclxuXHJcbiAgJGZvcm0uYWRkQ2xhc3MoJ2lzLXVwbG9hZGluZycpLnJlbW92ZUNsYXNzKCdpcy1lcnJvcicpO1xyXG5cclxuICBpZiAoaXNBZHZhbmNlZFVwbG9hZCkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHZhciBhamF4RGF0YSA9IG5ldyBGb3JtRGF0YSgkZm9ybS5nZXQoMCkpO1xyXG5cclxuICAgIGlmIChkcm9wcGVkRmlsZXMpIHtcclxuICAgICAgJC5lYWNoKCBkcm9wcGVkRmlsZXMsIGZ1bmN0aW9uKGksIGZpbGUpIHtcclxuXHJcbiAgICAgICAgYWpheERhdGEuYXBwZW5kKCAkaW5wdXQuYXR0cignbmFtZScpLCBmaWxlICk7XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IGxvY2F0aW9uLmhyZWYgKyAnL2FkZEltZy8nLFxyXG4gICAgICB0eXBlOiAkZm9ybS5hdHRyKCdtZXRob2QnKSxcclxuICAgICAgZGF0YTogYWpheERhdGEsXHJcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihhbnMpIHtcclxuICAgICAgICAkZm9ybS5yZW1vdmVDbGFzcygnaXMtdXBsb2FkaW5nJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYW5zLnJlc3BvbnNlVGV4dCk7XHJcblxyXG5cclxuICAgICAgXHJcbiAgICAgIC8vc29ja2V0LmVtaXQoJ2V2ZW50U2VydmVyJywge2RhdGE6ICdIZWxsbyBTZXJ2ZXInfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHJcbiAgICAgICAgJGZvcm0uYWRkQ2xhc3MoIGRhdGEuc3VjY2VzcyA9PSB0cnVlID8gJ2lzLXN1Y2Nlc3MnIDogJ2lzLWVycm9yJyApO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEuc3VjY2VzcykgJGVycm9yTXNnLnRleHQoZGF0YS5lcnJvcik7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBMb2cgdGhlIGVycm9yLCBzaG93IGFuIGFsZXJ0LCB3aGF0ZXZlciB3b3JrcyBmb3IgeW91XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCRmb3JtLmF0dHIoJ2FjdGlvbicpKTtcclxuXHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICB2YXIgaWZyYW1lTmFtZSAgPSAndXBsb2FkaWZyYW1lJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgJGlmcmFtZSAgID0gJCgnPGlmcmFtZSBuYW1lPVwiJyArIGlmcmFtZU5hbWUgKyAnXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPjwvaWZyYW1lPicpO1xyXG5cclxuICAgICQoJ2JvZHknKS5hcHBlbmQoJGlmcmFtZSk7XHJcbiAgICAkZm9ybS5hdHRyKCd0YXJnZXQnLCBpZnJhbWVOYW1lKTtcclxuXHJcbiAgICAkaWZyYW1lLm9uZSgnbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UoJGlmcmFtZS5jb250ZW50cygpLmZpbmQoJ2JvZHknICkudGV4dCgpKTtcclxuICAgICAgJGZvcm1cclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2lzLXVwbG9hZGluZycpXHJcbiAgICAgICAgLmFkZENsYXNzKGRhdGEuc3VjY2VzcyA9PSB0cnVlID8gJ2lzLXN1Y2Nlc3MnIDogJ2lzLWVycm9yJylcclxuICAgICAgICAucmVtb3ZlQXR0cigndGFyZ2V0Jyk7XHJcbiAgICAgIGlmICghZGF0YS5zdWNjZXNzKSAkZXJyb3JNc2cudGV4dChkYXRhLmVycm9yKTtcclxuICAgICAgJGZvcm0ucmVtb3ZlQXR0cigndGFyZ2V0Jyk7XHJcbiAgICAgICRpZnJhbWUucmVtb3ZlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG5cclxuJHNhdmUub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAkLmFqYXgoe1xyXG4gICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICB1cmw6IGxvY2F0aW9uLmhyZWYgKyAnL3NhdmVJbWcvJyxcclxuICAgIGRhdGE6ICdvaycsXHJcbiAgICBjYWNoZTogZmFsc2UsXHJcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICRmb3JtLmFkZENsYXNzKCBkYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSA/ICdpcy1zdWNjZXNzJyA6ICdpcy1lcnJvcicgKTtcclxuICAgICAgaWYgKCFkYXRhLnN1Y2Nlc3MpICRlcnJvck1zZy50ZXh0KGRhdGEuZXJyb3IpO1xyXG4gICAgfSxcclxuICAgIGVycm9yOiBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gTG9nIHRoZSBlcnJvciwgc2hvdyBhbiBhbGVydCwgd2hhdGV2ZXIgd29ya3MgZm9yIHlvdVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxufSk7IiwiLy8gPT09PT09PT09PT0gTWFpbi1wYWdlIG1vZHVsZSA9PT09PT09PT09PVxyXG4vLyDQrdGC0L7RgiDQvNC+0LTRg9C70Ywg0YHQvtC00LXRgNC20LjRgiDQsiDRgdC10LHQtSDRgdC60YDQuNC/0YLRiyDQutC+0YLQvtGA0YvQtSDQuNGB0L/QvtC70YzQt9GD0Y7RgtGM0YHRjyDRgtC+0LvRjNC60L4g0L3QsCDQs9C70LDQstC90L7QuSDRgdGC0YDQsNC90LjRhtC1XHJcbi8vINCw0LLRgtC+0YDQuNC30L7QstCw0L3QvdC+0LPQviDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8gKG1haW4tcGFnZSlcclxuXHJcbnZhciBtYWluUGFnZU1vZHVsZSA9IChmdW5jdGlvbigpIHtcclxuXHQvLyDQntCx0YrRj9Cy0LvQtdC90LjQtSDQsdC40LHQu9C40L7RgtC10LrQuFxyXG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XHJcblxyXG4gIC8v0J7QsdGJ0LjQtSDQv9C10YDQtdC80LXQvdC90YvQtVxyXG4gXHJcblxyXG5cclxuICB2YXIgJGhlYWRlciA9ICQoJy5oZWFkZXItbWFpbicpO1xyXG4gIHZhciAkZm9vdGVyID0gJCgnLmZvb3RlcicpO1xyXG4gIHZhciBoZWFkZXJCZyA9ICQoJy5oZWFkZXItbWFpbicpLmF0dHIoJ3N0eWxlJyk7XHJcbiAgdmFyIGZvb3RlckJnID0gJCgnLmZvb3RlcicpLmF0dHIoJ3N0eWxlJyk7XHJcblxyXG5cclxuICB2YXIgJGhlYWRlckZyb250ID0gJGhlYWRlci5maW5kKCcuaGVhZGVyX19zZWN0aW9uX21haW4tZnJvbnQnKTtcclxuICB2YXIgJGhlYWRyQmFjayA9ICRoZWFkZXIuZmluZCgnLmhlYWRlcl9fc2VjdGlvbl9tYWluLWJhY2snKTtcclxuXHJcbiAgdmFyICRhdmF0YXJGcm9udCA9ICRoZWFkZXJGcm9udC5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKTtcclxuICB2YXIgJGF2YXRhckJhY2sgPSAkaGVhZHJCYWNrLmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gIHZhciBhdmF0YXJGcm9udFZhbCA9ICRhdmF0YXJGcm9udC5hdHRyKCdzdHlsZScpO1xyXG4gIHZhciBhdmF0YXJCYWNrVmFsID0gJGF2YXRhckJhY2suYXR0cignc3R5bGUnKTtcclxuXHJcblxyXG4gIHZhciAkdXNlckJsb2NrRnJvbnQgPSAkaGVhZGVyRnJvbnQuZmluZCgnLnVzZXItYmxvY2snKTtcclxuICAvLyDQntC60L3QviDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgdmFyICRoZWFkZXJFZGl0ID0gJGhlYWRlci5maW5kKCcuaGVhZGVyX19zZWN0aW9uX21haW4tYmFjaycpO1xyXG4gIHZhciAkaGVhZGVyRWRpdEF2YXRhciA9ICRoZWFkZXIuZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvLWVkaXQnKTtcclxuICB2YXIgJGhlYWRlckVkaWRCZyA9ICRoZWFkZXJFZGl0LmZpbmQoJy5oZWFkZXJfX3BhcnQtLXppcF9tYWluJyk7XHJcbiAgdmFyICRoZWFkZXJFZGl0RGF0YSA9ICRoZWFkZXJFZGl0LmZpbmQoJy51c2VyLWJsb2NrLS1lZGl0Jyk7XHJcbiAgdmFyICR1c2VyQmxvY2tNYWluID0gJGhlYWRlckVkaXREYXRhLmZpbmQoJy51c2VyLWJsb2NrX19tYWluJyk7XHJcbiAgdmFyICRmb3JtUm93ID0gJHVzZXJCbG9ja01haW4uZmluZCgnLmZvcm1fX3JvdycpO1xyXG4gIHZhciAkYXZhdGFyRWRpdCA9ICRoZWFkZXJFZGl0RGF0YS5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKTtcclxuICB2YXIgYXZhdGFyQmcgPSAkYXZhdGFyRWRpdC5hdHRyKCdzdHlsZScpO1xyXG4gIHZhciBmcm9udEF2YXRhciA9ICRoZWFkZXJGcm9udC5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKTtcclxuICB2YXIgZnJvbnRBdmF0YXJCZyA9IGZyb250QXZhdGFyLmF0dHIoJ3N0eWxlJyk7XHJcbiAgXHJcbiAgLy8g0JrQvdC+0L/QutC4INGE0L7RgNC80Ysg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG4gIHZhciBmaWxlVXBsb2FkQmcgPSAkaGVhZGVyRWRpZEJnLmZpbmQoJ2lucHV0W25hbWU9XCJiZ1wiXScpO1xyXG4gIHZhciBmaWxlVXBsb2FkQXZ0YXIgPSAkaGVhZGVyRWRpdEF2YXRhci5maW5kKCdpbnB1dFtuYW1lPVwicGhvdG9cIl0nKVxyXG4gIHZhciBidG5SZXNldCA9ICQoJyNjYW5jZWxfZWRpdF9oZWFkZXInKTtcclxuICB2YXIgYnRuU2F2ZSA9ICRoZWFkZXIuZmluZCgnLmJ0bi0tc2F2ZScpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINC40LfQvtCx0YDQsNC20LXQvdC40Y8o0J/QtdGA0LXQvdC10YHRgtC4INCyIGJhc2UpXHJcblx0dmFyIHZhbGlkYXRlSW1nID0gZnVuY3Rpb24ocGhvdG8pe1xyXG5cdFx0dmFyIG1heFNpemUgPSAyICogMTAyNCAqIDEwMjQ7XHJcbiAgICB2YXIgZmxhZyA9IHRydWU7XHJcblx0XHRpZighcGhvdG8udHlwZS5tYXRjaCgvaW1hZ2VcXC8oanBlZ3xqcGd8cG5nfGdpZikvKSApIHtcclxuICAgICAgZmxhZyA9IGZhbHNlO1xyXG5cclxuICAgICAgcmV0dXJuIGFsZXJ0KCfQpNC+0YLQvtCz0YDQsNGE0LjRjyDQtNC+0LvQttC90LAg0LHRi9GC0Ywg0LIg0YTQvtGA0LzQsNGC0LUganBnLCBwbmcg0LjQu9C4IGdpZicpO1xyXG4gICAgfVxyXG5cdFx0aWYocGhvdG8uc2l6ZSA+IG1heFNpemUpe1xyXG4gICAgICBmbGFnID0gZmFsc2U7XHJcblx0XHRcdHJldHVybiBhbGVydChcItCk0L7RgtC+0LPRgNCw0YTQuNGPINCx0L7Qu9GM0YjQtSAy0LzQsVwiKTtcclxuXHRcdH1cclxuICAgIHJldHVybiBmbGFnO1xyXG5cdH1cclxuXHJcbiAgLy8g0J/QvtC60LDQt9GL0LLQsNC10Lwg0L3QvtCy0YvQuSDQsdC10LrRgNCw0YPQvdC0LCDQtdGJ0LUg0LHQtdC3INC+0YLQv9GA0LDQstC60Lgg0L3QsCDRgdC10YDQstC10YBcclxuICB2YXIgcHJldmllVXNlckJhY2tHcm91bmQgPSBmdW5jdGlvbigpe1xyXG4gIFx0XHJcbiAgXHR2YXIgcGhvdG8gPSAkKHRoaXMpWzBdLmZpbGVzWzBdO1xyXG4gIFx0aWYoIXZhbGlkYXRlSW1nKHBob3RvKSl7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuXHRcdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cdFx0cmVhZGVyLnJlYWRBc0RhdGFVUkwocGhvdG8pO1xyXG5cdFx0XHJcblx0XHRyZWFkZXIub25sb2FkID0gKGZ1bmN0aW9uIChwaG90bykge1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICRoZWFkZXIucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsJ2JhY2tncm91bmQtaW1hZ2UgOiB1cmwoJysgZS50YXJnZXQucmVzdWx0ICsnKScpXHJcbiAgICAgICAgICAkZm9vdGVyLnJlbW92ZUF0dHIoJ3N0eWxlJykuYXR0cignc3R5bGUnLCdiYWNrZ3JvdW5kLWltYWdlIDogdXJsKCcrIGUudGFyZ2V0LnJlc3VsdCArJyknKVxyXG4gICAgICB9XHJcbiAgICAgIH0pIChwaG90byk7XHJcbiAgfVxyXG5cclxuICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDQvdC+0LLRg9GOINCw0LLQsNGC0LDRgNC60YMgLCDQtdGJ0LUg0LHQtdC3INC+0YLQv9GA0LDQstC60Lgg0L3QsCDRgdC10YDQstC10YBcclxuICB2YXIgcHJldmllVXNlckF2YXRhciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgcGhvdG8gPSAkKHRoaXMpWzBdLmZpbGVzWzBdO1xyXG4gICAgaWYoIXZhbGlkYXRlSW1nKHBob3RvKSl7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwocGhvdG8pO1xyXG5cclxuICAgIHJlYWRlci5vbmxvYWQgPSAoZnVuY3Rpb24gKHBob3RvKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgJGF2YXRhckZyb250LnJlbW92ZUF0dHIoJ3N0eWxlJykuYXR0cignc3R5bGUnLCdiYWNrZ3JvdW5kLWltYWdlIDogdXJsKCcrIGUudGFyZ2V0LnJlc3VsdCArJyknKTtcclxuICAgICAgJGF2YXRhckJhY2sucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsJ2JhY2tncm91bmQtaW1hZ2UgOiB1cmwoJysgZS50YXJnZXQucmVzdWx0ICsnKScpO1xyXG4gICAgfVxyXG4gICAgfSkgKHBob3RvKTtcclxuXHJcbiAgIFxyXG5cclxuICB9XHJcblxyXG4gIC8vINCh0LrQuNC00YvQstCw0LXQvCDQv9Cw0YDQsNC80LXRgtGA0Ysg0L/RgNC4INC+0YLQvNC10L3QtVxyXG4gIHZhciByZXNldFVzZXJEYXRhID0gZnVuY3Rpb24oKXtcclxuICBcdCRoZWFkZXIucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsaGVhZGVyQmcpO1xyXG4gIFx0JGZvb3Rlci5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJyxmb290ZXJCZyk7XHJcbiAgICAkYXZhdGFyRnJvbnQucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsYXZhdGFyRnJvbnRWYWwpO1xyXG4gICAgJGF2YXRhckJhY2sucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsYXZhdGFyQmFja1ZhbCk7XHJcblxyXG4gIH1cclxuXHJcbiAgLy8g0J/QvtC70YPRh9Cw0LXQvCDQvdC+0LLRi9C5INCx0LXQutGA0LDRg9C90LRcclxuICB2YXIgc2V0VXNlckJhY2tHcm91bmQgPSBmdW5jdGlvbigpe1xyXG4gICAgaGVhZGVyQmcgPSAkaGVhZGVyLmF0dHIoJ3N0eWxlJyk7XHJcbiAgICBmb290ZXJCZyA9ICRmb290ZXIuYXR0cignc3R5bGUnKTtcclxuICB9XHJcblxyXG4gIHZhciBzZXRBdmF0YXIgPSBmdW5jdGlvbigpe1xyXG4gICAgYXZhdGFyQmcgPSAkYXZhdGFyRWRpdC5hdHRyKCdzdHlsZScpO1xyXG4gICAgZnJvbnRBdmF0YXIgPSAkYXZhdGFyRWRpdC5hdHRyKCdzdHlsZScpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLy8g0J/RgNC+0YPRgdC70YPRiNC60LBcclxuICB2YXIgX3NldFVwbGlzdG5lciA9IGZ1bmN0aW9uKCl7XHJcbiAgXHRmaWxlVXBsb2FkQmcub24oJ2NoYW5nZScscHJldmllVXNlckJhY2tHcm91bmQpO1xyXG4gICAgZmlsZVVwbG9hZEF2dGFyLm9uKCdjaGFuZ2UnLHByZXZpZVVzZXJBdmF0YXIpO1xyXG4gIFx0YnRuUmVzZXQub24oJ2NsaWNrJyxyZXNldFVzZXJEYXRhKTtcclxuICB9XHJcbiAgXHJcblxyXG4gIC8vINCe0YLQv9GA0LDQstC70Y/QtdC8INC00LDQvdC90YvQtSDQvdCwINGB0LXRgNCy0LXRgFxyXG4gIHZhciBfZWRpdFVzZXJEYXRhID0gZnVuY3Rpb24oKXtcclxuICBcdFxyXG4gIFx0YnRuU2F2ZS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICBcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBzZXRVc2VyQmFja0dyb3VuZCgpO1xyXG4gICAgICBzZXRBdmF0YXIoKTtcclxuICBcdFx0dmFyIHVzZXJOYW1lID0gJHVzZXJCbG9ja0Zyb250LmZpbmQoJy51c2VyLWJsb2NrX19uYW1lJyk7XHJcbiAgXHRcdHZhciB1c2VyQWJvdXQgPSAkdXNlckJsb2NrRnJvbnQuZmluZCgnLnVzZXItYmxvY2tfX2Rlc2MnKTtcclxuICBcdFx0dmFyIGlucHV0TmFtZSA9ICRmb3JtUm93LmZpbmQoJ2lucHV0W25hbWUgPSBcIm5hbWVcIl0nKTtcclxuICBcdFx0dmFyIGlucHV0QWJvdXQgPSAkZm9ybVJvdy5maW5kKCd0ZXh0YXJlYVtuYW1lID0gXCJkZXNjXCJdJyk7XHJcbiAgXHRcdHZhciBpZCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuICBcdFx0dmFyIHBob3RvID0gZmlsZVVwbG9hZEJnWzBdLmZpbGVzWzBdO1xyXG4gICAgICB2YXIgYXZhdGFyID0gZmlsZVVwbG9hZEF2dGFyWzBdLmZpbGVzWzBdO1xyXG5cclxuXHJcbiAgXHRcdC8vINCe0LHQvdC+0LLQu9GP0LXQvCDRgtC10LrRgdGC0L7QstGL0LUg0LTQsNC90L3Ri9C1INC90LAg0YHRgtGA0LDQvdC40YbQtSjQtdGJ0LUg0LHQtdC3INCx0LDQt9GLKVxyXG4gIFx0XHR1c2VyTmFtZS50ZXh0KGlucHV0TmFtZS52YWwoKSk7XHJcbiAgXHRcdHVzZXJBYm91dC50ZXh0KGlucHV0QWJvdXQudmFsKCkpO1xyXG5cclxuICBcdFx0XHJcbiAgXHRcdC8vINCk0L7RgNC80LjRgNGD0LXQvCBhamF4INC+0LHRitC10LrRgiDQtNC70Y8g0L7RgtC/0YDQsNCy0LrQuCDQvdCwINGB0LXRgNCy0LXRgFxyXG4gIFx0XHRcdHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInVzZXJBdmF0YXJcIixhdmF0YXIpO1xyXG4gIFx0XHRcdGZvcm1EYXRhLmFwcGVuZChcInVzZXJCYWNrR3JvdW5kXCIscGhvdG8pO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInVzZXJOYW1lXCIsaW5wdXROYW1lLnZhbCgpKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJ1c2VyQWJvdXRcIixpbnB1dEFib3V0LnZhbCgpKTtcclxuXHJcblxyXG4gIFx0XHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XHJcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBpZCArICdlZGl0VXNlckRhdGEvJyx0cnVlKTtcclxuICAgICAgICB4aHIuc2VuZChmb3JtRGF0YSk7XHJcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgLy8kYXZhdGFyRnJvbnQucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsJ2JhY2tncm91bmQtaW1hZ2UgOiB1cmwoJysgZS50YXJnZXQucmVzdWx0ICsnKScpO1xyXG4gICAgICAgICAgICAvLyRhdmF0YXJCYWNrLnJlbW92ZUF0dHIoJ3N0eWxlJykuYXR0cignc3R5bGUnLCdiYWNrZ3JvdW5kLWltYWdlIDogdXJsKCcrIGUudGFyZ2V0LnJlc3VsdCArJyknKTtcclxuICAgICAgICAgICAgLy9hbGVydChcItCf0YDQuNGI0LXQuyDQvtGC0LLQtdGCINC+0YIg0YHQtdGA0LLQtdGA0LBcIilcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gIFx0fSlcclxuICB9XHJcbiAgLy8g0J/RgNC+0YHQu9GD0YjQutCwINGB0L7QsdGL0YLQuNC5XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBcdF9lZGl0VXNlckRhdGEoKTtcclxuICAgIFx0X3NldFVwbGlzdG5lcigpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gIH07XHJcbn0pKCk7IiwiLy8gPT09PT09PT09PT0gQWxidW0gbW9kdWxlID09PT09PT09PT09XHJcbi8vINCt0YLQvtGCINC80L7QtNGD0LvRjCDRgdC+0LTQtdGA0LbQuNGCINCyINGB0LXQsdC1INGB0LrRgNC40L/RgtGLINC60L7RgtC+0YDRi9C1INC40YHQv9C+0LvRjNC30YPRjtGC0YzRgdGPINGC0L7Qu9GM0LrQviDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0LDQu9GM0LHQvtC80L7Qsi5cclxuXHJcbnZhciBhbGJ1bU1vZHVsZSA9IChmdW5jdGlvbigpIHtcclxuXHQvLyDQntCx0YrRj9Cy0LvQtdC90LjQtSDQsdC40LHQu9C40L7RgtC10LrQuFxyXG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XHJcblxyXG4gIC8vINCe0LHRidC40LjQtSDQv9C10YDQtdC80LXQvdC90YvQtVxyXG4gIHZhciAkZm9ybSA9ICQoJy5wb3B1cF9fZm9ybScpO1xyXG4gIHZhciAkZm9ybUFkZEFsYnVtID0gJGZvcm0uZmlsdGVyKCcucG9wdXBfX2Zvcm0tYWRkLWFsYnVtJyk7XHJcbiAgdmFyIGJ1dHRvbiA9ICdpbnB1dFt0eXBlID0gc3VibWl0XSc7XHJcbiAgdmFyIHBvcHVwVGltZSA9IDUwMDA7XHJcbiAgdmFyIGFsYnVtQ292ZXJJbnB1dCA9ICRmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCJhZGRBbGJ1bUNvdmVyXCJdJyk7XHJcbiAgdmFyIGxvYWRlciA9ICdsb2FkZXInO1xyXG5cclxuXHQvLyDQntGC0LrRgNGL0YLRjCDQvtC60L3QviDQtNC70Y8g0LfQsNCz0YDRg9C30LrQuCDQuNC30L7QsdGA0LDQttC10L3QuNC5XHJcblx0dmFyIG9wZW5VcGxvYWQgPSBmdW5jdGlvbigpe1xyXG5cdFx0YmFzZS5jaGFuZ2VDbGFzcygnLm1vZGFsX2FkZC1waG90bywgLm1vZGFsLW92ZXJsYXknLCdoaWRlJywnZGVsJylcclxuXHR9O1xyXG5cclxuXHQvLyDQl9Cw0LrRgNGL0YLRjCDQvtC60L3QviDQtNC70Y8g0LfQsNCz0YDRg9C30LrQuCDQuNC30L7QsdGA0LDQttC10L3QuNC5XHJcblx0dmFyIGNsb3NlVXBsb2FkID0gZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgbW9kYWwgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tb2RhbCcpO1xyXG5cdFx0YmFzZS5jaGFuZ2VDbGFzcyhtb2RhbCwnaGlkZScsJ2FkZCcpO1xyXG5cdFx0YmFzZS5jaGFuZ2VDbGFzcygnLm1vZGFsLW92ZXJsYXknLCdoaWRlJywnYWRkJyk7XHJcblx0XHQkKFwiLmltZy1saXN0XCIpLmVtcHR5KCk7XHJcblx0XHQkKCcubW9kYWxfX2xvYWQtaW1nJykuc2hvdygpO1xyXG5cdH07XHJcblxyXG5cdC8vINCe0YLQutGA0YvRgtGMINC+0LrQvdC+INC00LvRjyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINGE0L7RgtC+INC4INC+0YLQv9GA0LDQstC40YLRjCBhamF4INC/0YDQuCDRgdC+0YXRgNCw0L3QtdC90LjQuCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcblxyXG5cdHZhciBvcGVuRWRpdFBob3RvID0gZnVuY3Rpb24oKXtcclxuXHRcdC8vINCe0YLQutGA0YvRgtGMINC+0LrQvdC+XHJcblx0XHRiYXNlLmNoYW5nZUNsYXNzKCcubW9kYWxfZWRpdC1waG90bywgLm1vZGFsLW92ZXJsYXknLCdoaWRlJywnZGVsJyk7XHJcblxyXG5cdFx0Ly8g0JTQsNC90L3Ri9C1INC00LvRjyBhamF4XHJcblx0XHR2YXIgJGZvcm1FZGl0SW1nID0gJCgnLm1vZGFsX19mb3JtLWVkaXQnKTtcclxuICBcdHZhciBidXR0b24gPSAnaW5wdXRbdHlwZSA9IHN1Ym1pdF0nO1xyXG4gIFx0dmFyIHBvcHVwVGltZSA9IDUwMDA7XHJcblx0Ly8g0J7RgtC/0YDQsNCy0LvRj9C10LwgYWpheCDQvdCwID8/Pz9cclxuICAgICQoJy5zdWJtaXQtZWRpdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vINCf0LDRgNCw0LzQtdGC0YDRiyDQtNC70Y8gcG9wdXBcclxuICAgICAgdmFyIGVycm9yQXJyYXkgPSBiYXNlLnZhbGlkYXRlRm9ybSgkZm9ybUVkaXRJbWcpOyAvLyDQn9GA0L7QstC10YDRj9C10Lwg0YLQtdC60YPRidGD0Y4g0YTQvtGA0LzRgyDQuCDQstGL0LTQsNC10Lwg0LzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0L7RiNC40LHQvtC6XHJcbiAgICAgIHZhciAkZXJyb3JDb250YWluZXIgPSAkZm9ybUVkaXRJbWcuZmluZCgnLnBvcHVwX19lcnJvcicpO1xyXG4gICAgICBpZihlcnJvckFycmF5Lmxlbmd0aCA+IDApe1x0Ly8g0JXRgdC70Lgg0LIg0LzQsNGB0YHQuNCy0LUg0LXRgdGC0Ywg0L7RiNC40LHQutC4LCDQt9C90LDRh9C40YIg0LLRi9C00LDQtdC8INC+0LrQvdC+LCDRgSDQvdC+0LzQtdGA0L7QvCDQvtGI0LjQsdC60LhcclxuICAgICAgICBlcnJvckFycmF5LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG4gICAgICAgICAgYmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9ZWxzZXsgXHJcbiAgICAgIFx0Ly8g0JXRgdC70Lgg0LzQsNGB0YHQuNCyINC/0YPRgdGC0L7QuSwg0LLRi9C/0L7Qu9C90Y/QtdC8INC00LDQu9GM0YjQtVxyXG4gICAgICAgIHZhciBzZXJ2QW5zID0gYmFzZS5hamF4KCRmb3JtRWRpdEltZywnL2FsYnVtLz8/Py8nKTtcclxuICAgICAgfSAgICBcclxuXHR9KTtcclxufTtcclxuXHJcblx0Ly8g0J7RgtC80LXQvdCwINC30LDQs9GA0YPQt9C60Lgg0LTQu9GPINC+0LTQvdC+0Lkg0LrQsNGA0YLQuNC90LrQuFxyXG5cdHZhciBfY2FuY2VsTG9hZCA9IGZ1bmN0aW9uKGUpe1xyXG5cdFx0YWxlcnQoXCLQntGC0LzQtdC90LjRgtGMINC30LDQs9GA0YPQt9C60YM/XCIpO1xyXG5cdFx0JCh0aGlzKS5yZW1vdmUoKTtcclxuXHRcdGNvbnNvbGUubG9nKCQoJy5pbWctbGlzdCBsaScpLmxlbmd0aCk7XHJcblx0XHRpZigkKCcuaW1nLWxpc3QgbGknKS5sZW5ndGggPT0gMCl7XHJcblx0XHRcdCQoJy5tb2RhbF9fbG9hZC1pbWcnKS5zaG93KCk7XHJcblx0XHR9XHJcblx0XHRcclxufTtcclxuXHQvLyDQpNGD0L3QutGG0LjRjyDQv9GA0Lgg0YHQutGA0L7Qu9C70LVcclxuXHR2YXIgX2ZpeGVkQWRkID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgJGFsYnVtQ29udGFpbmVyID0gJCgnLmhlYWRlci1hbGJ1bV9fY29udGVudCcpO1xyXG5cdFx0dmFyICRhbGJ1bUJ0biA9ICQoJy5idG5fYWxidW0tYWRkJyk7XHJcblx0XHR2YXIgJGJhY2tTaWRlID0gJCgnLmhlYWRlci1hbGJ1bV9fYWJvdXQtc2lkZV9iYWNrJyk7XHJcblx0XHR2YXIgJGZyb250U2lkZSA9ICQoJy5oZWFkZXItYWxidW1fX2Fib3V0LXNpZGVfZnJvbnQnKTtcclxuXHRcdHZhciBmaXhlZCA9ICdmaXhlZCc7XHJcblx0XHR2YXIgaGlkZSA9ICdoaWRlJztcclxuXHJcblx0XHRpZigoJCgnaHRtbCcpLnNjcm9sbFRvcCgpPj0kYWxidW1Db250YWluZXIuaGVpZ2h0KCkpIHx8ICgkKCdib2R5Jykuc2Nyb2xsVG9wKCk+PSRhbGJ1bUNvbnRhaW5lci5oZWlnaHQoKSkpe1xyXG5cclxuXHRcdFx0aWYgKCEoJGFsYnVtQnRuLmhhc0NsYXNzKGZpeGVkKSkpe1xyXG5cdFx0ICAgIFx0XHRiYXNlLmNoYW5nZUNsYXNzKCRhbGJ1bUJ0bixmaXhlZCwnYWRkJyk7XHJcblx0XHQgICAgfVxyXG5cdFx0ICAgJGJhY2tTaWRlLnJlbW92ZUNsYXNzKGhpZGUpLmFkZENsYXNzKCdmaXhlZEhlYWRlcicpO1xyXG5cdFx0ICAgYmFzZS5jaGFuZ2VDbGFzcygkZnJvbnRTaWRlLGhpZGUsJ2FkZCcpO1xyXG5cdCAgfVxyXG5cdCAgZWxzZXtcclxuXHQgICAgXHRcdGlmICgkYWxidW1CdG4uaGFzQ2xhc3MoZml4ZWQpKXtcclxuXHRcdCAgICBcdFx0YmFzZS5jaGFuZ2VDbGFzcygkYWxidW1CdG4sZml4ZWQsJ2RlbCcpO1xyXG5cdFx0ICAgIFx0fVxyXG5cdFx0ICAgIFx0JGJhY2tTaWRlLmFkZENsYXNzKGhpZGUpLnJlbW92ZUNsYXNzKCdmaXhlZEhlYWRlcicpO1xyXG5cdFx0ICAgIFx0YmFzZS5jaGFuZ2VDbGFzcygkZnJvbnRTaWRlLGhpZGUsJ2RlbCcpO1xyXG5cclxuXHQgICAgXHR9XHJcblx0fTtcclxuXHJcblxyXG5cdC8vINCe0YLQv9GA0LDQstC70Y/QtdC8IGFqYXgg0L3QsCBhZGRBbGJ1bUNvdmVyXHJcblxyXG5cdGFsYnVtQ292ZXJJbnB1dC5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdHZhciBmb3JtID0gJHRoaXMuY2xvc2VzdCgnZm9ybScpO1xyXG5cdFx0dmFyIHZlaXdDb3ZlciA9IGZvcm0uZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvJyk7XHJcblx0XHR2YXIgaWQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcblx0XHR2YXIgY292ZXIgPSAkdGhpc1swXS5maWxlc1swXTtcclxuXHRcdHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG5cdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcclxuXHJcblx0XHRcclxuXHRcdGZvcm1EYXRhLmFwcGVuZChcImFsYnVtQ292ZXJcIixjb3Zlcik7XHJcblx0XHR4aHIub3BlbignUE9TVCcsIGlkICsgJ2FkZEFsYnVtQ292ZXIvJyx0cnVlKTtcclxuICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxuICAgIGJhc2UuY2hhbmdlQ2xhc3ModmVpd0NvdmVyLGxvYWRlciwnYWRkJyk7XHJcbiAgICB2ZWl3Q292ZXIucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgIGlmKCFjb3Zlcil7XHJcbiAgICBcdGJhc2UuY2hhbmdlQ2xhc3ModmVpd0NvdmVyLGxvYWRlciwnZGVsJyk7XHJcbiAgICBcdHJldHVybjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcclxuXHJcbiAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICBcdFxyXG4gICAgICBcdHZhciBkYXRhID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICBcdHZlaXdDb3Zlci5jc3Moe1xyXG4gICAgICBcdFx0J2JhY2tncm91bmQtaW1hZ2UnIDogJ3VybCgnKyBkYXRhLm5ld0FsYm9tQ292ZXIucmVwbGFjZSgnLi91c2VycycsJycpICsnKSdcclxuICAgICAgXHR9KVxyXG4gICAgICBcdGJhc2UuY2hhbmdlQ2xhc3ModmVpd0NvdmVyLGxvYWRlciwnZGVsJyk7XHJcbiAgICAgIH1cclxuICAgICB9XHJcblxyXG5cdH0pXHJcblxyXG5cdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCw0LvRjNCx0L7QvNCwXHJcbiAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10LwgYWpheCDQvdCwIGFkZGxidW1cclxuICAkZm9ybUFkZEFsYnVtLmZpbmQoYnV0dG9uKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHZhciAkdGhpc0Zvcm0gPSAkKHRoaXMpLmNsb3Nlc3QoJ2Zvcm0nKTtcclxuICAgIHZhciB2ZWl3Q292ZXIgPSAkdGhpc0Zvcm0uZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvJyk7XHJcbiAgICBpZih2ZWl3Q292ZXIuaGFzQ2xhc3MobG9hZGVyKSl7XHJcbiAgICBcdHJldHVybjtcclxuICAgIH1cclxuICAgIC8vINCf0LDRgNCw0LzQtdGC0YDRiyDQtNC70Y8gcG9wdXBcclxuICAgIHZhciBlcnJvckFycmF5ID0gYmFzZS52YWxpZGF0ZUZvcm0oJHRoaXNGb3JtKTsgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8INGC0LXQutGD0YnRg9GOINGE0L7RgNC80YMg0Lgg0LLRi9C00LDQtdC8INC80LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINC+0YjQuNCx0L7QulxyXG4gICAgdmFyICRlcnJvckNvbnRhaW5lciA9ICR0aGlzRm9ybS5maW5kKCcucG9wdXBfX2Vycm9yJyk7XHJcbiAgICBpZihlcnJvckFycmF5Lmxlbmd0aCA+IDApe1x0Ly8g0JXRgdC70Lgg0LIg0LzQsNGB0YHQuNCy0LUg0LXRgdGC0Ywg0L7RiNC40LHQutC4LCDQt9C90LDRh9C40YIg0LLRi9C00LDQtdC8INC+0LrQvdC+LCDRgSDQvdC+0LzQtdGA0L7QvCDQvtGI0LjQsdC60LhcclxuICAgICAgZXJyb3JBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuICAgICAgICAvL2Jhc2Uuc2hvd0Vycm9yKGluZGV4LCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuICAgICAgICBhbGVydChiYXNlLmVycm9yc1tpbmRleF0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9ZWxzZXsgLy8g0JXRgdC70Lgg0LzQsNGB0YHQuNCyINC/0YPRgdGC0L7QuSwg0LLRi9C/0L7Qu9C90Y/QtdC8INC00LDQu9GM0YjQtVxyXG4gICAgICB2YXIgaWQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgICAgIC8vc2VydkFucyA9IGJhc2UuYWpheCgkdGhpc0Zvcm0sIGlkICsgJ2FkZEFsYnVtLycpO1xyXG4gICAgXHR2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgZm9ybURhdGEuYXBwZW5kKFwiYWxidW1OYW1lXCIsJHRoaXNGb3JtLmZpbmQoJy5hZGQtYWxidW1fX25hbWUtaW5wdXQnKS52YWwoKSk7XHJcblx0XHRcdGZvcm1EYXRhLmFwcGVuZChcImFsYnVtVGV4dFwiLCR0aGlzRm9ybS5maW5kKCcuYWRkLWFsYnVtX190ZXh0YXJlYScpLnZhbCgpKTtcclxuICAgICAgZm9ybURhdGEuYXBwZW5kKFwiYWxidW1Db3ZlclwiLCR0aGlzRm9ybS5maW5kKCcuYnRuX191cGxvYWQnKVswXS5maWxlc1swXSk7XHJcblxyXG5cclxuXHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcclxuICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBpZCArICdhZGRBbGJ1bS8nLHRydWUpO1xyXG4gICAgICB4aHIuc2VuZChmb3JtRGF0YSk7XHJcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICBcdHZhciBkYXRhID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgIFx0YWxlcnQoZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICBcdFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH1cclxuXHJcbiAgfSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0Ly8g0JDQvdC40LzQsNGG0LjRjyDQtNC70Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDRhdC10LTQtdGA0LBcclxuXHR2YXIgZWRpdEFsbEhlYWRlciA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgJHRoaXMsXHJcblx0XHRcdFx0ZnJvbnQsXHJcblx0XHRcdFx0YmFjayxcclxuXHRcdFx0XHRoZWFkZXJCb3R0b20sXHJcblx0XHRcdFx0aGVhZGVyQm90dG9tRWRpdDtcclxuXHJcblx0XHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnLmJ0bl9lZGl0LWhlYWRlcicpLm9uKCdjbGljaycsIF9lZGl0SGVhZGVyKTtcclxuXHRcdFx0JCgnI2NhbmNlbF9lZGl0X2hlYWRlcicpLm9uKCdjbGljaycsIF9yZXR1cm5IZWFkZXIpO1xyXG5cdFx0XHQkKCcuYnRuLS1zYXZlJykub24oJ2NsaWNrJywgX3JldHVybkhlYWRlcik7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBfZWRpdEhlYWRlciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0JHRoaXMgPSAkKHRoaXMpO1xyXG5cdFx0XHRmcm9udCA9ICR0aGlzLmNsb3Nlc3QoJy5oZWFkZXJfX3NlY3Rpb24nKTtcclxuXHRcdFx0YmFjayA9IGZyb250Lm5leHQoKTtcclxuXHRcdFx0aGVhZGVyQm90dG9tID0gZnJvbnQucGFyZW50KCkuc2libGluZ3MoKS5jaGlsZHJlbignLmhlYWRlci1ib3R0b20tZnJvbnQnKTtcclxuXHRcdFx0aGVhZGVyQm90dG9tRWRpdCAgPSBoZWFkZXJCb3R0b20ucHJldigpO1xyXG5cclxuXHRcdFx0YmFjay5jc3MoJ3RvcCcsJzAnKTtcclxuXHRcdFx0aGVhZGVyQm90dG9tRWRpdC5jc3MoJ3RyYW5zZm9ybScsJ3RyYW5zbGF0ZVkoMCknKTtcclxuXHRcdFx0ZnJvbnQuZmFkZU91dCg1MDApO1xyXG5cdFx0XHQkKCcuaGVhZGVyLWVkaXQtb3ZlcmxheScpLmZhZGVJbig1MDApO1xyXG5cdFx0XHRoZWFkZXJCb3R0b20uZmFkZU91dCg1MDApO1xyXG5cdFx0fVxyXG5cdFx0dmFyIF9yZXR1cm5IZWFkZXIgPSBmdW5jdGlvbihldikge1xyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRiYWNrLmNzcygndG9wJywnLTEwMCUnKTtcclxuXHRcdFx0aGVhZGVyQm90dG9tRWRpdC5jc3MoJ3RyYW5zZm9ybScsJ3RyYW5zbGF0ZVkoMTAwJSknKTtcclxuXHRcdFx0ZnJvbnQuZmFkZUluKDUwMCk7XHJcblx0XHRcdCQoJy5oZWFkZXItZWRpdC1vdmVybGF5JykuZmFkZU91dCg1MDApO1xyXG5cdFx0XHRoZWFkZXJCb3R0b20uZmFkZUluKDUwMCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm57XHJcblx0XHRcdGluaXQgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRfc2V0VXBMaXN0bmVycygpO1xyXG5cdFx0XHR9LFxyXG5cdFx0fVxyXG59KTtcclxuXHJcblxyXG5cdHZhciBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JCgnLmJ0bl9hbGJ1bS1hZGQnKS5vbignY2xpY2snLCBvcGVuVXBsb2FkKTtcclxuXHRcdCQoJy5idG5fZWRpdC1waG90bycpLm9uKCdjbGljaycsIG9wZW5FZGl0UGhvdG8pO1xyXG5cdFx0JCgnLm1vZGFsX19oZWFkZXItY2xvc2UnKS5vbignY2xpY2snLCBjbG9zZVVwbG9hZCk7XHJcblx0XHQkKHdpbmRvdykub24oJ3Njcm9sbCcsIF9maXhlZEFkZCk7XHJcblx0XHQkKCdib2R5Jykub24oJ2NsaWNrJywnLmltZy1pdGVtJyxfY2FuY2VsTG9hZCk7XHJcblx0fTtcclxuXHJcblxyXG5cclxuICByZXR1cm4ge1xyXG4gIFx0ZWRpdDogZWRpdEFsbEhlYWRlcigpLFxyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgXHRfc2V0VXBMaXN0bmVycygpO1xyXG4gICAgfSxcclxuXHJcbiAgfTtcclxufSkoKTsiLCJmdW5jdGlvbiBpbml0UG9wdXAgKCkge1xyXG5cclxuXHQvLyDQpNGD0L3QutGG0LjRjyDQvtGC0LrRgNGL0YLQuNGPINC/0L7Qv9Cw0L/QsFxyXG5cdGZ1bmN0aW9uIHBvcHVwKGlkLCBhY3Rpb24pIHtcclxuXHRcdHZhciBib2R5ICAgICAgPSAkKCdib2R5Jyk7XHJcblx0XHR2YXIgY2xhc3NOYW1lID0gJ2hpZGUnO1xyXG5cclxuXHRcdGlmKGFjdGlvbiA9PSAnb3BlbicpIHtcclxuXHRcdFx0Ym9keS5hZGRDbGFzcygnbm8tc2Nyb2xsJyk7XHJcblxyXG5cdFx0XHQkKCcjJyArIGlkKVxyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lIClcclxuXHRcdFx0XHQucGFyZW50KClcclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lICk7XHJcblx0XHR9IGVsc2UgaWYoYWN0aW9uID09ICdjbG9zZScpIHtcclxuXHJcblx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ25vLXNjcm9sbCcpO1xyXG5cclxuXHRcdFx0aWYoaWQgPT0gJ2FsbCcpIHtcclxuXHRcdFx0XHQkKCcubW9kYWwnKVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdFx0LnBhcmVudCgpXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyggY2xhc3NOYW1lICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCgnIycgKyBpZClcclxuXHRcdFx0XHRcdC5hZGRDbGFzcyggY2xhc3NOYW1lIClcclxuXHRcdFx0XHRcdC5wYXJlbnQoKVxyXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Ly8g0J7RgtC60YDRi9GC0LjQtSDQv9C+0L/QsNC/0L7QsiDQv9C+INC60LvQuNC60YMg0L3QsCDRjdC70LXQvNC10L3RgtGLINGBINCw0YLRgNC40LHRg9GC0L7QvCBkYXRhLW1vZGFsXHJcblx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLW1vZGFsXScsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0dmFyICRlbCAgICAgPSAkKHRoaXMpO1xyXG5cdFx0XHR2YXIgcG9wdXBJZCA9ICRlbC5hdHRyKCdkYXRhLW1vZGFsJyk7XHJcblxyXG5cdFx0XHRwb3B1cCgnYWxsJywgJ2Nsb3NlJyk7XHJcblx0XHRcdHBvcHVwKHBvcHVwSWQsICdvcGVuJyk7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyDQodC+0LHRi9GC0LjRjyDQv9GA0Lgg0LrQu9C40LrQtSDRjdC70LXQvNC10L3RgiDRgSDQsNGC0YDQuNCx0YPRgtC+0LwgZGF0YS1hY3Rpb249XCJjbG9zZVwiXHJcblx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLWFjdGlvbj1cImNsb3NlXCJdJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR2YXIgYnRuICAgPSAkKHRoaXMpO1xyXG5cdFx0XHR2YXIgbW9kYWwgPSBidG4uY2xvc2VzdCgnLm1vZGFsJyk7XHJcblxyXG5cdFx0XHRwb3B1cChtb2RhbC5hdHRyKCdpZCcpLCAnY2xvc2UnKTtcclxuXHR9KTtcclxuXHJcbn0gLy8gaW5pdFBvcHVwKClcclxuXHJcblxyXG5cclxuaW5pdFBvcHVwKCk7IiwiLy8g0KHQu9Cw0LnQtNC10YBcclxuKGZ1bmN0aW9uKCkge1xyXG5cdHZhciB0cmFuc2l0aW9uRW5kID0gJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCc7XHJcblxyXG5cdGZ1bmN0aW9uIFNsaWRlcihvcHRpb25zKSB7XHJcblx0XHR2YXIgZ2FsbGVyeSAgICAgPSBvcHRpb25zLmVsZW07XHJcblx0XHR2YXIgcHJldiAgICAgICAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2NvbnRyb2wtLXByZXYnKTtcclxuXHRcdHZhciBuZXh0ICAgICAgICA9IGdhbGxlcnkuZmluZCgnLnNsaWRlcl9fY29udHJvbC0tbmV4dCcpO1xyXG5cclxuXHRcdHZhciBzbGlkZXMgICAgICAgICA9IGdhbGxlcnkuZmluZCgnLnNsaWRlcl9faXRlbScpO1xyXG5cdFx0dmFyIGFjdGl2ZVNsaWRlICAgID0gc2xpZGVzLmZpbHRlcignLnNsaWRlcl9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHR2YXIgc2xpZGVzQ250ICAgICAgPSBzbGlkZXMubGVuZ3RoO1xyXG5cdFx0dmFyIGFjdGl2ZVNsaWRlSWR4ID0gYWN0aXZlU2xpZGUuaW5kZXgoKTtcclxuXHJcblx0XHR2YXIgaXNSZWFkeSAgICA9IHRydWU7XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIHNob3dlZFNsaWRlKHNsaWRlciwgaWR4KSB7XHJcblx0XHRcdHNsaWRlclxyXG5cdFx0XHRcdC5lcShpZHgpLmFkZENsYXNzKCdzbGlkZXJfX2l0ZW0tLWFjdGl2ZScpXHJcblx0XHRcdFx0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3NsaWRlcl9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZnVuY3Rpb24gZGF0YUNoYW5nZShkaXJlY3Rpb24pIHtcclxuXHRcdC8vIFx0YWN0aXZlU2xpZGVJZHggPSAoZGlyZWN0aW9uID09PSAnbmV4dCcpID8gZ2V0SWR4KGFjdGl2ZVNsaWRlSWR4LCAnbmV4dCcpIDogZ2V0SWR4KGFjdGl2ZVNsaWRlSWR4LCAncHJldicpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdGZ1bmN0aW9uIGdldElkeChjdXJyZW50SWR4LCBkaXIpIHtcclxuXHRcdFx0aWYoZGlyID09PSAncHJldicpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGN1cnJlbnRJZHggLSAxIDwgMCkgPyBzbGlkZXNDbnQgLSAxIDogY3VycmVudElkeCAtIDEgO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGRpciA9PT0gJ25leHQnKSB7XHJcblx0XHRcdFx0cmV0dXJuIChjdXJyZW50SWR4ICsgMSA+PSBzbGlkZXNDbnQpID8gMCA6IGN1cnJlbnRJZHggKyAxIDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGN1cnJlbnRJZHg7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gY2hhbmdlU2xpZGUoc2xpZGVzLCBkaXJlY3Rpb24sIGNsYXNzTmFtZSkge1xyXG5cdFx0XHR2YXIgY3VycmVudFNsaWRlICAgID0gc2xpZGVzLmZpbHRlcignLnNsaWRlcl9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHRcdHZhciBjdXJyZW50U2xpZGVJZHggPSBjdXJyZW50U2xpZGUuaW5kZXgoKTtcclxuXHRcdFx0dmFyIG5ld1NsaWRlSWR4O1xyXG5cclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XHJcblx0XHRcdFx0IG5ld1NsaWRlSWR4ID0gZ2V0SWR4KGN1cnJlbnRTbGlkZUlkeCwgJ3ByZXYnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcclxuXHRcdFx0XHRuZXdTbGlkZUlkeCA9IGdldElkeChjdXJyZW50U2xpZGVJZHgsICduZXh0Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNsaWRlcy5lcShuZXdTbGlkZUlkeClcclxuXHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXHJcblx0XHRcdFx0Lm9uZSh0cmFuc2l0aW9uRW5kLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCQodGhpcylcclxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoJ3NsaWRlcl9faXRlbS0tYWN0aXZlJylcclxuXHRcdFx0XHRcdFx0LnRyaWdnZXIoJ2NoYW5nZWQtc2xpZGUnKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdGN1cnJlbnRTbGlkZVxyXG5cdFx0XHRcdC5hZGRDbGFzcyggY2xhc3NOYW1lIClcclxuXHRcdFx0XHQub25lKHRyYW5zaXRpb25FbmQsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUgJyArIGNsYXNzTmFtZSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjaGFuZ2VkLXNsaWRlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlzUmVhZHkgPSB0cnVlO1xyXG5cdFx0fSk7XHJcblxyXG5cclxuXHJcblxyXG5cdFx0dGhpcy5wcmV2ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKCAhaXNSZWFkeSApIHJldHVybjtcclxuXHRcdFx0aXNSZWFkeSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0Y2hhbmdlU2xpZGUoc2xpZGVzLCAncHJldicsICdzbGlkZXJfX2l0ZW0tLWFuaW1hdGUtZmFkZScpO1xyXG5cdFx0XHQvLyBkYXRhQ2hhbmdlKCdwcmV2Jyk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLm5leHQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoICFpc1JlYWR5ICkgcmV0dXJuO1xyXG5cdFx0XHRpc1JlYWR5ID0gZmFsc2U7XHJcblxyXG5cdFx0XHRjaGFuZ2VTbGlkZShzbGlkZXMsICduZXh0JywgJ3NsaWRlcl9faXRlbS0tYW5pbWF0ZS1mYWRlJyk7XHJcblx0XHRcdC8vIGRhdGFDaGFuZ2UoJ25leHQnKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHByZXYub24oJ2NsaWNrJywgdGhpcy5wcmV2KTtcclxuXHRcdG5leHQub24oJ2NsaWNrJywgdGhpcy5uZXh0KTtcclxuXHR9IC8vIFNsaWRlclxyXG5cclxuXHJcblxyXG5cdHZhciBzbGlkZXIgPSBuZXcgU2xpZGVyKHtcclxuXHRcdGVsZW06ICQoJyNzbGlkZXInKVxyXG5cdH0pO1xyXG59KSgpOyIsIi8vINCh0L7Qt9C00LDQvdC40LUg0LzQvtC00YPQu9GPLlxyXG4vLyAxKSBD0L7Qt9C00LDQtdC8INGE0LDQudC7INGBINC80L7QtNGD0LvQtdC8INCyINC/0LDQv9C60LUgc291cnNlL2pzL21vZHVsZXNcclxuLy8gMikg0JbQtdC70LDRgtC10LvRjNC90L4g0L3QsNC30YvQstCw0YLRjCDRhNCw0LnQu9GLINGBINC90LjQttC90LXQs9C+INC/0L7QtNGH0LXRgNC60LjQstCw0L3QuNGPKNCn0YLQviDQsdGLINC90LUg0L7RgtGF0L7QtNC40YLRjCDQvtGCINGC0YDQsNC00LjRhtC40LkpXHJcbi8vIDMpINCa0L7Qv9C40YDRg9C10Lwg0YHRgtGA0YPQutGC0YPRgNGDINC40Lcg0YTQsNC50LvQsCBfbG9naW4g0LjQu9C4INC70Y7QsdC+0LPQviDQtNGA0YPQs9C+0LLQviDQvNC+0LTRg9C70Y8o0L3QviDQvdC1IGJhc2UpLlxyXG4vLyA0KSDQsiByZXR1cm4g0LzQvtC00YPQu9GPINC90YPQttC90L4g0LLRgdGC0LDQstC40YLRjCDQvtCx0YrQtdC60YIg0YEg0LzQtdGC0L7QtNC+0LwgaW5pdC5cclxuLy8gNSkg0LIg0LzQtdGC0L7QtCBpbml0INC30LDQv9C40YHRi9Cy0LDQtdC8INGE0YPQvdC60YbQuNC4LCDQutC+0YLQvtGA0YvQtSDQsdGD0LTRg9GCINCy0YvQt9GL0LLQsNGC0YzRgdGPINCw0LLRgtC+0LzQsNGC0LjRh9C10YHQutC4INC/0YDQuCDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQvNC+0LTRg9C70Y8uXHJcbi8vIDYpINCn0YLQviDQsdGLINC/0L7Qu9GD0YfQuNGC0Ywg0LTQvtGB0YLRg9C/INC6INCx0LjQsdC70LjQvtGC0LXQutC1LCDQsiDQvdCw0YfQsNC70LUg0LzQvtC00YPQu9GPINC90YPQttC90L4g0LXQtSDQvtCx0YrRj9Cy0LjRgtGMLCDQvdCw0L/QuNGA0LzQtdGAINGC0LDQuiB2YXIgYmFzZSA9IG5ldyBCYXNlTW9kdWxlO1xyXG4vLyDRgtC10L/QtdGA0Ywg0LLRgdC1INGB0LLQvtC50YHRgtCy0LAg0Lgg0LzQtdGC0L7QtNGLINCx0LjQsdC70LjQvtGC0LXQutC4INC00L7RgdGC0YPQv9C90Ysg0YfQtdGA0LXQtyDRgtC+0YfQutGDLCDQvdCw0L/QuNGA0LzQtdGAINGC0LDQuiBiYXNlLmFqYXhEYXRhKGZvcm0pO1xyXG4vLyA3KSDQkiDQsdC40LHQu9C40L7RgtC10LrRgyDQvNC+0LbQvdC+INC00L7Qv9C40YHRi9Cy0LDRgtGMINCy0YHQtSDRh9GC0L4g0YPQs9C+0LTQvdC+LCDQs9C70LDQstC90L7QtSDRh9GC0L7QsdGLINGE0YPQvdC60YbQuNGPINC90LDRh9C40L3QsNC70LDRgdGMINGBIHRoaXMsINGC0LDQuiDQvNC+0LTRg9C70YwgYmFzZSDRj9Cy0LvRj9C10YLRgdGPINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQvtC8LlxyXG4vLyA4KSDQlNC70Y8g0YLQvtCz0L4g0YfRgtC+0LHRiyDQvNC+0LTRg9C70Ywg0YHQvtCx0YDQsNC70YHRjyDQsiDQvtC00LjQvSDRhNCw0LnQuyBhcHAuanMg0LXQs9C+INC90YPQttC90L4g0L/RgNC+0L/QuNGB0LDRgtGMINCyINCyIGd1bHBmaWxlLmpzLlxyXG4vLyDQlNC+0LrRg9C80LXQvdGC0LDRhtC40Y8g0L/QviDRhNGD0L3RhtC40Y/QvCBiYXNlLCDQsdGD0LTQtdGCINGH0YPRgtGMINC/0L7Qt9C20LUuLi5cclxuXHJcblxyXG5cclxuJCggZG9jdW1lbnQgKS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7IC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LHQuNCx0LvQuNC+0YLQtdC60YMuICjQn9C+0LrQsCDQvdC1INC90YPQttC90L4pXHJcbiAgICBjb21tb25Nb2R1bGUuaW5pdCgpO1xyXG4gICAgbG9naW5Nb2R1bGUuaW5pdCgpO1xyXG4gICAgbWFpblBhZ2VNb2R1bGUuaW5pdCgpO1xyXG4gICAgYWxidW1Nb2R1bGUuaW5pdCgpO1xyXG4gICAgYWxidW1Nb2R1bGUuZWRpdC5pbml0KCk7XHJcbn0pO1xyXG5cclxuXHQvLyDQmtCw0YHRgtC+0LzQvdGL0Lkg0LLQuNC0INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INGE0LDQudC70L7QslxyXG5cdChmdW5jdGlvbigpIHtcclxuXHRcdHZhciBlbCA9ICQoJy51cGxvYWQnKTtcclxuXHJcblx0XHRpZihlbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnVwbG9hZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0dmFyIGVsICAgID0gJCh0aGlzKTtcclxuXHRcdFx0dmFyIGlucHV0ID0gZWwuY2hpbGRyZW4oJ1t0eXBlPWZpbGVdJyk7XHJcblxyXG5cdFx0XHRpbnB1dFswXS5jbGljaygpO1xyXG5cdFx0fSk7XHJcblx0fSkoKTsiXX0=
