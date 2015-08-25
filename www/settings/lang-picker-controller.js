angular.module('GodTools')
  .controller('LangPickerCtrl', function($stateParams, $translate, GTLanguages) {
    var primaryLang = !($stateParams.primary == "false");
    this.title = primaryLang ? "Language" : "Parallel Language"
    this.languages = [{code: 'en', name: 'English', packages: ['kgp']}];

    this.selectLang = function(selectedLang) {
      if(!selectedLang.downloaded) {
        selectedLang.loading = true;
        selectedLang.downloaded = true;
        GTLanguages.fetchLanguage(selectedLang.code, selectedLang.packages[0].code)
          .then(function(){
            selectedLang.loading = false;
            changeSelectedTo(selectedLang);
          },
          function() {
            selectedLang.downloaded = false;
          })
      }
      else {
        changeSelectedTo(selectedLang);
      }
    };

    var that = this;
    var changeSelectedTo = function(newLang) {
      angular.forEach(that.languages, function(lang){
        lang.selected = (lang == newLang)
      });
      if(primaryLang) {
        GTLanguages.setPrimary(newLang.code);
        $translate.use(newLang.code)
      }
    };

    GTLanguages.languages().then(function(languages){
      that.languages = [];
      angular.forEach(languages, function(lang) {
        lang = angular.copy(lang)
        var selectedCode = primaryLang ? GTLanguages.getPrimary() : 'zh'
        if(lang.code == selectedCode) {
          lang.selected = true;
        }
        if(localStorage.getItem(lang.code+'/'+lang.packages[0].code))
          lang.downloaded = true;
        that.languages.push(lang)
      })
    })
  });
