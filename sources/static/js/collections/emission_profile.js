Models.emission_profile = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'input_descriptor_id',
        relatedModel: 'Models.input_descriptor',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'emission_profile'
});

registerCollection({
    name: 'emission_profile'
});
