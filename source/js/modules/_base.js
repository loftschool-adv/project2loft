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

	/*this.ajax = function(form, url, _method){
			var method = _method || 'POST';
			var data = this.ajaxData(form);
			return $.ajax({
				url: url,
				type: method,
				contentType: 'application/json',
				data: data
			});
	}*/

/*	this.ajax = function(xhr,data,url,method,callback){

			xhr = {

			}


			xhr = new XMLHttpRequest;
      xhr.open(method, url ,true);
      xhr.send(data);
     	console.log(this.xhr);
      xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;
      if (xhr.status == 200) {
      	callback();
      }
    }
	}*/

	this.ajax = function(data, url, callback) {
	  var xhr; // create our XMLHttpRequest object
	  if (window.XMLHttpRequest) {
	    xhr = new XMLHttpRequest();
	  } else if (window.ActiveXObject) {
	    // Internet Explorer is stupid
	    xhr = new
	    ActiveXObject("Microsoft.XMLHTTP");
	  }
	  xhr.open('POST', url);
	  xhr.send(data);

	  xhr.onreadystatechange = function() {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	      callback.call(xhr.responseXML);

	      // call the callback function
	    }
	  };
	  
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