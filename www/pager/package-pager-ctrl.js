angular.module('GodTools')
  .controller('PackagePagerCtrl', function($translate, $ionicSlideBoxDelegate, GTLanguages) {
    this.showBars = false;
    this.pageNumbers = [1,2,3,4,5]

    this.toggleBars = function(value) {
      if(value === undefined)
        value = !this.showBars;
      this.showBars = value;
    }

    this.toggleLanguage = function() {
      var parallelCode =  GTLanguages.parallelCode();
      if($translate.use() == parallelCode)
        $translate.use(GTLanguages.primaryCode())
      else
        $translate.use(parallelCode)
    }

    var i = 1;
    this.addPage = function(){
      this.pageNumbers.push(++i)
      $ionicSlideBoxDelegate.update()
    }
  })
