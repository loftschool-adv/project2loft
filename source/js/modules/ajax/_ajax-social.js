// =========== ajax social module ===========
// Этот модуль содержит в себе скрипты которые редактирует социальные сети плользователя

var ajaxSocialModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  //Общие переменные

  // Прослушка событий

  var $header = $('.header-main');
  var $headerFront = $header.find('header__section_main-front');
  var $headerBack = $header.find('.header__section_main-back');
  var $inputs = $headerBack.find('.field');
  var id = window.location.pathname;

  // Соц.сети

  var soc_vk = $inputs.filter('.input__vk');
  var soc_fb = $inputs.filter('.input__facebook');
  var soc_tw = $inputs.filter('.input__twitter');
  var soc_plus = $inputs.filter('.input__google-plus');
  var soc_email = $inputs.filter('.input__email');

  // Кнопки
  var vk_save = soc_vk.closest('.form__row').next().find('.social--save');
  var vk_reset = soc_vk.closest('.form__row').next().find('.social--reset');

  var fb_save = soc_fb.closest('.form__row').next().find('.social--save');
  var fb_reset = soc_fb.closest('.form__row').next().find('.social--reset');

  var tw_save = soc_tw.closest('.form__row').next().find('.social--save');
  var tw_reset = soc_tw.closest('.form__row').next().find('.social--reset');

  var plus_save = soc_plus.closest('.form__row').next().find('.social--save');
  var plus_reset = soc_plus.closest('.form__row').next().find('.social--reset');

  var email_save = soc_email.closest('.form__row').next().find('.social--save');
  var email_reset = soc_email.closest('.form__row').next().find('.social--reset');


  var setSocValue = function(e){
    e.preventDefault();
    var $this = $(this);
    var input = $this.closest('.form__row').prev().find('input');
    var patter = base.RegPatterns.link;
    var dataInput= {
      link: input.val(),
      name: 'vk',
      title: 'Вконтакте',
    };

    if(!patter.test(input.val())){
      alert('не правильный формат ссылки');
      return;
    }

    $.ajax({
       url: id + 'changeSocial/',
       type: "POST",
       processData: true,
       dataType: 'json',
       data: dataInput,
       success: function(res){
        input.attr('placeholder',res[dataInput.name].link);
        input.closest('.drop--def').find('.social__btn').attr('href',res[dataInput.name].link).attr('title',res[dataInput.name].name);
        console.log(res[dataInput.name]);
        console.log(input.closest('.drop--def').find('.social__btn'));
       }
    });
    

  };

  var _setUpListner = function(){
    vk_save.on('click',setSocValue)
  }




 

  return {
    init: function () {
      _setUpListner();
    },
    
  };
})();