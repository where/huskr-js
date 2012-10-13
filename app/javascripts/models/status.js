define([
  'backbone'
], function( Backbone ) {
  var StatusModel = Backbone.Model.extend({
    initialize: function() {
      if ( ! this.get('created_at') ) {
        this.set({ 'created_at': new Date().toISOString() });
      }
    },
    newerThan: function( timestamp ) {
      return Date.parse( this.get("created_at") ) > Date.parse( timestamp );
    }
  });

  return StatusModel;

});