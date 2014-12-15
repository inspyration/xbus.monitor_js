Models.emission_profile = Backbone.RelationalModel.extend({
    relations: [{
        key: 'input_descriptor_id',
        relatedModel: 'Models.input_descriptor',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'emission_profile'
});

Collections.emission_profile = Backbone.Collection.extend({
    model: Models.emission_profile,
    name: 'emission_profile',
    url: API_PREFIX + 'emission_profile'
});

collections.emission_profile = new Collections.emission_profile();
