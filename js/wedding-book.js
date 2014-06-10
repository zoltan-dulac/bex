/*
 * From: http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/
 */

(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize 
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');


var weddingBook = new function () {
	var me = this,
		$jc = {},
		originalHTML = '',
		isBook = false;
	
	me.init = function () {
		$jc = {
			book: $('#book'),
			window: $(window),
			pages: $('#book > div')
		}
		
		originalHTML = $jc.book.html();
		resizeEvent();
		
		if (isMobile()) {
			showOnly('home');
		}
		
		/* sets up the main nav */
		$('nav a').bind('click', navClickEvent);
		
		$(window).smartresize(resizeEvent)
	}
	
	function isMobile() {
		var w = $jc.window.width();
		return w < 1024;
	}
	
	function isDesktop() {
		var w = $jc.window.width();
		return w >= 1024;
	}
	
	function navClickEvent(e) {
		var target = e.currentTarget,
			pageNum = parseInt(target.href.split('#')[1]);
		if (isDesktop()) {

			e.preventDefault();
			
			//alert(target.href);
			$jc.book.turn('page', pageNum);
		} else {
			
			// show only the relavent pages
			var dataFor = $(target).attr('id');
			showOnly(dataFor);
		}
	}
	
	function showOnly(dataFor) {
		
		$jc.pages.each(function(i, el) {
			var $el = $(el);
			if ($el.attr('data-for') === dataFor) {
				$el.removeClass('hide');
			} else {
				$el.addClass('hide');
			}
		});
		setTimeout(function () {
			window.scrollTo(0, 0);
		}, 100);
		
	}
	
	function resizeEvent(e) {
		var w = $jc.window.width();
		
		if (isMobile() && isBook && originalHTML !== '') {
			//$jc.book.turn('destroy');
			// destroy jquery plugin. From http://ub4.underblob.com/remove-jquery-plugin-instance/
			destroyCrappyPlugin($jc.book);
			
			$jc.book.html(originalHTML).attr('style', '');
			showOnly('home');
			isBook = false;
		} else if (isDesktop() && !isBook){
			$jc.book.turn({gradients: true, acceleration: true});
			isBook = true;
		}
	}
	
	var destroyCrappyPlugin = function($elem, eventNamespace) {
	    var isInstantiated  = !! $.data($elem.get(0));
	 	console.log('hmmm', isInstantiated);
	    if (isInstantiated) {
	        $.removeData($elem.get(0));
	        console.log(
			    '$element events:',
			    $._data($elem.get(0), 'events')
			);
	        $elem.off(eventNamespace);
	        $elem.unbind('.' + eventNamespace);
	    }
	};
}

weddingBook.init();
