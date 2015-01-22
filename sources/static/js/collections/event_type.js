Models.event_type = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'event_type'
});

registerCollection({
    name: 'event_type',
    relationships: {
        "nodes": "event_node",
        "emitter_profiles": "emitter_profile"
    }
});
