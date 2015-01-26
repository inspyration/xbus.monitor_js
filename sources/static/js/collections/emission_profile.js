registerCollection({
    name: 'emission_profile'
}, {
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'input_descriptor_id',
        relatedModel: 'Models.input_descriptor',
        type: Backbone.HasOne
    }]
});
