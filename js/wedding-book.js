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


if (!window.console) {
	window.console = {
		log: function () {}
	}
}

var weddingBook = new function () {
	var me = this,
		$jc = {},
		originalHTML = '',
		isBook = false,
		isOldIE;
	
	me.init = function () {
		
		cacheJquery();
		isOldIE = $jc.body.hasClass('ie8down');
		// before doing anything else
		$('#mobile-menu').html($('#desktop-menu').html());;
		var sb = [];
		$('.no-mobile .photos').each(function(i, el) {
			sb.push(el.innerHTML);
		});
		$('#mobile-photos').html(sb.join(''));
		
		$(window).load(loadEvent);
		
		for (var i=6; i<=19; i++) {
			var $el = $('#' + i + ' .page-container');
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
		
		
		gotoHashPage();
		setTimeout(function() {
		  if (location.hash) {
		    window.scrollTo(0, 0);
		  }
		  
		  
		}, 1);
	};
	
	function loadEvent(e) {
	    $jc.body.addClass('loaded');
	    visibleIf.init(true);   
	}
	
	me.load = function () {
	    
	}
	
	function gotoHashPage() {
		var hash = location.hash;
		if (location.hash === '' ) {
			startCounter();
		} else { 
			$('a[href="' + hash + '"]').click();
			
		}
	}
	
	function cacheJquery() {
		$jc = {
		    body: $('body'),
		    nav: $('nav ul'),
			book: $('#book'),
			window: $(window),
			pages: $('#book > div'),
			counter: $('.counter'),
			bookContainer: $('#book-container')
		}
	}
	
	function startCounter () {
		var weddingDate = new Date();
		weddingDate = new Date(2014, 9, 12, 12, 0);
		
		$('.counter').removeClass('is-countdown').html('').countdown({until: weddingDate, format: 'dHMs'});
	}
	
	function isMobile() {
		var w = $jc.window.width();
		return (w < 1000 || isOldIE);
	}
	
	function isDesktop() {
		var w = $jc.window.width();
		return (w >= 1000 && !isOldIE);
	}
	
	function navClickEvent(e) {
		var target = e.currentTarget,
			pageNum = parseInt(target.href.split('#')[1]);
			
			
		if (isDesktop()) {

			
			e.preventDefault();
			location.hash = '#' + pageNum;
			e.preventDefault();
			//alert(target.href);
			
			$jc.book.turn('page', pageNum);
			
		} else {
			
			// show only the relavent pages
			
			var dataFor = $(target).attr('id');
			showOnly(dataFor);
			
			if (dataFor == 'rsvp' || dataFor == 'music') {
				visibleIf.init(true);
			}
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
	
	function landscapeTouchMoveEvent(e) {
	    e.preventDefault();
	}
	
	function resizeEvent(e) {
		var w = $jc.window.width();
		//console.log($jc.nav.height());
		$jc.body.css('padding-top', isMobile()?$jc.nav.outerHeight():0)
		if (isMobile())  {
			if (isBook && originalHTML !== '') {
				destroyCrappyPlugin($jc.book);
				
				//console.log(originalHTML);
				$jc.book.html(originalHTML).attr('style', '');
				cacheJquery();
				showOnly('home');
				isBook = false;
				gotoHashPage();
				
				// prevent scrolling of page
				$(document).unbind('touchmove', landscapeTouchMoveEvent);
				
				// reinitialize webforms
				if (window.$wf2) {
					html5Forms.setupExtraFeatures();
					$wf2.init(true);
					
				}
			} 
			
			// change all iframe sizes to appropriate viewport size
			var iframeSize = $(window).width() - 20;
			
			if (iframeSize > 390) {
				iframeSize = 390;
			}
			
			$('iframe').attr('width', iframeSize);
			
				startCounter();	
		} else if (isDesktop() && !isBook){
			cacheJquery();
			$jc.book.turn({gradients: true, acceleration: true})
				.bind('turned', pageTurnedEvent);
			isBook = true;
			gotoHashPage();
			$(document).bind('touchmove', landscapeTouchMoveEvent);
			$('iframe').attr('width', '390');
		}
	}
	
	function pageTurnedEvent(e, page, view) {
		var isOnFormPage = ($('.form-page').length > 0);
		if (page === 1) {
			
			startCounter();
		} else if (isOnFormPage) {
			visibleIf.init(true);
		}
	}
	
	var destroyCrappyPlugin = function($elem, eventNamespace) {
	    var isInstantiated  = !! $.data($elem.get(0));
	 	if (isInstantiated) {
	        $.removeData($elem.get(0));
	       
	        $elem.off(eventNamespace);
	        $elem.unbind('.' + eventNamespace);
	    }
	};
};

weddingBook.init();
