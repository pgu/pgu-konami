'use strict';

angular.module('pguKonamiApp').controller('MainCtrl', function ($scope) {

    $scope.launch = function (anim_key) {

        if (anim_key === 'halloween') {
            startHalloween();

        } else if (anim_key === 'octocats') {

        } else if (anim_key === 'cornify') {

        } else {
            throw new Error('Unknown animation!');
        }

    };

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

});
