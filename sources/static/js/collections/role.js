Models.role = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'role'
});

Collections.role = Backbone.Collection.extend({
    model: Models.role,
    name: 'role',
    url: API_PREFIX + 'role'
});

collections.role = new Collections.role();
