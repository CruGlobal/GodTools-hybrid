// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('GodTools', ['ionic', 'pascalprecht.translate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl as home'
    })
    .state('view', {
      url: '/kgp/:languageid',
      templateUrl: 'pager/pager.html',
      controller: 'PackagePagerCtrl as pager'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'settings/settings.html',
      controller: 'SettingsCtrl as settingsPage'
    })
    .state('lang-pick', {
      url: '/settings/lang/:primary',
      templateUrl: 'settings/lang-picker.html',
      controller: 'LangPickerCtrl as langPicker'
    })

    $translateProvider.useLoader('customLoader', {});
    //$translateProvider.useCookieStorage();
    $translateProvider.preferredLanguage('en');

    $ionicConfigProvider.backButton.previousTitleText(false);
})
