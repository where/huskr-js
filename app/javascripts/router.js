define([
  'backbone',
  'modal',
  'views/statuslist',
  'collections/statuslist'
], function( Backbone, Modal, StatusListView, StatusListCollection ) {
  var Router = Backbone.Router.extend({
    routes: {
      "": "home",
      "post": "post"
    },
    home: function() {
      Modal.hide();
    },
    post: function() {
      Modal.show();
    }
  });

  return {
    init: function() {
      this.router = new Router();
      Backbone.history.start({pushState: true});
      StatusListCollection.fetch();
    }
  };

});