angular.module('GodTools')
  .controller('SettingsCtrl', function($scope, GTLanguages) {
    this.languages = [{code: 'en', name: 'English', packages: ['kgp']}];
    var that = this;

    $scope.$on('$ionicView.beforeEnter', function(){
      that.primaryLang = "";
      that.parallelLang = "None"
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
      var primaryCode = GTLanguages.primaryCode();
      var parallelCode = GTLanguages.parallelCode();
      angular.forEach(that.languages, function(lang) {
        if(lang.code == primaryCode)
          that.primaryLang = lang.name;
        else if(lang.code == parallelCode)
          that.parallelLang = lang.name;
      })
    };
  });
