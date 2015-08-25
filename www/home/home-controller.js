angular.module('GodTools')
  .controller('HomeCtrl', function($translate, GTLanguages) {
    this.packages = [{code: 'kgp', name: "Knowing God Personally"}]

    $translate.use(GTLanguages.primaryCode());
  })
