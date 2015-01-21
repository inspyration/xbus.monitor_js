Models.emitter = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'profile_id',
        relatedModel: 'Models.emitter_profile',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'emitter'
});

Collections.emitter = Backbone.PageableCollection.extend({
    model: Models.emitter,
    name: 'emitter',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'emitter'
});

collections.emitter = new Collections.emitter();
