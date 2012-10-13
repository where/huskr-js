define([
  'domReady',
  'mediator',
  'router',
  'modal',
  'collections/statuslist',
  'module'
], function( domReady, Mediator, Router, Modal, StatusListCollection, Module ) {
  return {
    bindings: function() {
      domReady(function() {
        Modal.$el.bind( "reveal:close", function() {
          Router.router.navigate(
            "",
            { replace: true }
          );
        } );

        $(Module.config().modalId).submit(function( e ) {
          var $this = $(this),
              user_name = $( "input[name=user_name]", $this ),
              title = $( "textarea[name=title]", $this );

          var created = StatusListCollection.create({
            'user_name': user_name.val(),
            'title': title.val()
          });

          if ( created ) {
            Modal.hide();
            title.val("");
          }

          e.preventDefault();
        });

        // post button listener
        
        $( "#postButton" ).click(function( e ) {

          // Ugh.
          Router.router.navigate(
            "post",
            { trigger: true, replace: true }
          );

          e.preventDefault();
        });
      });      
    },
    timers: function() {
      domReady(function() {
        setInterval( function() {
          Mediator.publish( "minute-tick" );
        }, 60*1000 );
      });
    }
  };
});