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
    views: {}
  };

  window.huskr.models.User = Backbone.Model.extend();
  window.huskr.models.Status = Backbone.Model.extend({
    initialize: function() {
      if ( ! this.get('created_at') ) {
        this.set({ 'created_at': new Date().toISOString() });
      }
    }
  });
  window.huskr.collections.statusList = new (Backbone.Collection.extend({
    url: 'http://huskr.herokuapp.com/api/v1/statuses.json',
    model: window.huskr.models.Status,
    comparator: function( model ) {
      return new Date( model.get('created_at') );
    }
  }));

  $(function(){
    window.huskr.views.Status = Backbone.View.extend({
      tagName: "div",
      className: "row",
      template: _.template( $("#status-view").html() ),
      initialize: function() {
        _.bindAll( this, "render" );
        this.model.on( "change", this.render );
      },
      render: function() {
        $( this.el ).html( this.template(this.model.toJSON()) );
        return this;
      }
    });

    window.huskr.views.StatusList = Backbone.View.extend({
      el: $("#statuses"),
      initialize: function() {
        _.bindAll( this, "renderOne", "render" );
        this.collection.bind( "reset", this.render );
        this.collection.bind( "add", this.renderOne );
      },
      render: function() {
        this.$el.empty();
        this.collection.each( this.renderOne );
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

    window.huskr.collections.statusList.fetch();

  });

})(this);