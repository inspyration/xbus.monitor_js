Models.emission_profile = Backbone.Model.extend({
    urlRoot: API_PREFIX + 'emission_profile'
});

Collections.emission_profile = Backbone.Collection.extend({
    model: Models.emission_profile,
    name: 'emission_profile',
    url: API_PREFIX + 'emission_profile'
});

collections.emission_profile = new Collections.emission_profile();
