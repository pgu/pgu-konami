'use strict';

angular.module('pguKonamiApp').directive('ngKonami', function ($timeout) {

    var KONAMI = String.fromCharCode(38, 38, 40, 40, 37, 39, 37, 39, 66, 65);

    var isAnimationOn = false;
    var counter = 0;

    function startGoC() {
        if (isAnimationOn) {
            return;
        }

        isAnimationOn = true;

        var modal = $('#k_modal');
        var goc = $('#goc');
        var meme = $('#meme');

        counter++;
        meme.attr('src', 'images/' + (counter % 2 === 0 ? 'success_kid' : 'gow_bow') + '_300.gif');

        modal.modal('show');

        modal.addClass('black_bg');
        goc.addClass('anim_goc');
        meme.addClass('anim_meme');

        $timeout(function () {
            modal.fadeOut(2500, function() {
                modal.modal('hide');

                modal.removeClass('black_bg');
                goc.removeClass('anim_goc');
                meme.removeClass('anim_meme');

                isAnimationOn = false;
            });

        }, 5000);

    }

    return {
        restrict: 'E',
        templateUrl: 'views/directives/ngKonami.html',
        link: function () {

            var codeBuffer = '';

            $(document).keyup(function (e) {
                codeBuffer += String.fromCharCode(e.which);

                if (codeBuffer === KONAMI.substring(0, codeBuffer.length)) {
                    if (codeBuffer === KONAMI) {

                        codeBuffer = ''; // full reset
                        startGoC();

                    } // else let's the user completes the sequence
                } else { // incorrect sequence for konamis
                    codeBuffer = ''; // full reset
                }
            });

        }
    };
});