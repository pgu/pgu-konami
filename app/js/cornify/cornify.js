/**
 *
 * From http://www.cornify.com/js/cornify.js
 *
 */
(function ($, window) {


    var cornify_count = 0;

    function cornify_add_one(endAnimationCallback) {
        cornify_count += 1;
        var cornify_url = 'http://www.cornify.com/';
        var div = document.createElement('div');
        div.style.position = 'fixed';

        var numType = 'px';
        var heightRandom = Math.random()*.75;
        var windowHeight = 768;
        var windowWidth = 1024;
        var height = 0;
        var width = 0;
        var de = document.documentElement;
        if (typeof(window.innerHeight) == 'number') {
            windowHeight = window.innerHeight;
            windowWidth = window.innerWidth;
        } else if(de && de.clientHeight) {
            windowHeight = de.clientHeight;
            windowWidth = de.clientWidth;
        } else {
            numType = '%';
            height = Math.round( height*100 )+'%';
        }

        div.onclick = cornify_add_one;
        div.style.zIndex = 10;
        div.style.outline = 0;

        if( cornify_count==10 ) {
            div.style.top = Math.max( 0, Math.round( (windowHeight-530)/2 ) )  + 'px';
            div.style.left = Math.round( (windowWidth-530)/2 ) + 'px';
            div.style.zIndex = 1000;
        } else {
            if( numType=='px' ) div.style.top = Math.round( windowHeight*heightRandom ) + numType;
            else div.style.top = height;
            div.style.left = Math.round( Math.random()*90 ) + '%';
        }

        var img = document.createElement('img');
        var currentTime = new Date();
        var submitTime = currentTime.getTime();
        if( cornify_count==15 ) submitTime = 0;
        img.setAttribute('src',cornify_url+'getacorn.php?r=' + submitTime + '&url='+document.location.href);
        var ease = "all .1s linear";
        //div.style['-webkit-transition'] = ease;
        //div.style.webkitTransition = ease;
        div.style.WebkitTransition = ease;
        div.style.WebkitTransform = "rotate(1deg) scale(1.01,1.01)";
        //div.style.MozTransition = "all .1s linear";
        div.style.transition = "all .1s linear";
        div.onmouseover = function() {
            var size = 1+Math.round(Math.random()*10)/100;
            var angle = Math.round(Math.random()*20-10);
            var result = "rotate("+angle+"deg) scale("+size+","+size+")";
            this.style.transform = result;
            //this.style['-webkit-transform'] = result;
            //this.style.webkitTransform = result;
            this.style.WebkitTransform = result;
            //this.style.MozTransform = result;
            //alert(this + ' | ' + result);
        }
        div.onmouseout = function() {
            var size = .9+Math.round(Math.random()*10)/100;
            var angle = Math.round(Math.random()*6-3);
            var result = "rotate("+angle+"deg) scale("+size+","+size+")";
            this.style.transform = result;
            //this.style['-webkit-transform'] = result;
            //this.style.webkitTransform = result;
            this.style.WebkitTransform = result;
            //this.style.MozTransform = result;
        }

        var isContainerHere = $('#unicorns').length;
        if (!isContainerHere) {
            var container = $('<div id="unicorns" />');
            container.appendTo('body');
        }

        $('#unicorns').append(div);
        div.appendChild(img);

        // Add stylesheet.
        if (cornify_count == 5) {
            var cssExisting = document.getElementById('__cornify_css');
            if (!cssExisting) {
                var head = document.getElementsByTagName("head")[0];
                var css = document.createElement('link');
                css.id = '__cornify_css';
                css.type = 'text/css';
                css.rel = 'stylesheet';
                css.href = 'http://www.cornify.com/css/cornify.css';
                css.media = 'screen';
                head.appendChild(css);
            }
            cornify_replace();
        }

        if (endAnimationCallback) {
            endAnimationCallback();
        }
    }

    function cornify_replace() {
        // Replace text.
        var hc = 6;
        var hs;
        var h;
        var k;
        var words = ['Happy','Sparkly','Glittery','Fun','Magical','Lovely','Cute','Charming','Amazing','Wonderful'];
        while(hc >= 1) {
            hs = document.getElementsByTagName('h' + hc);
            for (k = 0; k < hs.length; k++) {
                h = hs[k];
                h.innerHTML = words[Math.floor(Math.random()*words.length)] + ' ' + h.innerHTML;
            }
            hc-=1;
        }
    }

    $.fn.cornify_add = function(endAnimationCallback) {
        return this.each(function() {

                var n = 5;

                for (var i = 0; i< n; i++) {
                    setTimeout((function(idx) {
                        return function() {
                            if (idx === n-1) {
                                cornify_add_one(endAnimationCallback);
                            } else {
                                cornify_add_one();
                            }
                        }
                    })(i), i * 600);
                }
        });
    }; //orbit plugin call

})(jQuery, window);

window.cornify_reset = function() {
    var isContainerHere = $('#unicorns').length;
    if (isContainerHere) {
        $('#unicorns').remove();
    }
}

