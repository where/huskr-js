define([
  'jquery',
  'lodash',
  'backbone',
  'text!templates/status.html',
  'mediator',
  'utils'
], function( $, _, Backbone, StatusTemplate, Mediator, Utils ) {

  var StatusView = Backbone.View.extend({
    tagName: "div",
    className: "row",
    template: _.template( StatusTemplate ),
    events: {
      "updateTime": "updateTime"
    },
    initialize: function() {
      _.bind( this.renderTime, this );
      this.manageSubscriptions();
      this.model.on( "change", this.render, this );
    },
    render: function() {
      var changedAttributes = this.model.changedAttributes() || {},
          keys = _.keys( changedAttributes );
      if ( keys.length === 1 && keys[0] === "created_at" ) {
        this.updateTime();
      } else {
        this.$el.html( this.template(this.model.toJSON()) );
      }
      return this;
    },
    renderTime: function() {
      $( ".relative-time", this.$el ).text(
        Utils.formatDate( this.model.get("created_at") )
      );
    },
    updateTime: function() {
      this.manageSubscriptions();
      this.renderTime();
    },
    manageSubscriptions: function() {
      if ( this.model.newerThan((1).minutesBefore("now")) ) {
        Mediator.unsubscribe(
          "minute-tick", this.updateTime, this
        );
        Mediator.subscribe(
          "second-tick", this.updateTime, this
        );
      } else {
        Mediator.subscribe(
          "minute-tick", this.updateTime, this
        );
        Mediator.unsubscribe(
          "second-tick", this.updateTime, this
        );
      }
    }
  });

  return StatusView;

});