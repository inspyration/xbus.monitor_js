Models.role = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'service_id',
        relatedModel: 'Models.service',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'role'
});

Collections.role = Backbone.PageableCollection.extend({
    model: Models.role,
    name: 'role',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'role'
});

collections.role = new Collections.role();
