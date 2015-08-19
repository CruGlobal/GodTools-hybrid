angular.module('GodTools')
  .controller('HomeCtrl', function($scope) {
    this.packages = [{code: 'jgp', name: "Knowing God Personally"}]

    this.test = function() {
      alert('poop')
    }
  })
