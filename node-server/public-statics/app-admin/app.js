var placely = angular.module('placely', ['ui.router']);

placely.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
                //  PAGE AND MULTIPLE NAMED VIEWS =================================
                .state('main', {
                    url: '/',
                    templateUrl: '../app-admin/features/main.html',
                    controller: 'MainCtrl'
                })
                .state('read', {
                    url: '/read',
                    templateUrl: '../app-admin/features/read/read.html',
                    controller: 'ReadCtrl'
                })
                .state('update', {
                    url: '/update/:id',
                    templateUrl: '../app-admin/features/update/update.html',
                    controller: 'UpdateCtrl'
                })
                .state('delete', {
                    url: '/delete/:id',
                    templateUrl: '../app-admin/features/delete/delete.html',
                    controller: 'DeleteCtrl'
                });

    }]);