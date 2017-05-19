/*global $*/
/*jshint unused:false,forin:false*/
'use strict';

// helper - merge two objects together, without using $.extend
var merge = function (obj1, obj2) {
    var obj3 = {};
    for (var attrOne in obj1) {
        obj3[attrOne] = obj1[attrOne];
    }
    for (var attrTwo in obj2) {
        obj3[attrTwo] = obj2[attrTwo];
    }
    return obj3;
};

var iosOverlay = function (params) {


    var overlayDOM;
    var noop = function () {
    };
    var defaults = {
        onbeforeshow: noop,
        onshow: noop,
        onbeforehide: noop,
        onhide: noop,
        text: "",
        icon: null,
        spinner: null,
        duration: null,
        id: null,
        parentEl: null
    };

    // helper - does it support CSS3 transitions/animation
    var doesTransitions = (function () {
        var b = document.body || document.documentElement;
        var s = b.style;
        var p = 'transition';
        if (typeof s[p] === 'string') {
            return true;
        }

        // Tests for vendor specific prop
        var v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
        p = p.charAt(0).toUpperCase() + p.substr(1);
        for (var i = 0; i < v.length; i++) {
            if (typeof s[v[i] + p] === 'string') {
                return true;
            }
        }
        return false;
    }());

    // setup overlay settings
    var settings = merge(defaults, params);

    //
    var handleAnim = function (anim) {
        if (anim.animationName === "ios-overlay-show") {
            settings.onshow();
        }
        if (anim.animationName === "ios-overlay-hide") {
            destroy();
            settings.onhide();
        }
    };

    // IIFE
    var create = (function () {

        // initial DOM creation and event binding
        overlayDOM = document.createElement("div");
        overlayDOM.className = "ui-ios-overlay";
        overlayDOM.innerHTML += '<span class="title">' + settings.text + '</span';
        if (params.icon) {
            overlayDOM.innerHTML += '<img src="' + params.icon + '">';
        } else if (params.spinner) {
            overlayDOM.appendChild(params.spinner.el);
        }
        if (doesTransitions) {
            overlayDOM.addEventListener("webkitAnimationEnd", handleAnim, false);
            overlayDOM.addEventListener("msAnimationEnd", handleAnim, false);
            overlayDOM.addEventListener("oAnimationEnd", handleAnim, false);
            overlayDOM.addEventListener("animationend", handleAnim, false);
        }
        if (params.parentEl) {
            document.getElementById(params.parentEl).appendChild(overlayDOM);
        } else {
            document.body.appendChild(overlayDOM);
        }

        settings.onbeforeshow();
        // begin fade in
        if (doesTransitions) {
            overlayDOM.className += " ios-overlay-show";
        } else if (typeof $ === "function") {
            $(overlayDOM).fadeIn({
                duration: 200
            }, function () {
                settings.onshow();
            });
        }

        if (settings.duration) {
            window.setTimeout(function () {
                hide();
            }, settings.duration);
        }

    }());

    var hide = function () {
        // pre-callback
        settings.onbeforehide();
        // fade out
        if (doesTransitions) {
            // CSS animation bound to classes
            overlayDOM.className = overlayDOM.className.replace("show", "hide");
        } else if (typeof $ === "function") {
            // polyfill requires jQuery
            $(overlayDOM).fadeOut({
                duration: 200
            }, function () {
                destroy();
                settings.onhide();
            });
        }
    };

    var destroy = function () {
        if (params.parentEl) {
            document.getElementById(params.parentEl).removeChild(overlayDOM);
        } else {
            document.body.removeChild(overlayDOM);
        }
    };

    var update = function (params) {
        if (params.text) {
            overlayDOM.getElementsByTagName("span")[0].innerHTML = params.text;
        }
        if (params.icon) {
            if (settings.spinner) {
                // Unless we set spinner to null, this will throw on the second update
                settings.spinner.el.parentNode.removeChild(settings.spinner.el);
                settings.spinner = null;
            }
            overlayDOM.innerHTML += '<img src="' + params.icon + '">';
        }
    };

    return {
        hide: hide,
        destroy: destroy,
        update: update
    };

};

var opts = {
    lines: 10, // The number of lines to draw
    length: 11, // The length of each line
    width: 5, // The line thickness
    radius: 17, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    color: '#FFF', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

var loadings = {};

var checkLoadingExist = function (domID) {
     if (domID in loadings){
         try{
            loadings[domID].destroy()
         }catch (e){}
     }
};

var newLoading = function (param) {

    var loadingDefaults = {
        spinner: new Spinner(opts).spin(document.createElement("div")),
        parentEl: null,
        timeout: 0
    };

    var __hideDelay = function (timeout) {
        if (timeout > 0) {

            try {
                if (hideTimer != -1) {
                    clearTimeout(hideTimer);
                }
                hideTimer = setTimeout(function () {
                    iosLay.hide();
                }, timeout)
            } catch (e) {
            }

        }
    };
    var settings = merge(loadingDefaults, param);

    checkLoadingExist(settings.parentEl);

    var hideTimer = -1;

    var iosLay = iosOverlay(settings);
    loadings[settings.parentEl ? settings.parentEl : 'null'] = iosLay;

    __hideDelay(settings.timeout);

    var update = function (param) {
        var settings = merge(loadingDefaults, param);
        if (iosLay) {
            iosLay.update(settings)
        }
        __hideDelay(settings.timeout);
    };

    var hide = function () {

        if (hideTimer != -1) {
            try {
                clearTimeout(hideTimer)
            } catch (e) {
            }
        }
        iosLay.hide()
    };

    var destroy = function () {

        if (hideTimer != -1) {
            try {
                clearTimeout(hideTimer)
            } catch (e) {
            }
        }
        iosLay.destroy()
    };

    return {
        update: update,
        hide: hide,
        destroy:destroy
    }
};

//Added support for requirejs
if (typeof define === 'function' && define.amd) {
    define([], function () {
        return iosOverlay;
    });
}
