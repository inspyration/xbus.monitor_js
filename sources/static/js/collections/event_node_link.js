Models.event_node_link = Backbone.Model.extend({
    urlRoot: '/api/event_node_link'
});

Collections.event_node_link = Backbone.Collection.extend({
    model: Models.event_node_link,
    name: 'event_node_link',
    url: '/api/event_node_link'
});

collections.event_node_link = new Collections.event_node_link();
