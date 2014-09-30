/* Inspired by several sources; the best of which is
 * <https://github.com/ccoenraets/directory-backbone-bootstrap>. */

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function disableView(view) {
    /*
     * Avoid calling the "remove" function (creates strange issues) but at least
     * ensure the view no longer catches any event.
     */
    view.stopListening();
    view.undelegateEvents();
}

/*
 * The main view; there can only be one. When a ne1w one is created, the
 * previous one has to be removed.
 */
var main_view = null;
function setMainView(view_factory) {
    if (main_view) {
        disableView(main_view);
    }
    main_view = view_factory();
}

// $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
// options.url = 'http://backbonejs-beginner.herokuapp.com' + options.url;
// options.url = 'http://localhost:6543' + options.url;
// });

var Models = {}; // model classes.
var Collections = {}; // collection classes.
var collections = {}; // collection instances (which contain model instances).
var router = null; // backbone.js router; can be used to navigate across pages.
var Templates = {}; // Template functions, ready to be called with the right
// parameters.
var Views = {}; // view classes.

var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        ':collection': 'list',
        ':collection/create': 'edit',
        ':collection/:id': 'view',
        ':collection/:id/edit': 'edit'
    },

    'home': function() {
        // TODO Redirect to the list view or some such?
        var collection = 'event_type';
        console.log('routing to list view', collection);
        setMainView(function() {
            return new Views.list({
                collection: collections[collection],
                template: Templates[collection + '_list']
            });
        });
    },

    'list': function(collection) {
        console.log('routing to list view', collection);
        setMainView(function() {
            return new Views.list({
                collection: collections[collection],
                template: Templates[collection + '_list']
            });
        });
    },

    'view': function(collection, id) {
        console.log('routing to record view', collection, id);
        setMainView(function() {
            return new Views.record({
                collection: collections[collection],
                editing: false,
                id: id,
                template: Templates[collection + '_form']
            });
        });
    },

    'edit': function(collection, id) {
        console.log('routing to edit record view', collection, id);
        setMainView(function() {
            return new Views.record({
                collection: collections[collection],
                editing: true,
                id: id,
                template: Templates[collection + '_form']
            });
        });
    }
});

$(function() {

    // Pre-load templates; start our router once that is done.

    var deferreds = [];

    $.each(Collections, function(collection) {
        _.each(['form', 'list'], function(view_type) {
            var view_name = collection + '_' + view_type;
            deferreds.push($.get('static/templates/' + view_name + '.html',
                function(data) {
                    Templates[view_name] = _.template(data);
                }, 'html'));
        });
    });

    $.when.apply(null, deferreds).done(function() {
        console.log('fetched all templates; initializing...');
        router = new Router();
        Backbone.history.start();
    });
});
