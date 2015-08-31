angular.module('GodTools')
  .controller('PackagePagerCtrl', function($scope, $translate, $ionicSlideBoxDelegate, GTLanguages) {
    this.showBars = false;
    this.pageNumbers = [1,2,3,4,5];
    this.hasParallelLang = false;
    this.packageCode = 'kgp'

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

    var that = this;
    var determineCanShare = function(){
      that.canShare = window.plugins && window.plugins.socialsharing;
    };
    if(window.device) {
      determineCanShare();
    }
    else {
      document.addEventListener("deviceready", function(){
        $scope.$apply(function() {
          determineCanShare();
        })
      }, false);
    }
    this.share = function() {
      window.plugins.socialsharing.share(
        'http://www.godtoolsapp.com/?utm_source=godtools-ios&utm_campaign=app-sharing&package='+
        that.packageCode+'&language='+$translate.use()
      );
    };

    $scope.$on('$ionicView.beforeEnter', function(){
      that.hasParallelLang = !!GTLanguages.parallelCode();
    });
  })

  .directive('pageClick', function(){
    return {
      template: '<div class="page-cover" on-touch="pageClick()" ng-class="{open : allPageClick}"></div>',
      controller: function($scope) {
        $scope.allPageClick = false;
        $scope.$on('EnablePageClick', function() {
          $scope.allPageClick = true;
        });
        $scope.$on('DisablePageClick', function() {
          $scope.allPageClick = false;
        });
        $scope.pageClick = function(){
          $scope.$broadcast('BodyClicked')
        }
      }
    }
  })

  .directive('gtDetailsPopup', function(){
    return {
      scope: {
        popupID: '=gtDetailsPopup',
        title: '=titleString'
      },
      template: '<div ng-click="showPopup(); $event.stopPropagation();">{{title | translate}}</div>',
      controller: function($scope, $ionicPopup, $translate) {
        $scope.showPopup = function () {
          $scope.$emit('EnablePageClick');
          var template = "<div>Ahh!</div>";
          var cssClass = undefined;
          if(window.kgpPanels[$scope.popupID]) {
            cssClass = 'popup-'+window.kgpPanels[$scope.popupID].color;
            template = window.kgpPanels[$scope.popupID].template;
          }
          myPopup = $ionicPopup.show({
            template: template,
            title: $translate.instant($scope.title),
            cssClass: cssClass
          });
        };

        $scope.$on('BodyClicked', function() {
          myPopup.close();
          $scope.$emit('DisablePageClick');
        });
      }
    }
  });
