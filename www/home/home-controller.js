angular.module('GodTools')
  .controller('HomeCtrl', function($scope, $translate, GTLanguages) {
    this.packages = [{code: 'kgp', name: "Knowing God Personally"}]

    $translate.use(GTLanguages.primaryCode());

    var _scope = this;
    var determineCanShare = function(){
      _scope.canShare = window.plugins && window.plugins.socialsharing;
    };
    if(window.device) {
      determineCanShare();
    }
    else {
      document.addEventListener("deviceready", function(){
        $scope.$apply(function() {
          determineCanShare();
        })
      }, false);
    }

    this.share = function() {
      window.plugins.socialsharing.share('http://www.godtoolsapp.com/');
    };
  })
