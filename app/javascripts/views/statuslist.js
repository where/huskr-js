define([
  'jquery',
  'backbone',
  'collections/statuslist',
  'views/status',
  'models/status',
  'module'
], function( $, Backbone, StatusListCollection, StatusView, StatusModel, module ) {
    var StatusListView = Backbone.View.extend({
      el: $( module.config().elementId ),
      initialize: function() {
        this.collection.on( "reset", this.render, this );
        this.collection.on( "add", this.renderOne, this );
      },
      render: function() {
        this.$el.empty();
        this.collection.each( this.renderOne, this );
      },
      renderOne: function( status ) {
        var view = new StatusView({ model: status });
        this.$el.prepend( view.render().el );
      }
    });

    return new StatusListView({
      collection: StatusListCollection
    });

});