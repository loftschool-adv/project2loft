// =========== Base module ===========

var BaseModule = function(){

	//====== Объекты,массивы ======
	this.errors = {
  	0 : 'Заполнены не все поля',
  	1 : 'Введите корректный e-mail',
  	2	: 'Длина пароля меньше 8 символов',
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
		// Функция проверяет корректность email по регулярному выражению
		// Принимает два аргумента:
		// 1) input в виде массива (jquery).
		// 2) шаблон для проверка.
		// Возвращает true или false
		return patter.test(input.val());
	};

	this.validPass = function(input,length){
		// Функция проверяет длинну пароля
		var len = length || 8;
		if(!(input.val().length < len)){
			return true;
		}
	};
	
	this.validateForm = function(form) {
		// Функция проверяет форму на валидность пароля
		// При ошибках возвращает массив с номерами ошибок,
		// который описан выше.(this.errors)
		// Возвращает пустой массив если все в порядке.
		var thisModule = this;
		var pattern = thisModule.RegPatterns.email;
		var $thisForm = form;
		var elements = $thisForm.find('input');
		var errors = thisModule.errors;
		var output = [];

		$.each(elements, function(){
			if(!$(this).val()){
				output.push(0);
				return false;	
			}
		});

		if(output.length == 0){
			$.each(elements, function(index,elem){
				var $this = $(this);
				var type = $this.attr('type');
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
					case 'login' :
						// Проверка на логин
						break;
					default:
						return true;
				}
			})
		}

		return output;
	};

	this.clearInputs = function(form){
		var elem = form.find('input[type != submit],textarea');
		elem.val('');
	}

	

};