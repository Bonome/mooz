(function () {
    var app = angular.module('mbApp', ['ngMaterial','angular-loading-bar'])
            .config(function ($mdThemingProvider) {


                $mdThemingProvider.theme('default')
                        .primaryPalette('deep-orange')
                        .accentPalette('grey');

            }).controller('AppController', ['$http', AppController]);

    /**
     * Main Controller for the Angular Material Starter App
     * @param $mdSidenav
     * @param $log
     * @constructor
     */
    function AppController($http) {
        var self = this;
        self.target = '';
        self.directories = [];
        
        (function() {
            scan();
            $http.get('destination').success(function (target) {
                self.target = target;
            });
        })();
        
        self.move = move;
        
        function move() {
            var data = {
                src: self.src,
                dest: self.target + '/' + self.dest
            }
            $http.post('move', data).success(function (response) {
                if(response) {
                    scan();
                }
            });
        }
        function scan() {
            $http.get('scan').success(function (directories) {
                self.directories = directories;
            });
        }
    }
})();