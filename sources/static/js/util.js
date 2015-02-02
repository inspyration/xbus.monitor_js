/*
 * Useful scripts that may use backbone.js, devoops or even both. To be loaded
 * last.
 */

function formatDataForSelect2(data, text_field) {
    return {
        id: data.id,
        text: data[text_field]
    }
}

function prepareForm(form_selector, editing) {
    if (!editing) {
        // Set the form as readonly.
        $(form_selector + ' input').attr('readonly', 'readonly');
    }

    if (editing) {

        // When forms contain binary data, delay submitting until our
        // FileReaders are done.
        var binary_nodes = $(form_selector + ' input[type="file"]');
        if (binary_nodes.length > 0) {
            binary_form_data = {};

            $(form_selector).on('submit', function() {
                if (_.size(binary_form_data) == _.size(binary_nodes)) {
                    // Already read the data; the form is being re-submitted.
                    return true;
                }

                // Read files with FIleReaders and store their result in
                // "binary_form_data".
                binary_nodes.each(function() {
                    var node = $(this);
                    var files = node[0].files;
                    var name = node.attr('name');
                    if (files.length === 0) {
                        // No file selected.
                        binary_form_data[name] = null;
                        return;
                    }
                    var multi = node.attr('multiple');
                    if (multi) {
                        binary_form_data[name] = [];
                    }

                    // Launch a FileReader for each selected file.
                    _.each(files, function(file) {
                        var file_reader = new FileReader();
                        file_reader.onload = function(ev) {
                            // Base64-encode the data; store its MIME type.
                            var data = [file.type, btoa(ev.target.result)];
                            if (multi) {
                                binary_form_data[name].push(data);
                            } else {
                                binary_form_data[name] = data;
                            }
                        }
                        file_reader.onabort = file_reader.onerror = function() {
                            alert('Error reading the file: ' + file.name);
                            binary_form_data[name] = null;
                        };
                        file_reader.readAsBinaryString(file);
                    });
                });

                // TODO Better way of waiting...
                function check_read_done() {
                    if (_.size(binary_form_data) === _.size(binary_nodes)) {
                        // Done reading the binary data! Now submit the form.
                        $(form_selector).submit();
                    } else {
                        // Keep waiting.
                        setTimeout(check_read_done, 500);
                    }
                }
                check_read_done();

                // Ignore this submit event; the form will be submitted after
                // all files are read.
                return false;
            })
        }
    }
}

function select2ify(field, collection_name, text_field, options) {
    /*
     * Apply Select2 to an input; link it with a collection.
     * 
     * @param text_field The field to use to display the name of records.
     * 
     * @param options Additional options to send to the Select2 widget.
     */

    var url = collections[collection_name].url();

    if (!options) {
        options = {};
    }

    $('input[name="' + field + '"]').select2(_.extend({
        ajax: {
            dataType: 'json',
            results: function(data, page) {
                return {
                    results: _.map(data[1], function(row) {
                        return formatDataForSelect2(row, text_field);
                    })
                };
            },
            transport: Backbone.ajax,
            url: options.query_string ? url + '?' + options.query_string : url
        },
        containerCssClass: 'form-control',
        initSelection: function(element, callback) {
            var id = $(element).val();
            if (id !== '') {
                // Request information about the default selection.
                Backbone.ajax({
                    dataType: 'json',
                    url: url + '/' + id
                }).done(function(data) {
                    callback(formatDataForSelect2(data, text_field));
                });
            }
        },
    }, options));
}

function select2ifyFilter(field) {
    /* Apply Select2 to a filtering control. */

    $('select[name="' + field + '"]').select2({
        containerCssClass: 'form-control',
    });
}
