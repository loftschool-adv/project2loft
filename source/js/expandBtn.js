function expandBtn () {

	function getWidth(element) {
		var width;

		element.css('width', 'auto');
		width = element.width();
		element.css('width', '');

		return width;
	}


	$(document).on('mouseenter', '.btn--expand', function(e) {
		var btn = $(this);
		btn.width( getWidth(btn) );
	});

	$(document).on('mouseleave', '.btn--expand', function(e) {
		var btn = $(this);
		btn.width('');
	});

} // expandBtn()



expandBtn();