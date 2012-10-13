requirejs.config({
    config: {
        modal: {
            modalId: '#postModal'
        },
        'views/statuslist': {
            elementId: '#statuses'
        },
        'collections/statuslist': {
            apiUrl: 'http://huskr.herokuapp.com/api/v1/statuses.json'
        },
        dom: {
            modalId: '#newStatus'
        }
    },
    paths: {
        'jquery': 'libs/jquery',
        'lodash': 'libs/lodash-min',
        'backbone': 'libs/backbone-min',
        'templates': '../templates',
        'sugar': 'libs/sugar-1.3.5-custom.min',
        'foundation': 'libs/foundation.min',
        'text': 'libs/text',
        'domReady': 'libs/domReady'
    },
    shim: {
        'backbone': {
            deps: ['lodash', 'jquery'],
            exports: 'Backbone'
        },
        'sugar': {
            exports: 'Sugar'
        },
        'foundation': ["jquery"]
    }
});

require([
    'app'
], function( App ) {
    App.init();
});
