Models.role_active = Backbone.Model.extend({
    urlRoot: '/api/role_active'
});

Collections.role_active = Backbone.Collection.extend({
    model: Models.role_active,
    name: 'role_active',
    url: '/api/role_active'
});

collections.role_active = new Collections.role_active();
