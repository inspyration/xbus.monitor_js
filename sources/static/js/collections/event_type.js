registerCollection({
    name: 'event_type',
    relationships: {
        'cl_item_types': 'cl_item_type',
        "nodes": "event_node",
        "emitter_profiles": "emitter_profile"
    }
});
