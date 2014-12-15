Models.emitter = Backbone.RelationalModel.extend({
    relations: [{
        key: 'profile_id',
        relatedModel: 'Models.emitter_profile',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'emitter'
});

Collections.emitter = Backbone.Collection.extend({
    model: Models.emitter,
    name: 'emitter',
    url: API_PREFIX + 'emitter'
});

collections.emitter = new Collections.emitter();
