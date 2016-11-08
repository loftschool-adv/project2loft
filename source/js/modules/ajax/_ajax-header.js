// =========== ajax header module ===========
// Этот модуль содержит в себе ajax применяемые к шапкам страницы

var ajaxHeaderModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  // Общие
  var $header = $('.header-main');
  var id = window.location.pathname;
  var closeEditHeader = headerModule.closeEditHeader();
  var headerFront = $header.find('.header__section_main-front');
  var headerBack = $header.find('.header__section_main-back');
  var ajaxFlag = false;
  var thisAjax;

  

  // Кнопки
  var saveBtn = $header.find('.btn--save');
  var uploadAvatar = $header.find('.user-block__photo-edit');
  var uploadBg = $header.find('.header__part--zip_main .upload');
  var cancelBtn = $header.find('#cancel_edit_header');

  //Классы

  var classCancel = 'cancel';

   // Дефолные стили

  var headerBgStyle = $header.attr('style');
  var avatarOldStyle = $header.attr('style');




   // Функции
  var setData = function(formData){
  	var $headrBack = $header.find('.header__section_main-back');
  	var inputName = $headrBack.find('input[name="name"]');
  	var inputAbout = $headrBack.find('textarea[name = "desc"]');
    var inputAvatar = $headrBack.find('input[name="photo"]')[0].files[0];
  	
  	formData.append("userName",inputName.val());
  	formData.append("userAbout",inputAbout.val());
    formData.append("userAvatar",inputAvatar);
  	return formData;
  
  }

  // Заблокировать выбор файла
  var lockSelFile = function(e){
  	if(ajaxFlag){
  		e.preventDefault();
  	}
  }


  // Превью аваттарки
  var changeAvatar = function(){
  	if(ajaxFlag){
  		ajaxFlag = false;
  		return;
  	}
  	ajaxFlag = true;
  	var formData = new FormData();
  	var $this = $(this);
  	var blockPhoto = $this.closest('.user-block__photo');
  	var fileInput = $this.find('input[name="photo"]');
  	var photo = fileInput[0].files[0];
  	if(!photo){
  		ajaxFlag = false;
  		blockPhoto.removeAttr('style');
  		return;
  	}

  	blockPhoto.addClass('loader');
  	formData.append("userAvatar",photo);

  	thisAjax = $.ajax({
	    url: id + 'changePhoto/',
	    type: "POST",
	    data: formData,
	    processData: false,
	    contentType: false,
	    success: function(res){
	    	ajaxFlag = false;
	      blockPhoto.removeClass('loader');
	      blockPhoto.css({
	      	'background-image': 'url('+ res.newAvatarCover +')'
	      })
	    }
		});


  }

  // Превью бекраунда
  var changeBackGround = function(){
  	if(ajaxFlag){
  		return;
  	}
  	ajaxFlag = true;
  	var formData = new FormData();
  	var $this = $(this);
  	var fileInput = $this.find('input[name="bg"]');
  	var photo = fileInput[0].files[0];
  	if(!photo){
  		$header.attr('style',headerBgStyle);
  		ajaxFlag = false;
  		return;
  	}

  	$header.addClass('loader');
  	formData.append("userBackGround",photo);
  	thisAjax = $.ajax({
	    url: id + 'changePhoto/',
	    type: "POST",
	    data: formData,
	    processData: false,
	    contentType: false,
	    success: function(res){
	      $header.removeClass('loader');
	      ajaxFlag = false;
	      	$header.css({
	      		'background-image': 'url('+ res.newAvatarCover +')'
	      	})    
	    }
		});
		
  }

  // Скидываем бекраунд и аватар при отмене
  var resetPreview = function(){
  	var blockPhoto = headerBack.find('.user-block__photo');
  	ajaxFlag = false;
  	$header.removeClass('loader');
  	$header.attr('style',headerBgStyle);
  	blockPhoto.removeClass('loader');
  	blockPhoto.removeAttr('style');

  	//$header.addClass(classCancel);
    if(thisAjax){
      thisAjax.abort();
    }
  }

  

  // Отправляем запрос на editUserData
 var requestToServer = function(e){
  var formData = new FormData();
  $.ajax({
      url: id + 'editUserData/',
      type: "POST",
      data: setData(formData),
      processData: false,
      contentType: false,
      cache: false,
      success: function(res){
        // Выводим данные с сервера
        headerFront.find('.user-block__name').text(res.name);
        headerFront.find('.user-block__desc').text(res.about);
        console.log(res.avatar);
        headerFront.find('.user-block__photo').css({
          'background-image': 'url(' + res.avatar + '), url(../img/album/no_photo.jpg)'
        })
        closeEditHeader(e);
      }
    });
  }

  var _setUplistner = function(){
  	uploadAvatar.on('change',changeAvatar);
  	uploadBg.on('change',changeBackGround);
  	cancelBtn.on('click',resetPreview);
  	uploadBg.on('click',lockSelFile);
  	uploadAvatar.find('input').on('click',lockSelFile);
  	saveBtn.on('click',requestToServer);
  }


  // Общиие переменные

  return {
    init: function () {
    	_setUplistner();
    },

  };
})();