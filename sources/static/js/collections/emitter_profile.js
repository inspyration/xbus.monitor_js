Models.emitter_profile = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'emitter_profile'
});

registerCollection({
    name: 'emitter_profile',
    relationships: {
        "event_types": "event_type"
    }
});
