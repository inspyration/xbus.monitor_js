Models.event_node = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'service_id',
        relatedModel: 'Models.service',
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'type_id',
        relatedModel: 'Models.event_type',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'event_node'
});

Collections.event_node = Backbone.PageableCollection.extend({
    model: Models.event_node,
    name: 'event_node',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'event_node',
    relationships: {
        "parents": "event_node",
        "children": "event_node"
    }
});

collections.event_node = new Collections.event_node();
