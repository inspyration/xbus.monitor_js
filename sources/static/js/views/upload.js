Views.upload = Backbone.View.extend({
    el: '#ajax-content',
    events: {
        'submit #upload_form': 'submit'
    },

    initialize: function(options) {
        console.log('upload view initialize');
        this.template = options.template;
        this.render();
    },

    render: function() {
        console.log('upload view render');
        this.$el.html(this.template({
            'api_prefix': API_PREFIX
        }));
        return this;
    },

    submit: function(ev) {
        /*
         * Submit the form via an AJAX request: - To ensure custom HTTP headers
         * have been added. - For a more graceful response handling.
         */

        console.log('upload view submit');

        var form = ev.target;
        $.ajax({
            contentType: false,
            data: new FormData(form),
            dataType: 'json',
            processData: false,
            type: 'POST',
            url: $(form).attr('action'),

            error: function(xhr) {
                console.log('upload error', xhr);
                alert('Error when uploading the file:\n\n'
                    + xhr.responseJSON['error']);
            },
            success: function(data) {
                console.log('upload success', data);
                // Redirect to the envelope that has been created.
                router.navigate('envelope/' + data['envelope_id'], {
                    trigger: true
                });
            }
        });
        return false;
    }
});
