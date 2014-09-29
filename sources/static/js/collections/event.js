Models.event = Backbone.Model.extend({
    urlRoot: '/api/event'
});

Collections.event = Backbone.Collection.extend({
    model: Models.event,
    name: 'event',
    url: '/api/event'
});

collections.event = new Collections.event();
