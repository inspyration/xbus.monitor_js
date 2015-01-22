Models.envelope = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'emitter_id',
        relatedModel: 'Models.emitter',
        type: Backbone.HasOne
    }, {
        collectionType: 'Collections.event',
        includeInJSON: false,
        key: 'events',
        relatedModel: 'Models.event',
        type: Backbone.HasMany
    }, {
        collectionType: 'Collections.event_error',
        includeInJSON: false,
        key: 'errors',
        relatedModel: 'Models.event_error',
        type: Backbone.HasMany
    }],
    urlRoot: API_PREFIX + 'envelope'
});

registerCollection({
    default_filters: {
        'state_filter': ['state', 'in', ['emit', 'exec', 'fail']]
    },
    name: 'envelope'
})
