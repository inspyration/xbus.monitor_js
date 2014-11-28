Views.login = Backbone.View.extend({
    el: '#ajax-content',
    events: {
        'submit .login-form': 'sendLogin',
    },

    initialize: function(options) {
        console.log('login view initialize');
        this.template = options.template;
        this.render();
    },

    render: function() {
        console.log('login view render');
        this.$el.html(this.template({
            'api_prefix': API_PREFIX
        }));
        return this;
    },

    sendLogin: function() {
        var login = $('.login-form input[name="login"]').val();
        var password = $('.login-form input[name="password"]').val();
        if (!login || !password) {
            alert('Please provide a login and a password.');
            return false;
        }

        // Propagate login information with any future AJAX call.
        var basic_auth_data = 'Basic ' + btoa(login + ':' + password);
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', basic_auth_data);
            }
        });

        // Get back to the previous page.
        router.navigate(login_referrer ? login_referrer : '', {
            trigger: true
        });

        // Ignore this event.
        return false;
    }
});
