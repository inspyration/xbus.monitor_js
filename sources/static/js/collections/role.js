Models.role = Backbone.Model.extend({
    urlRoot: '/api/role'
});

Collections.role = Backbone.Collection.extend({
    model: Models.role,
    name: 'role',
    url: '/api/role'
});

collections.role = new Collections.role();
