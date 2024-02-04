(function () {
    "use strict";

    function getBasePath() {
        if (typeof window === "undefined") return "/";
        var path = window.location.pathname;
        var lastSlash = path.lastIndexOf(path);
        if (lastSlash !== -1) path = path.substr(0, lastSlash);
        return path;
    }

    /* globals requirejs */
    requirejs.config({
        baseUrl: getBasePath(),
        paths: {
            'async': '/micro/lib/requirejs-async',
            'jquery': '/micro/lib/jquery.min',
            'jquery-visibility': '/micro/lib/jquery-visibility',
            'bootstrap': '/micro/lib/bootstrap.min',
            'gapi': '/micro/lib/gapi',
            'jsunzip': '/micro/lib/jsunzip',
            'promise': '/micro/lib/promise-6.0.0',
            'underscore': '/micro/lib/underscore-min',
            'webgl-debug': '/micro/lib/webgl-debug'
        },
        shim: {
            'underscore': {exports: '_'},
            'bootstrap': ['jquery'],
            'jquery-visibility': ['jquery']
        }
    });
})();