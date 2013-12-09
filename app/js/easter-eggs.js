$(function () {

    var konamiClassic = String.fromCharCode(38, 38, 40, 40, 37, 39, 37, 39, 66, 65);
    var konamiOctocats = String.fromCharCode(38, 40, 79, 67, 84, 79, 67, 65, 84);
    var konamiUnicorns = String.fromCharCode(37, 39, 67, 79, 82, 78, 73, 70, 89);
    var konamiNinja = String.fromCharCode(38, 39, 40, 37, 83, 70, 69, 73, 82, 78, 73, 78, 74, 65);

    var KONAMIS = [konamiClassic, konamiOctocats, konamiUnicorns, konamiNinja];

    function buildOnToKonami(konami) {
        return function(buffer) {
            return buffer === konami.substring(0, buffer.length);
        }
    }

    var isOnToKonamiClassic = buildOnToKonami(konamiClassic);
    var isOnToKonamiOctocats = buildOnToKonami(konamiOctocats);
    var isOnToKonamiUnicorns = buildOnToKonami(konamiUnicorns);
    var isOnToKonamiNinja = buildOnToKonami(konamiNinja);

    function getLastChar(str) {
        return str.charAt(str.length -1);
    }

    function isStartingAnotherKonami(buffer) {
        var lastChar = getLastChar(buffer);

        return KONAMIS.some(function(konami) {
                    return lastChar === konami.charAt(0);
                });
    }

    function isFromPreviousKonami(buffer) {
        return KONAMIS.some(function(konami) {
            var len = konami.length;

            return buffer.length === len
                && buffer.substring(0, len -1) === konami.substring(0, len -1);
        });
    }

    function getAlmostCompleteKonami(konami) {
        return konami.substring(0, konami.length -1);
    }

    var codeBuffer = "";

    $(document).keyup(function (e) {
        codeBuffer += String.fromCharCode(e.which);

        if (isOnToKonamiClassic(codeBuffer)) {
            if (konamiClassic === codeBuffer) {

                codeBuffer = getAlmostCompleteKonami(konamiClassic);
                toggleRaptors();

            } // else let's the user completes the sequence

        } else if (isOnToKonamiOctocats(codeBuffer)) {
            if (konamiOctocats === codeBuffer) {

                codeBuffer = getAlmostCompleteKonami(konamiOctocats);
                toggleOctocats();
            }

        } else if (isOnToKonamiUnicorns(codeBuffer)) {
            if (konamiUnicorns === codeBuffer) {

                codeBuffer = getAlmostCompleteKonami(konamiUnicorns);
                toggleUnicorns();
            }

        } else if (isOnToKonamiNinja(codeBuffer)) {
            if (konamiNinja === codeBuffer) {

                codeBuffer = '';
                toggleUncleSfeir();
            }

        } else if (isFromPreviousKonami(codeBuffer)
                && isStartingAnotherKonami(codeBuffer)) {

            codeBuffer = getLastChar(codeBuffer);
            cleanKonamisON();

        } else { // incorrect sequence for konamis
            codeBuffer = ''; // full reset
            cleanKonamisON();
        }
    });

    function cleanKonamisON() {
        if (window.cornify_reset) {
            cornify_reset();
        }

    }

    function toggle(urlOfScript, methodToCall) {
        if ($('body')[methodToCall]) {
            $('body')[methodToCall]();
        } else {
            $.getScript(urlOfScript);
        }
    }

    function toggleRaptors() {
        toggle('/dist/easter_eggs/js/raptorize.min.js', 'raptorize');
    }

    function toggleOctocats() {
        toggle('/dist/easter_eggs/js/octocatize.min.js', 'octocatize');
        if (!$('body')['octocatize']) {
            $.getScript('/dist/easter_eggs/js/octocats-loader.min.js');
        }
    }

    function toggleUnicorns() {
        toggle('/dist/easter_eggs/js/cornify.min.js', 'cornify_add');
    }

    function hideUncleSfeirOnEscape(e) {
        if (27 === e.which) {
            $('#uncleSfeir').modal('hide');
            $(document).unbind('keyup', hideUncleSfeirOnEscape);
        }
    }

    function showUncleSfeir() {
        $('#uncleSfeir').modal('show');
        $(document).keyup(hideUncleSfeirOnEscape);
    }

    function toggleUncleSfeir() {
        var isModalHere = $('#uncleSfeir').length;

        if (isModalHere) {
            showUncleSfeir();

        } else {
            $.get('/dist/easter_eggs/uncle_sfeir.html', function(data){
                var d = $('<div />');
                d.html(data);
                d.appendTo('body');

                showUncleSfeir();
            });
        }
    }

});
