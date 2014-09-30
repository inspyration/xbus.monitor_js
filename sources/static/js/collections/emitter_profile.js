Models.emitter_profile = Backbone.Model.extend({
    urlRoot: API_PREFIX + 'emitter_profile'
});

Collections.emitter_profile = Backbone.Collection.extend({
    model: Models.emitter_profile,
    name: 'emitter_profile',
    url: API_PREFIX + 'emitter_profile'
});

collections.emitter_profile = new Collections.emitter_profile();
