angular.module('GodTools')
  .controller('LangPickerCtrl', function($stateParams, GTLanguages) {
    var primaryLang = !($stateParams.primary == "false");
    this.title = primaryLang ? "Language" : "Parallel Language"
    this.languages = [{code: 'en', name: 'English', packages: ['kgp']}];
    var that = this
    GTLanguages.languages().then(function(languages){
      that.languages = [];
      angular.forEach(languages, function(lang) {
        lang = angular.copy(lang)
        if(lang.code == (primaryLang ? 'en' : 'zh')) {
          lang.selected = true;
        }
        if(localStorage.getItem(lang.code+'/'+lang.packages[0].code))
          lang.downloaded = true;
        that.languages.push(lang)
      })
    })
  })
