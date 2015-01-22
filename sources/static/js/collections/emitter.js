Models.emitter = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'profile_id',
        relatedModel: 'Models.emitter_profile',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'emitter'
});

registerCollection({
    name: 'emitter'
});
