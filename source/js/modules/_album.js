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
		base.changeClass('.modal-container','hide','del')
	};


	// Закрыть окно для загрузки изображений
	var closeUpload = function(){
		base.changeClass('.modal-container','hide','add')
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
        	if ($.isEmptyObject(xhr.response)) {
					  alert(xhr.response);
					}
        	
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
		$('.modal__header-close').on('click', closeUpload);
		$(window).on('scroll', _fixedAdd);
	};

	

  return {
  	edit: editAllHeader(),
    init: function () {
    	_setUpListners();
    },
    
  };
})();