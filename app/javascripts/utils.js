define([ 'sugar' ], function() {
  return {
    formatDate: function( date ) {
      return Date.create( date ).relative();
    }
  };
});