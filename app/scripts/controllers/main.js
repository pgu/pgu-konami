'use strict';

angular.module('pguKonamiApp').controller('MainCtrl', function ($scope) {

    $scope.launch = function (anim_key) {

        if (anim_key === 'halloween') {
            clearAnimations();
            startHalloween();

        } else if (anim_key === 'octocats') {
            clearAnimations();
            startOctocats();

        } else if (anim_key === 'cornify') {
            startCornify();

        } else {
            throw new Error('Unknown animation!');
        }

    };

    function clearAnimations() {
        if (window.cornify_reset) {
            cornify_reset();
        }
    }

    function resizeFrameHalloween() {
        var windowHeight = 768;
        var windowWidth = 1024;
        var de = document.documentElement;
        if (typeof(window.innerHeight) === 'number') {
            windowHeight = window.innerHeight;
            windowWidth = window.innerWidth;
        } else if (de && de.clientHeight) {
            windowHeight = de.clientHeight;
            windowWidth = de.clientWidth;
        }
        $('#halloween').width(windowWidth).height(windowHeight);
    }

    function removeHalloween() {
        var isHalloweenON = $('#halloween').length;
        if (isHalloweenON) {
            $('#halloween').remove();
            $(window).off('resize', resizeFrameHalloween);
        }
    }

    function startHalloween() {

        // loading message
        $('#trick_or_treat').animate({marginTop: '2em'}, 5000);
        $('#trick_container').fadeIn(2500).fadeOut(2500, function () {
            $('#trick_or_treat').css('margintop', '0.2em');
        });

        // add halloween world
        $('<iframe />', {
            name: 'halloween',
            id: 'halloween',
            src: '/js/halloween/halloween.html',
            scrolling: 'no'
        }).appendTo('body');

        var frame = $('#halloween');
        frame.css({
            position: 'fixed',
            top: '0',
            'zindex': '10000',
            border: 'none',
            margin: '0',
            padding: '0',
            overflow: 'hidden'
        });

        // handle resizing
        resizeFrameHalloween();
        $(window).resize(resizeFrameHalloween);

        // handle cleaning
        function receiveMessage(event) {
            if (event.data === 'DELETE_HALLOWEEN') {
                removeHalloween();
            }
        }

        window.addEventListener('message', receiveMessage, false);
    }

    function startAnimation(urlOfScript, methodToCall) {
        if ($('body')[methodToCall]) {
            $('body')[methodToCall]();
        } else {
            $.getScript(urlOfScript);
        }
    }

    function startOctocats() {
        startAnimation('/js/octocats/octocatize.js', 'octocatize');
        if (!$('body')['octocatize']) {
            $.getScript('/js/octocats/octocats-loader.js');
        }
    }

    function clearCornifyOnEscape(e) {
        if (27 === e.which) {
            window.cornify_reset();
            $(document).unbind('keyup', clearCornifyOnEscape);
        }
    }

    function startCornify() {
        startAnimation('js/cornify/cornify.js', 'cornify_add');
        $(document).keyup(clearCornifyOnEscape);
    }

});
