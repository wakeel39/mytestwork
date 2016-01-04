<?php 
$js_file_name = $asset_js . "jquery.scrollTo.js";
$js_string = "/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);";
//if (!file_exists($js_file_name)) {
$file_name = fopen($js_file_name, 'a');
fwrite($file_name, $js_string);
fclose($file_name);

//create scirpt js 
$js_file_name = $asset_js . "jquery.ajax-cross-origin.min.js";
$js_string = '/*
 jQuery AJAX Cross Origin v1.3 (http://www.ajax-cross-origin.com) 
 jQuery plugin to bypass Same-origin_policy using Google Apps Script. 
 
 references:
 http://en.wikipedia.org/wiki/Same-origin_policy
 http://www.google.com/script/start/
 
 (c) 2014, Writen by Erez Ninio. site: www.dealhotelbook.com
 
 Licensed under the Creative Commons Attribution 3.0 Unported License. 
 For details, see http://creativecommons.org/licenses/by/3.0/.
*/

var proxyJsonp="https://script.google.com/macros/s/AKfycbwmqG55tt2d2FcT_WQ3WjCSKmtyFpkOcdprSITn45-4UgVJnzp9/exec";
jQuery.ajaxOrig=jQuery.ajax;jQuery.ajax=function(a,b){function d(a){a=encodeURI(a).replace(/&/g,"%26");return proxyJsonp+"?url="+a+"&callback=?"}var c="object"===typeof a?a:b||{};c.url=c.url||("string"===typeof a?a:"");var c=jQuery.ajaxSetup({},c),e=function(a,c){var b=document.createElement("a");b.href=a;return c.crossOrigin&&"http"==a.substr(0,4).toLowerCase()&&"localhost"!=b.hostname&&"127.0.0.1"!=b.hostname&&b.hostname!=window.location.hostname}(c.url,c);c.proxy&&0<c.proxy.length&&(proxyJsonp=c.proxy,"object"===typeof a?
a.crossDomain=!0:"object"===typeof b&&(b.crossDomain=!0));e&&("object"===typeof a?a.url&&(a.url=d(a.url),a.charset&&(a.url+="&charset="+a.charset),a.dataType="json"):"string"===typeof a&&"object"===typeof b&&(a=d(a),b.charset&&(a+="&charset="+b.charset),b.dataType="json"));return jQuery.ajaxOrig.apply(this,arguments)};jQuery.ajax.prototype=new jQuery.ajaxOrig;jQuery.ajax.prototype.constructor=jQuery.ajax;';

$file_name = fopen($js_file_name, 'a');
fwrite($file_name, $js_string);
fclose($file_name);


// create script js files 
$js_file_name = $asset_js . "script.js";
$js_string = "/*!
 * Documenter 2.0
 * http://rxa.li/documenter
 *
 * Copyright 2011, Xaver Birsak
 * http://revaxarts.com
 *
 */
 
$(document).ready(function() {
	var timeout,
		sections = new Array(),
		sectionscount = 0,
		win = $(window),
		sidebar = $('#documenter_sidebar'),
		nav = $('#documenter_nav'),
		logo = $('#documenter_logo'),
		navanchors = nav.find('a'),
		timeoffset = 50,
		hash = location.hash || null;
		iDeviceNotOS4 = (navigator.userAgent.match(/iphone|ipod|ipad/i) && !navigator.userAgent.match(/OS 5/i)) || false,
		badIE = $('html').prop('class').match(/ie(6|7|8)/)|| false;
		
	//handle external links (new window)
	$('a[href^=http]').bind('click',function(){
		window.open($(this).attr('href'));
		return false;
	});
	
	//IE 8 and lower doesn't like the smooth pagescroll
	if(!badIE){
		window.scroll(0,0);
		
		$('a[href^=#]').bind('click touchstart',function(){
			hash = $(this).attr('href');
			$.scrollTo.window().queue([]).stop();
			goTo(hash);
			return false;
		});
		
		//if a hash is set => go to it
		if(hash){
			setTimeout(function(){
				goTo(hash);
			},500);
		}
	}
	
	
	//We need the position of each section until the full page with all images is loaded
	win.bind('load',function(){
		
		var sectionselector = 'section';
		
		//Documentation has subcategories		
		if(nav.find('ol').length){
			sectionselector = 'section, h4';
		}
		//saving some information
		$(sectionselector).each(function(i,e){
			var _this = $(this);
			var p = {
				id: this.id,
				pos: _this.offset().top
			};
			sections.push(p);
		});
		
		
		//iPhone, iPod and iPad don't trigger the scroll event
		if(iDeviceNotOS4){
			nav.find('a').bind('click',function(){
				setTimeout(function(){
					win.trigger('scroll');				
				},duration);
				
			});
			//scroll to top
			window.scroll(0,0);
		}

		//how many sections
		sectionscount = sections.length;
		
		//bind the handler to the scroll event
		win.bind('scroll',function(event){
			clearInterval(timeout);
			//should occur with a delay
			timeout = setTimeout(function(){
				//get the position from the very top in all browsers
				pos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
				
				//iDeviceNotOS4s don't know the fixed property so we fake it
				if(iDeviceNotOS4){
					sidebar.css({height:document.height});
					logo.css({'margin-top':pos});
				}
				//activate Nav element at the current position
				activateNav(pos);
			},timeoffset);
		}).trigger('scroll');

	});
	
	//the function is called when the hash changes
	function hashchange(){
		goTo(location.hash, false);
	}
	
	//scroll to a section and set the hash
	function goTo(hash,changehash){
		win.unbind('hashchange', hashchange);
		hash = hash.replace(/!\//,'');
		win.stop().scrollTo(hash,duration,{
			easing:easing,
			axis:'y'			
		});
		if(changehash !== false){
			var l = location;
			location.href = (l.protocol+'//'+l.host+l.pathname+'#!/'+hash.substr(1));
		}
		win.bind('hashchange', hashchange);
	}
	
	
	//activate current nav element
	function activateNav(pos){
		var offset = 100,
		current, next, parent, isSub, hasSub;
		win.unbind('hashchange', hashchange);
		for(var i=sectionscount;i>0;i--){
			if(sections[i-1].pos <= pos+offset){
				navanchors.removeClass('current');
				current = navanchors.eq(i-1);
				current.addClass('current');
				
				parent = current.parent().parent();
				next = current.next();
				
				hasSub = next.is('ul');
				isSub = !parent.is('#documenter_nav');
				
				nav.find('ol:visible').not(parent).slideUp('fast');
				if(isSub){
					parent.prev().addClass('current');
					parent.stop().slideDown('fast');
				}else if(hasSub){
					next.stop().slideDown('fast');
				}
				win.bind('hashchange', hashchange);
				break;
			};
		}	
	}
	
    // make code pretty
    window.prettyPrint && prettyPrint();
	
});

function FormSubmitData(id) {


    var formData = $('#f_'+id);
	console.log('serlize data',formData.serialize());
    $.ajax({
		dataType: 'text',
        //url: formData.attr('action'),
        //type: formData.attr('method'),
		url: 'getdata.php',
        type: 'GET',
        data: formData.serialize(),
		crossOrigin: true,
        async: true,
		//beforeSend: setHeader,
        success: function (data) {
			console.log('success',JSON.parse(data));
             //JSON.parse(data);
        },
      
    });

    return false;

}


";
//if (!file_exists($js_file_name)) {
$file_name = fopen($js_file_name, 'a');
fwrite($file_name, $js_string);
fclose($file_name);
//}




?>