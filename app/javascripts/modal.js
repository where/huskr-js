define([
  'jquery',
  'lodash',
  'foundation',
  'module',
], function( $, _, foundation, module ) {
  var Modal = function( el ) {
    this.el = el;
    this.$el = $(el);
  };
  _.extend( Modal.prototype, {
    show: function() {
      window.$(this.el).reveal();
    },
    hide: function() {
      $(this.el).trigger( "reveal:close" );
    },
    isVisible: function() {
      return $(this.el).hasClass( "open" );
    }
  } );

  var modal = new Modal(module.config().modalId);
  return modal;
});