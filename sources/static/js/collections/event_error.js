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
    }, {
        collectionType: 'Collections.event_error_tracking',
        includeInJSON: false,
        key: 'tracking',
        relatedModel: 'Models.event_error_tracking',
        type: Backbone.HasMany
    }],
    urlRoot: API_PREFIX + 'event_error'
});

Collections.event_error = Backbone.PageableCollection.extend({
    model: Models.event_error,
    name: 'event_error',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'event_error'
});

collections.event_error = new Collections.event_error();
