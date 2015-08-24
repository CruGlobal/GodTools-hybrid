angular.module('GodTools')
  .controller('SettingsCtrl', function(GTLanguages) {
    this.languages = [{code: 'en', name: 'English', packages: ['kgp']}]
    GTLanguages.languages().then(function(languages){
      this.languages = languages;
      console.log(this.languages)
    })
  })
