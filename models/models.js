(function () {
    var server = false, models;
    if (typeof exports !== 'undefined') {
        _ = require('underscore')._;
        Backbone = require('backbone');

        models = exports;
        server = true;
    } else {
        models = this.models = {};
    }

    //
    //models
    //
    
    models.Movie = Backbone.Model.extend({
    	defaults:	{
    		"title":"Enter movie name",
    		"":""
		},
	
		initialize:	function()	{
			
		},
		idAttribute: "id"
    });

    models.User = Backbone.Model.extend({
    	defaults:	{
			"userId":"0",
			"userName":"Name of the User"
		},
	
		initialize:	function()	{
		},
		"idAttribute": "userId"
    });

    models.FlickSatModel = Backbone.Model.extend({
        defaults: {
            "clientId": 0
        },

        initialize: function() {
        	this.movie = new models.Movie();
            this.user = new models.User(); 
        }
    });


    //
    //Collections
    //

    models.Movies = Backbone.Collection.extend({
        model: models.Movie
    });
    models.Users = Backbone.Collection.extend({
    	model : models.User
    });
    //
    //Model exporting/importing
    //
    
    Backbone.Model.prototype.xport = function (opt) {
        var result = {},
        settings = _({recurse: true}).extend(opt || {});

        function process(targetObj, source) {
            targetObj.id = source.id || null;
            targetObj.cid = source.cid || null;
            targetObj.attrs = source.toJSON();
            _.each(source, function (value, key) {
            // since models store a reference to their collection
            // we need to make sure we don't create a circular refrence
                if (settings.recurse) {
                  if (key !== 'collection' && source[key] instanceof Backbone.Collection) {
                    targetObj.collections = targetObj.collections || {};
                    targetObj.collections[key] = {};
                    targetObj.collections[key].models = [];
                    targetObj.collections[key].id = source[key].id || null;
                    _.each(source[key].models, function (value, index) {
                      process(targetObj.collections[key].models[index] = {}, value);
                    });
                  } else if (source[key] instanceof Backbone.Model) {
                    targetObj.models = targetObj.models || {};
                    process(targetObj.models[key] = {}, value);
                  }
               }
            });
        }

        process(result, this);

        return JSON.stringify(result);
    };


    Backbone.Model.prototype.mport = function (data, silent) {
        function process(targetObj, data) {
            targetObj.id = data.id || null;
            targetObj.set(data.attrs, {silent: silent});
            // loop through each collection
            if (data.collections) {
              _.each(data.collections, function (collection, name) {
                targetObj[name].id = collection.id;
                _.each(collection.models, function (modelData, index) {
                  var newObj = targetObj[name]._add({}, {silent: silent});
                  process(newObj, modelData);
                });
              });
            }

            if (data.models) {
                _.each(data.models, function (modelData, name) {
                    process(targetObj[name], modelData);
                });
            }
        }

        process(this, JSON.parse(data));

        return this;
    };

})()
