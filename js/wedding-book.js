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
  };
  // smartresize 
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');


var weddingBook = new function () {
	var me = this,
		$jc = {},
		originalHTML = '',
		isBook = false;
	
	me.init = function () {
		
		cacheJquery();
		
		
		
		for (var i=6; i<=16; i++) {
			var $el = $('#' + i + ' .page-container');
			console.log(i, $el.length, $('#' + i ).html());
			if (i % 2 === 0) {
				$el.append('<div href="#' + (i+1) + '" class="next">Next</a>');
			} else {
				$el.append('<div href="#' + (i-1) + '" class="prev">Previous</a>');
			}
		}
		
		
		/* sets up the main nav */
		$('nav a').bind('click', navClickEvent);
		
		originalHTML = $jc.book.html();
		
		resizeEvent();
		
		if (isMobile()) {
			showOnly('home');
		}
		
		
		$(window).smartresize(resizeEvent);
		
		
		startCounter();
		
		gotoHashPage();
		setTimeout(function() {
		  if (location.hash) {
		    window.scrollTo(0, 0);
		  }
		  
		  
		}, 1);
	};
	
	function gotoHashPage() {
		var hash = location.hash;
		if (location.hash !== '') {
			$('a[href="' + hash + '"]').click();
			startCounter();
		}
	}
	
	function cacheJquery() {
		$jc = {
			book: $('#book'),
			window: $(window),
			pages: $('#book > div'),
			counter: $('.counter')
		}
	}
	
	function startCounter () {
		var weddingDate = new Date();
		weddingDate = new Date(2014, 9, 12, 12, 0);
		$jc.counter.countdown({until: weddingDate, format: 'dHMs'});
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
			
		e.preventDefault();
			
		if (isDesktop()) {

			
			location.hash = '#' + pageNum;
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
		console.log($jc.pages.length);
		$jc.pages.each(function(i, el) {
			var $el = $(el);
			console.log('data-for', el.outerHTML, $el.attr('data-for'));
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
	
	function landscapeTouchMoveEvent(e) {
	    e.preventDefault();
	}
	
	function resizeEvent(e) {
		var w = $jc.window.width();
		
		if (isMobile() && isBook && originalHTML !== '') {
			console.error('change to mobile')
			destroyCrappyPlugin($jc.book);
			
			//console.log(originalHTML);
			$jc.book.html(originalHTML).attr('style', '');
			cacheJquery();
			console.log($jc.book[0].outerHTML);
			showOnly('home');
			isBook = false;
			gotoHashPage();
			
			// prevent scrolling of page
			$(document).unbind('touchmove', landscapeTouchMoveEvent);
			
		} else if (isDesktop() && !isBook){
			console.error('change to desktop')
			cacheJquery();
			$jc.book.turn({gradients: true, acceleration: true});
			isBook = true;
			gotoHashPage();
			$(document).bind('touchmove', landscapeTouchMoveEvent);
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
};

weddingBook.init();
