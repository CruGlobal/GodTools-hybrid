angular.module('GodTools')
.factory('customLoader', function ($q, GTLanguages) {
  return function(options) {
    var deferred = $q.defer();

    GTLanguages.fetchLanguage(options.key, 'kgp').then(function(data) {
      var translations = {};
      angular.forEach(data.translatedPages, function(page) {
        angular.extend(translations, page.translatedStrings)
      });
      deferred.resolve(translations)
    },function(){
      deferred.reject(options.key)
    });

    return deferred.promise
  }
})


  .factory('GTLanguages', function($http, $q){
    var fact = {};
    var languageList = undefined;
    var primaryLanguage = localStorage.getItem('primaryLang') || 'en';
    fact.getPrimary = function(){
      return primaryLanguage;
    };
    fact.setPrimary = function(newLangCode) {
      localStorage.setItem('primaryLang', newLangCode);
      primaryLanguage = newLangCode;
    };
    fact.languages = function(){
      var deferred = $q.defer();
      if(languageList) {
        deferred.resolve(languageList);
      }
      else {
        $http.get('https://api.stage.godtoolsapp.com/godtools-api/rest/meta',
          {
            headers: {'Accept' : 'application/json'},
            transformResponse: function(value) {
              value = JSON.parse(value)
              var languages = [];
              angular.forEach(value.languages, function(l) {
                if(l.packages && l.packages.length && l.packages.length > 0)
                  languages.push(l)
              });
              return languages;
            }
          }).success(function(data) {
            languageList = data;
            deferred.resolve(languageList)
          }).error(function() { deferred.reject('Failed to load language list.')})
      }
      return deferred.promise
    };

    fact.fetchLanguage = function(langCode, packageCode) {
      var getAllPages = function(pages) {
        var promises = [];
        angular.forEach(pages, function(p) {
          promises.push(fact.fetchPage(langCode, packageCode, p.filename))
        });
        return $q.all(promises)
      };
      var localStorageKey = langCode+'/'+packageCode;
      return $q(function(resolve, reject) {
        var config = window.localStorage.getItem(localStorageKey);
        if(config) {
          config = JSON.parse(config);
          getAllPages(config.pageSet).then(function(allPages) {
            config.translatedPages = allPages;
            resolve(config)
          }, function() {
            reject('Failed to load pages.')
          })
        }
        else {
          $http.get('https://api.stage.godtoolsapp.com/godtools-api/rest/translations/'
                      +langCode+'/'+packageCode+'/config')
            .success(function(data) {
              window.localStorage.setItem(localStorageKey, JSON.stringify(data))
              getAllPages(data.pageSet).then(function(allPages) {
                data.translatedPages = allPages;
                resolve(data);
              }, function() {
                reject()
              })
            })
            .error(function() { reject('Failed to load config.')})
        }
      })
    };

    fact.fetchPage =  function(langCode, packageCode, page) {
      var localStorageKey = langCode+'/'+packageCode+'/'+page;
      return $q(function(resolve, reject) {
        var pageDetails = window.localStorage.getItem(localStorageKey);
        if(pageDetails) {
          pageDetails = JSON.parse(pageDetails);
          resolve(pageDetails)
        }
        else {
          $http.get('https://api.stage.godtoolsapp.com/godtools-api/rest/translations/'
                      +langCode+'/'+packageCode+'/pages/'+page)
            .success(function(data) {
              window.localStorage.setItem(localStorageKey, JSON.stringify(data))
              resolve(data)
            })
            .error(function() { reject('Failed to load page: '+page+'.')})
        }
      })
    };
    return fact
  });
