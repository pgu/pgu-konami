/*
 * jQuery Raptorize Plugin 1.0
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
    var pictureExt = is_chrome ? '.webp' : '.png';

    $.fn.raptorize = function () {

        return this.each(function () {

            var randomImageUrl = '/easter_eggs/raptors/img/' + getRandomInt(1, 8) + pictureExt;

            var locked = false;

            var raptor = $('<img style="display: none;z-index:30000" src="' + randomImageUrl + '" />');
            $('body').append(raptor);

            raptor.css({
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
                raptor.animate({
                    "bottom": "0"
                }, 100, function () {

                    $(this).animate({
                        "bottom": "-2px"
                    }, 300, function () {
                        var offset = (($(this).position().left) + 400);
                        $(this).delay(300).animate({
                            "right": offset
                        }, 2200, function () {
                            raptor.remove();
                            locked = false;
                        })
                    });
                });
            }


        }); //each call
    } //orbit plugin call
})(jQuery, window);

$("body").raptorize();
