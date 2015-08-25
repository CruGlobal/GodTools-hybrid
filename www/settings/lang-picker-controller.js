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
        GTLanguages.primaryCode(newLang.code);
        $translate.use(newLang.code)
      }
      else
        GTLanguages.parallelCode(newLang.code);
    };

    GTLanguages.languages().then(function(languages){
      that.languages = [];
      var primaryCode = GTLanguages.primaryCode();
      angular.forEach(languages, function(lang) {
        if(!primaryLang && lang.code == primaryCode)
          return;
        lang = angular.copy(lang);
        var selectedCode = primaryLang ? primaryCode : GTLanguages.parallelCode();
        if(lang.code == selectedCode) {
          lang.selected = true;
        }
        if(localStorage.getItem(lang.code+'/'+lang.packages[0].code))
          lang.downloaded = true;
        that.languages.push(lang)
      })
    })
  });
