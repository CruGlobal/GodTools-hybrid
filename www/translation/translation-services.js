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
    fact.languages = function(){
      return $http.get('https://api.stage.godtoolsapp.com/godtools-api/rest/meta',
        {
          headers: {'Accept' : 'application/json'}
        })
    };

    fact.fetchLanguage = function(langCode, packageCode) {
      var getAllPages = function(pages) {
        var promises = [];
        angular.forEach(pages, function(p) {
          promises.push(fact.fetchPage(langCode, packageCode, p.filename))
        });
        return $q.all(promises)
      };
      return $q(function(resolve, reject) {
        var config = window.localStorage.getItem(langCode+'/'+packageCode);
        if(config) {
          config = JSON.parse(config);
          getAllPages(config.pageSet).then(function() {
            resolve(config)
          }, function() {
            reject('Failed to load pages.')
          })
        }
        else {
          $http.get('https://api.stage.godtoolsapp.com/godtools-api/rest/translations/'
                      +langCode+'/'+packageCode+'/config')
            .success(function(data) {
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
      return $q(function(resolve, reject) {
        var pageDetails = window.localStorage.getItem(page);
        if(pageDetails) {
          pageDetails = JSON.parse(pageDetails);
          resolve(pageDetails)
        }
        else {
          $http.get('https://api.stage.godtoolsapp.com/godtools-api/rest/translations/'
                      +langCode+'/'+packageCode+'/pages/'+page)
            .success(function(data) {
              resolve(data)
            })
            .error(function() { reject('Failed to load page: '+page+'.')})
        }
      })
    };
    return fact
  });
