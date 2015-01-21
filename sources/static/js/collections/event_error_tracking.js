Models.event_error_tracking = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'event_error_id',
        relatedModel: 'Models.event_error',
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'user_id',
        relatedModel: 'Models.user',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'event_error_tracking'
});

Collections.event_error_tracking = Backbone.PageableCollection.extend({
    model: Models.event_error_tracking,
    name: 'event_error_tracking',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'event_error_tracking'
});

collections.event_error_tracking = new Collections.event_error_tracking();
