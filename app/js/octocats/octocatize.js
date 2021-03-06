/*
 * From jQuery Raptorize Plugin 1.0
 * www.ZURB.com/playground
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Modified and strongly inspired from the vogue's guys, big thx ;-)
 * (see http://www.vogue.co.uk/news)
 *
 */

(function ($, window) {

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var is_chrome = window.chrome;

    var tmpOctocats = [
        'gangnamtocat.png',
        'spidertocat.png',
        'stormtroopocat.png',
        'homercat.png',
        'droidtocat.png',
        'minion.png',
        'twenty-percent-cooler-octocat.png',
        'dojocat.jpg',
        'baracktocat.jpg',
        'okal-eltocat.jpg',
        'octobiwan.jpg'
    ].map(function(name) {
            return 'js/octocats/img/' + (is_chrome ? name.replace(/\.[a-z]+$/, '.webp') : name);
    });

    var counter = 0;

    var octocatize = function (endAnimationCallback) {

        counter++;

        var currentOctocats;

        if (counter < 6) {
            currentOctocats = tmpOctocats;
        } else {
            currentOctocats = window.octocats || tmpOctocats;
        }

        var randomImageUrl = currentOctocats[getRandomInt(0, currentOctocats.length -1)];

        var locked = false;

        var octocat = $('<img style="display: none;z-index:30000" src="' + randomImageUrl + '" />');
        $('body').append(octocat);

        octocat.css({
            "position": "fixed",
            "bottom": "-310px",
            "right": "0",
            "display": "block"
        });

        function init(imgUrl) {
            var image = new Image();
            image.onload = function () { initAfterImageLoad() };
            image.src = imgUrl;
        }

        init(randomImageUrl);

        // Animating Code
        function initAfterImageLoad() {
            locked = true;

            // Movement Hilarity
            octocat.animate({
                "bottom": "0",
                "height": "75%",
                "width": "50%"
            }, 100, function () {

                $(this).animate({
                    "bottom": "-2px"
                }, 300, function () {
                    var offset = (($(this).position().left) + 400);
                    $(this).delay(300).animate({
                        "right": offset
                    }, 2200, function () {
                        octocat.remove();
                        locked = false;
                        if (endAnimationCallback) {
                            endAnimationCallback();
                        }
                    })
                });
            });
        }
    };

    function repeat_octocatize(n, endAnimationCallback) {
        for (var i = 0; i < n; i++) {
            setTimeout((function(idx) {
                return function() {
                    if (idx === n-1) {
                        octocatize(endAnimationCallback);
                    } else {
                        octocatize();
                    }
                }

            })(i), i * 1000);
        }
    }

    $.fn.octocatize = function(endAnimationCallback) {
        return this.each(function() {
            repeat_octocatize(5, endAnimationCallback);
        });
    }; //orbit plugin call

})(jQuery, window);
