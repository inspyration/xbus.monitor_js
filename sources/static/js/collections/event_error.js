Models.event_error = Backbone.Model.extend({
    urlRoot: '/api/event_error'
});

Collections.event_error = Backbone.Collection.extend({
    model: Models.event_error,
    name: 'event_error',
    url: '/api/event_error'
});

collections.event_error = new Collections.event_error();
