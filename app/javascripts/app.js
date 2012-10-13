define([
  'router',
  'dom'
], function( Router, Dom ) {
  return {
    init: function() {
      Router.init();
      Dom.bindings();
      Dom.timers();
    }
  };
});