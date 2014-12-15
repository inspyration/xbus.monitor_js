Models.event = Backbone.RelationalModel.extend({
    relations: [{
        key: 'emitter_id',
        relatedModel: 'Models.emitter',
        type: Backbone.HasOne
    }, {
        key: 'type_id',
        relatedModel: 'Models.event_type',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'event'
});

Collections.event = Backbone.Collection.extend({
    model: Models.event,
    name: 'event',
    url: API_PREFIX + 'event'
});

collections.event = new Collections.event();
