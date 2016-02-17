angular.module('GodTools')
  .controller('PackagePagerCtrl', function ($scope, $translate, $ionicSlideBoxDelegate, $sce, GTLanguages, NewLangLoader) {
      this.showBars = false;
      //TODO Add a loading screen page as the default value for pageNumbers
    this.pageNumbers = [];
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

    NewLangLoader.fetchLanguage().then(function (pages) {
      that.pageNumbers = [];
      angular.forEach(pages, function (page) {
          that.pageNumbers.push({ title: page.__text, html: $sce.trustAsHtml(page.html) })
      });
      $ionicSlideBoxDelegate.update();
    })
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
  })

  // override angular-translate directive to prevent translating of strings.
  //.directive('translate', function(){
  //  return {
  //    priority: 1,
  //    terminal: true
  //  }
  //})
  //
  //.directive('title', function($compile){
  //  return {
  //    restrict: 'E',
  //    link: function (scope, element, attrs) {
  //      element[0].outerHTML = element[0].outerHTML.replace('<title','<gt-title').
  //        replace('</title>','</gt-title>').
  //        replace(new RegExp('&lt;', 'g'),'<').
  //        replace(new RegExp('&gt;', 'g'),'>');
  //      $compile(element.contents())(scope);
  //    }
  //  }
  //})
  //
  //  .directive('button', function ($compile) {
  //      return {
  //          restrict: 'E',
  //          link: function (scope, element, attrs) {
  //              element[0].outerHTML = element[0].outerHTML.replace('<button>', '<gt-button class="button button-full">').
  //                  replace('<button mode="big">', '<gt-button class="button button-full">').
  //                  replace(new RegExp('<button yoffset="-?[0-9]*">', 'g'), '<gt-button class="button button-full">').
  //                  replace('</button>', '</gt-button>').
  //                  replace(new RegExp('&lt;', 'g'), '<').
  //                  replace(new RegExp('&gt;', 'g'), '>');
  //              $compile(element.contents())(scope);
  //          }
  //      }
  //  })
  //
  //.directive('page', function($compile){
  //  return {
  //    scope: {
  //      colorCode: '@color',
  //      image: '@backgroundimage'
  //    },
  //    link: function (scope, element, attrs) {
  //      element.css('background-color', scope.colorCode)
  //      //console.log(scope.colorCode)
  //      //$compile(element.contents())(scope);
  //    }
  //  }
  //});
