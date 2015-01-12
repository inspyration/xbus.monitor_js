Models.event_error = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'event_id',
        relatedModel: 'Models.event',
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'envelope_id',
        relatedModel: 'Models.envelope',
        reverseRelation: {
            collectionType: 'Collections.event_error',
            includeInJSON: false,
            key: 'errors'
        },
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'node_id',
        relatedModel: 'Models.event_node',
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'role_id',
        relatedModel: 'Models.role',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'event_error'
});

Collections.event_error = Backbone.Collection.extend({
    model: Models.event_error,
    name: 'event_error',
    url: API_PREFIX + 'event_error'
});

collections.event_error = new Collections.event_error();
