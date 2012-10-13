define([
	'backbone',
	'models/status',
	'module'
], function( Backbone, StatusModel, Module ) {
  var StatusList = Backbone.Collection.extend({
    url: Module.config().apiUrl,
    model: StatusModel,
    initialize: function() {
      this.on("change:created_at", function() {
        this.sort({ silent: true });
      }, this );
    },
    comparator: function( model ) {
      return new Date( model.get('created_at') );
    },
    newerThan: function( timestamp ) {
      return this.filter(function() {
        return this.newerThan( timestamp );
      });
    }
  });

  return new StatusList;
});