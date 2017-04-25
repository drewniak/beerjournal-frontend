import angular from "angular";
import uirouter from "angular-ui-router";
import "angular-material";
import "angular-base64"
import "angular-sessionstorage"

import "../style/app.css";

import routing from "./app.config.js";
import collections from "../features/collections";
import login from "../features/login";
import registration from "../features/registration"
import home from "../features/home";
import AddNewItemController from "../features/addNewItem"

let app = () => {
    return {
        template: require('./app.html'),
        controllerAs: 'app'
    }
};

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [uirouter, collections, login, registration, home, AddNewItemController, 'ngSessionStorage', 'ngMaterial','base64'])
    .directive('app', app)
    .config(routing)
    .run(run);

run.$inject = ['$rootScope', '$location', '$sessionStorage', '$http', '$base64'];
function run($rootScope, $location, $sessionStorage, $http, $base64) {
    $rootScope.globals = {};
    $rootScope.globals.currentUser = $sessionStorage.get('user');

    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode($rootScope.globals.currentUser.username + ':' + $rootScope.globals.currentUser.password);
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var loggedIn = $rootScope.globals && $rootScope.globals.currentUser;
        if (!loggedIn && $location.path() !== "/login" && $location.path() !== "/registration") {
            $location.path('/home');
        }
        if (loggedIn && $location.path() == "/login") {
            $location.path('/collections');
        }
    });
}


export default MODULE_NAME;