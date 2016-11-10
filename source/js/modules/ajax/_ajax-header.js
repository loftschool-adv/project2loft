// =========== ajax header module ===========
// Этот модуль содержит в себе ajax применяемые к шапкам страницы

var ajaxHeaderModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  // Общие
  var $header = $('.header-main');
  var $footer = $('.footer');
  var id = window.location.pathname;
  var closeEditHeader = headerModule.closeEditHeader();
  var headerFront = $header.find('.header__section_main-front');
  var headerBack = $header.find('.header__section_main-back');
  var ajaxFlag = false;
  var thisAjax;

  var newBackGround;



  // Кнопки
  var saveBtn = $header.find('.btn--save');
  var uploadAvatar = $header.find('.user-block__photo-edit');
  var uploadBg = $header.find('.header__part--zip_main .upload');
  var cancelBtn = $header.find('#cancel_edit_header');

  //Классы

  var classCancel = 'cancel';

   // Дефолные стили

  var headerBgStyle = $header.attr('style');
  var footerBgStyle = $footer.attr('style');




   // Функции
  /*var setData = function(formData){
    var inputAvatar = $headrBack.find('input[name="photo"]')[0].files[0];
    var inputBG = $headrBack.find('input[name="bg"]')[0].files[0];
  	
    formData.append("userAvatar",inputAvatar);
    formData.append("userBackGround",inputBG);
  	return formData;

  }*/

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
    console.log(photo);
  	if(!photo){
  		ajaxFlag = false;
      var frontAvatar = headerFront.find('.user-block__photo').attr('style');
  		blockPhoto.attr('style',frontAvatar);
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
        	'background-image': 'url('+ res.newCover +')'
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
    //var headerBackground = attr('style');
  	 $header.css({
        'background-image' : 'url('+ newBackGround +')'
      });
     $footer.css({
        'background-image' : 'url('+ newBackGround +')'
      });
  	ajaxFlag = false;
  	return;
  }
  $header.find('.preload__container').addClass('active')
  formData.append("userBackGround",photo);
  thisAjax = $.ajax({
    url: id + 'changePhoto/',
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function(res){
      $header.find('.preload__container').removeClass('active')
      ajaxFlag = false;
      	$header.css({
      		'background-image': 'url('+ res.newCover +')'
      	})
        $footer.css({
          'background-image': 'url('+ res.newCover +')'
        })  

    }
  });

  }

  // Скидываем бекраунд и аватар при отмене
  var resetPreview = function(){
  	var blockPhotoBack = headerBack.find('.user-block__photo');
    var frontAvatar = headerFront.find('.user-block__photo').attr('style');
    if(newBackGround){
      $header.css({
        'background-image' : 'url('+ newBackGround +')'
      })
      $footer.css({
        'background-image' : 'url('+ newBackGround +')'
      })
    }else{
      $header.attr('style',headerBgStyle);
      $footer.attr('style',headerBgStyle)
    }    
  	ajaxFlag = false;
  	$header.removeClass('loader');
  	
  	blockPhotoBack.removeClass('loader');
    console.log(frontAvatar);
  	blockPhotoBack.attr('style',frontAvatar);

  	//$header.addClass(classCancel);
    if(thisAjax){
      thisAjax.abort();
    }
    $.ajax({
      url: id + 'clearTmp/',
      type: "POST",
      data: {clear: 'clearHeader'},
      dataType: 'json'
    });
  }



  // Отправляем запрос на editUserData
  var requestToServer = function(e){
  e.preventDefault();
  var $headrBack = $header.find('.header__section_main-back');
  var inputName = $headrBack.find('input[name="name"]');
  var inputAbout = $headrBack.find('textarea[name = "desc"]');
  var outputData = {
    userName: inputName.val(),
    userAbout: inputAbout.val()
  }
  $header.find('.preload__container').addClass('active')
  $.ajax({
      url: id + 'editUserData/',
      type: "POST",
      data: outputData,
      dataType: 'json',
      success: function(res){
        // Выводим данные с сервера
        headerFront.find('.user-block__name').text(res.name);
        headerFront.find('.user-block__desc').text(res.about);
        $header.find('.preload__container').removeClass('active');
        headerFront.find('.user-block__photo').css({
          'background-image' : 'url(' + res.avatarFile + '), url(../img/album/no_photo.jpg)'
        });
        newBackGround = res.backGroundFile;
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