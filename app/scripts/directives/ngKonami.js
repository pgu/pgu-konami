'use strict';

angular.module('pguKonamiApp').directive('ngKonami', function () {

    var KONAMI = String.fromCharCode(38, 38, 40, 40, 37, 39, 37, 39, 66, 65);

    var isAnimationOn = false;

    function startGoC() {
        if (isAnimationOn) {
            return;
        }

        isAnimationOn = true;

        $('#goc').animate({marginTop: '2em'}, 5000);
        $('#goc_container').fadeIn(2500).fadeOut(2500, function () {
            $('#goc').css('margintop', '0.2em');
        });

        isAnimationOn = false;
    }

    return {
        restrict: 'E',
        templateUrl: 'views/directives/ngKonami.html',
        link: function (scope, element, attrs, ctrl, transcludeFn) {

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