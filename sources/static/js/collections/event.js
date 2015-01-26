registerCollection({
    name: 'event'
}, {
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'emitter_id',
        relatedModel: 'Models.emitter',
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'envelope_id',
        relatedModel: 'Models.envelope',
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'responsible_id',
        relatedModel: 'Models.user',
        type: Backbone.HasOne
    }, {
        collectionType: 'Collections.event_tracking',
        includeInJSON: false,
        key: 'tracking',
        relatedModel: 'Models.event_tracking',
        type: Backbone.HasMany
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'type_id',
        relatedModel: 'Models.event_type',
        type: Backbone.HasOne
    }]
});
