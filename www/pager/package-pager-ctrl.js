angular.module('GodTools')
  .controller('PackagePagerCtrl', function($translate) {
    this.showBars = false;
    this.pageSrc = 'kgp/slide1.html';

    this.toggleBars = function(value) {
      if(value === undefined)
        value = !this.showBars;
      this.showBars = value;
    }

    this.currentLang = 'en'
    this.toggleLanguage = function() {
      if(this.currentLang == 'en')
        $translate.use(this.currentLang = 'zh')
      else
        $translate.use(this.currentLang = 'en')
    }
  })
