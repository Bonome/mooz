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
            list();
            $http.get('destination').success(function (target) {
                self.target = target;
            });
            $http.get('down').success(function (downpath) {
                self.downpath = downpath;
            });
        })();
        
        self.move = move;
        self.propDest = propDest;
	    self.delSource = delSource;
	    self.scan = scan;
	    self.refresh = refresh;
        
        function move() {
            var data = {
        		id: self.id,
                src: self.src,
                dest: self.target + '/' + self.dest
            }
            $http.post('move', data).success(function (response) {
                if(response) {
                    list();
                }
            });
        }
        
        function propDest(id){
    	    self.id = id;
            var lengthDownpath = self.downpath.length;
            var prop = self.src.substring(lengthDownpath);
            prop = prop.replace(/\[.*\]/i,'');
            self.dest = prop;
        }

	    function delSource(source) {
	        var data = {
                src: source
            }
            $http.post('remove', data).success(function (response) {
                if(response) {
                    list();
                }
            });
    	}
        
        function scan() {
            $http.get('scan').success(function (directories) {
                self.directories = directories;
            });
        }

        function list() {
            $http.get('dirs').success(function (directories) {
                self.directories = directories;
            });
        }

	    function refresh(dir) {
	        var data = {
                src: dir
            }
            $http.post('refresh', data).success(function (response) {
                if(response) {
                    list();
                }
            });
    	}
    }
})();
