registerCollection({
    name: 'emitter'
}, {
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'profile_id',
        relatedModel: 'Models.emitter_profile',
        type: Backbone.HasOne
    }]
});
