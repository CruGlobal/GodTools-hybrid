angular.module('GodTools')
  .controller('PackagePagerCtrl', function() {
    this.showBars = false;

    this.toggleBars = function(value) {
      if(value === undefined)
        value = !this.showBars;
      this.showBars = value;
    }
  })
