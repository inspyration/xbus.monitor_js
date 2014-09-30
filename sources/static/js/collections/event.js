Models.event = Backbone.Model.extend({
    urlRoot: API_PREFIX + 'event'
});

Collections.event = Backbone.Collection.extend({
    model: Models.event,
    name: 'event',
    url: API_PREFIX + 'event'
});

collections.event = new Collections.event();
