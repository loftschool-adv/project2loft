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

  var soc_vk_old = soc_vk.val();
  var soc_fb_old = soc_fb.val();
  var soc_tw_old = soc_tw.val();
  var soc_plus_old = soc_plus.val();
  var soc_email_old = soc_email.val();

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


  var setSocValue = function(e,btn,s_name,s_title){
    e.preventDefault();
    var $this = btn;
    var input = $this.closest('.form__row').prev().find('input');
    var patterLink = base.RegPatterns.link;
    var patterEmail = base.RegPatterns.email;
    var socialVeiw = $('.social--veiw');
    var test = socialVeiw.find('.social__' + s_name)
    var dataInput= {
      link: input.val(),
      name: s_name,
      title: s_title,
    };

    

    if(!patterLink.test(input.val()) && (s_name != 'email')){
      alert('не правильный формат ссылки');
      return;
    }else if(!patterEmail.test(input.val()) && (s_name == 'email')){
      alert('не правильный email');
      return;
    }

    $.ajax({
       url: id + 'changeSocial/',
       type: "POST",
       processData: true,
       dataType: 'json',
       data: dataInput,
       success: function(res){
        if(s_name == 'email'){
          socialVeiw.find('.social__' + s_name).attr('href','mailto:' + res[dataInput.name].link);
        }else{
          socialVeiw.find('.social__' + s_name).attr('href',res[dataInput.name].link);
        }
        socialVeiw.find('.social__' + s_name).attr('title',res[dataInput.name].title);
       }
    });
    

  };

  var _setUpListner = function(){

    // Иконки ссылок на главной

    $('.social__btn').on('click',function(e){
      var link = $(this).attr('href');
      if(!(link.indexOf('http') + 1)){
        e.preventDefault();
      }
    })

    // Кнопки сохранить
    vk_save.on('click',function(e){
      setSocValue(e,$(this),'vk','Вконтакте');
    })

    fb_save.on('click',function(e){
      setSocValue(e,$(this),'facebook','Facebook');
    })

    tw_save.on('click',function(e){
      setSocValue(e,$(this),'twitter','Twitter');
    })

    plus_save.on('click',function(e){
      setSocValue(e,$(this),'google','Google+');
    })

    email_save.on('click',function(e){
      setSocValue(e,$(this),'email','Email');
    })

    // Кнопка отменить

    vk_reset.on('click',function(e){
      e.preventDefault();
      $(this).closest('.form').find('input').val(soc_vk_old)
    })


    fb_reset.on('click',function(e){
      e.preventDefault();
      $(this).closest('.form').find('input').val(soc_fb_old)
    })

    tw_reset.on('click',function(e){
      e.preventDefault();
      $(this).closest('.form').find('input').val(soc_tw_old)
    })

    plus_reset.on('click',function(e){
      e.preventDefault();
      $(this).closest('.form').find('input').val(soc_plus_old)
    })

    email_reset.on('click',function(e){
      e.preventDefault();
      $(this).closest('.form').find('input').val(soc_email_old)
    })


  }




 

  return {
    init: function () {
      _setUpListner();
    },
    
  };
})();