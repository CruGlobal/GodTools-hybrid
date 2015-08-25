angular.module('GodTools')
  .controller('SettingsCtrl', function($scope, GTLanguages) {
    this.languages = [{code: 'en', name: 'English', packages: ['kgp']}];
    this.primaryLang = "";
    this.parallelLang = "None"
    var that = this;

    $scope.$on('$ionicView.beforeEnter', function(){
      if(that.languages.length > 1) {
        getLangNames()
      }
      else {
        GTLanguages.languages().then(function(languages){
          that.languages = languages;
          getLangNames();
        })
      }
    });

    var getLangNames = function() {
      var primaryCode = GTLanguages.getPrimary();
      angular.forEach(that.languages, function(lang) {
        if(lang.code == primaryCode)
          that.primaryLang = lang.name;
      })
    };
  });
