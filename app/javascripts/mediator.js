define([
  'lodash',
  'backbone'
], function( _, Backbone ) {

  var Mediator = _.extend({}, Backbone.Events);

  _.extend( Mediator, {
    _subscribers: {},
    _timer: null,
    subscribe: function( channel, fn, context ) {
      this._subscribers[ channel ] = this._subscribers[ channel ] || [];
      if ( _.indexOf(this._subscribers[channel], context.cid) === -1 ) {
        this._subscribers[ channel ].push( context.cid );
        this.on( channel, fn, context );
      }
      if ( channel === "second-tick" && this._subscribers[channel].length ) {
        if ( ! this._timer ) {
          var self = this;
          this._timer = setInterval( function() {
            self.publish( "second-tick" );
          }, 100 );
        }
      }
    },
    unsubscribe: function( channel, fn, context ) {
      this._subscribers[ channel ] = this._subscribers[ channel ] || [];
      var index = _.indexOf( this._subscribers[channel], context.cid );
      if ( index !== -1 ) {
        this._subscribers[ channel ].splice( index, 1 );
        this.off( channel, fn, context );
      }
      if ( channel === "second-tick" && ! this._subscribers[channel].length ) {
        if ( this._timer ) {
          clearInterval( this._timer );
          this._timer = null;
        }
      }
      this.off( channel, fn, context );
    },
    publish: function( channel ) {
      this.trigger( channel );
    }
  } );

  return Mediator;

});