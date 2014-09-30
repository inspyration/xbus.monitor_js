Models.role_active = Backbone.Model.extend({
    urlRoot: API_PREFIX + 'role_active'
});

Collections.role_active = Backbone.Collection.extend({
    model: Models.role_active,
    name: 'role_active',
    url: API_PREFIX + 'role_active'
});

collections.role_active = new Collections.role_active();
