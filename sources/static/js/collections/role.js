Models.role = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'service_id',
        relatedModel: 'Models.service',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'role'
});

registerCollection({
    name: 'role'
});
