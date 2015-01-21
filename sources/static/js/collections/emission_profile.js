Models.emission_profile = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'input_descriptor_id',
        relatedModel: 'Models.input_descriptor',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'emission_profile'
});

Collections.emission_profile = Backbone.PageableCollection.extend({
    model: Models.emission_profile,
    name: 'emission_profile',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'emission_profile'
});

collections.emission_profile = new Collections.emission_profile();
