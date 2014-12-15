Models.event_node = Backbone.RelationalModel.extend({
    relations: [{
        key: 'service_id',
        relatedModel: 'Models.service',
        type: Backbone.HasOne
    }, {
        key: 'type_id',
        relatedModel: 'Models.event_type',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'event_node'
});

Collections.event_node = Backbone.Collection.extend({
    model: Models.event_node,
    name: 'event_node',
    url: API_PREFIX + 'event_node',
    relationships: {
        "parents": "event_node",
        "children": "event_node"
    }
});

collections.event_node = new Collections.event_node();
