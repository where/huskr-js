;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
      Modernizr = window.Modernizr;

  
  $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
  $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
  $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
  $('input, textarea').placeholder();
  
  
  $.fn.foundationButtons          ? $doc.foundationButtons() : null;
  
  
  $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
  
  
  $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
  
  $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
  $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
  
    
    $.fn.foundationTabs             ? $doc.foundationTabs() : null;

  // Hide address bar on mobile devices
  if (Modernizr.touch) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

})(jQuery, this);

// My stuff

(function(window, undefined) {

  window.huskr = window.huskr || {
    models: {},
    collections: {},
    views: {},
    utils: {},
    PubSub: _.extend({}, Backbone.Events)
  };

  window.huskr.models.User = Backbone.Model.extend();
  window.huskr.models.Status = Backbone.Model.extend({
    initialize: function() {
      if ( ! this.get('created_at') ) {
        this.set({ 'created_at': new Date().toISOString() });
      }
    },
    newerThan: function( timestamp ) {
      return Date.parse( this.get("created_at") ) < Date.parse( timestamp );
    }
  });
  window.huskr.collections.statusList = new (Backbone.Collection.extend({
    url: 'http://huskr.herokuapp.com/api/v1/statuses.json',
    model: window.huskr.models.Status,
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
  }));

  window.huskr.utils.formatDate = function( date ) {
    return Date.create( date ).relative();
  };

  _.extend( window.huskr.PubSub, {
    subscribe: function() {},
    unsubscribe: function() {},
    _seconds: function() {}
  } );

  $(function(){
    window.huskr.views.Status = Backbone.View.extend({
      tagName: "div",
      className: "row",
      template: _.template( $("#status-view").html() ),
      initialize: function() {
        _.bind( "renderTime", this );
        this.manageSubscriptions();
        this.model.on( "change", this.render, this );
      },
      render: function() {
        var keys = _.keys(this.model.changedAttributes());
        if ( keys.length === 1 && keys[0] === "created_at" ) {
          this.updateTime();
        } else {
          this.$el.html( this.template(this.model.toJSON()) );
        }
        return this;
      },
      renderTime: function() {
        $( ".relative-time", this.$el ).text(
          window.huskr.utils.formatDate( this.model.get("created_at") )
        );
      },
      updateTime: function() {
        this.manageSubscriptions();
        this.renderTime();
      },
      manageSubscriptions: function() {
        if ( this.model.newerThan((1).minutesBefore("now")) ) {
          window.huskr.PubSub.unsubscribe(
            "minute-tick", this.updateTime, this
          );
          window.huskr.PubSub.subscribe(
            "second-tick", this.updateTime, this
          );
        } else {
          window.huskr.PubSub.subscribe(
            "minute-tick", this.updateTime, this
          );
          window.huskr.PubSub.unsubscribe(
            "second-tick", this.updateTime, this
          );
        }
      }
    });

    window.huskr.views.StatusList = Backbone.View.extend({
      el: $("#statuses"),
      initialize: function() {
        this.collection.on( "reset", this.render, this );
        this.collection.on( "add", this.renderOne, this );
      },
      render: function() {
        this.$el.empty();
        this.collection.each( this.renderOne, this );
      },
      renderOne: function( status ) {
        var view = new window.huskr.views.Status({ model: status });
        this.$el.prepend( view.render().el );
      }
    });

    var statusListView = new window.huskr.views.StatusList({
      collection: window.huskr.collections.statusList
    });

    // Form wiring

    $("#newStatus").submit(function() {
      var $this = $(this),
          user_name = $( "input[name=user_name]", $this ),
          title = $( "textarea[name=title]", $this );

      var created = window.huskr.collections.statusList.create({
        'user_name': user_name.val(),
        'title': title.val()
      });

      if ( created ) {
        $("#postModal").trigger( "reveal:close" );
        title.val("");
      } else {
        alert('creation error');
      }

      return false;
    });

    // // Set up relative-date timers
    // if ( window.huskr.timers.minute ) {
    //   clearInterval( window.huskr.timers.minute );
    //   var newerModels = window.huskr.collections.statusList.newerThan(
    //     ( 1 ).minutesBefore( "now" )
    //   );
    //   window.huskr.timers.minute = setInterval( function() {
    //     //////////////
    //     newerModels = window.huskr.collections.statusList.newerThan.call(
    //       newerModels,
    //       ( 1 ).minutesBefore( "now" )
    //     );
    //   }, 1000 );
    // }

    window.huskr.collections.statusList.fetch();

  });

})(this);