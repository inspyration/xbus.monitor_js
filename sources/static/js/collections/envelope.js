Models.envelope = Backbone.RelationalModel.extend({
    relations: [{
        key: 'emitter_id',
        relatedModel: 'Models.emitter',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'envelope'
});

Collections.envelope = Backbone.Collection.extend({
    model: Models.envelope,
    name: 'envelope',
    url: API_PREFIX + 'envelope'
});

collections.envelope = new Collections.envelope();
