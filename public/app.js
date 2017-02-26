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
        self.downpath = '';
        self.directories = [];
        
        (function() {
            scan();
            $http.get('destination').success(function (target) {
                self.target = target;
            });
            $http.get('dowpath').success(function (downpath) {
                self.downpath = downpath;
            });
        })();
        
        self.move = move;
        self.propDest = propDest;
        
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
        
        function propDest(){
            var lengthDownpath = self.downpath.length;
            var prop = self.src.substring(lengthDownpath);
            self.dest = prop;
        }
        
        function scan() {
            $http.get('scan').success(function (directories) {
                self.directories = directories;
            });
        }
    }
})();