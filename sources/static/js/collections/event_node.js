Models.event_node = Backbone.Model.extend({
    urlRoot: '/api/event_node'
});

Collections.event_node = Backbone.Collection.extend({
    model: Models.event_node,
    name: 'event_node',
    url: '/api/event_node'
});

collections.event_node = new Collections.event_node();