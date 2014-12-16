Models.role = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'service_id',
        relatedModel: 'Models.service',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'role'
});

Collections.role = Backbone.Collection.extend({
    model: Models.role,
    name: 'role',
    url: API_PREFIX + 'role'
});

collections.role = new Collections.role();
