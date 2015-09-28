window.ChaiBioTech.ngApp

.config [
  '$stateProvider'
  '$urlRouterProvider'
  '$locationProvider'
  ($stateProvider, $urlRouterProvider) ->

      $urlRouterProvider.otherwise("/home");

      $stateProvider

      .state 'signup',
        url: '/signup'
        templateUrl: 'app/views/signup.html'
        controller: 'SignUpCtrl'

      .state 'login',
        url: '/login'
        templateUrl: 'app/views/login.html'
        controller: 'LoginCtrl as LoginCtrl'

      .state 'home',
        url: '/home'
        templateUrl: 'app/views/home.html'
        controller: 'HomeCtrl as HomeCtrl'

      .state 'settings',
        url: '/user/settings'
        templateUrl: 'app/views/user/settings.html'
        controller: 'UserSettingsCtrl'

      .state 'edit-protocol',
        url: '/edit-protocol/:id'
        templateUrl: 'app/views/skelton.html'
        controller: 'ProtocolCtrl'

      .state 'temperatureLog',
        url: '/experiments/:id/temperature-logs'
        templateUrl: 'app/views/experiment/temperature-logs.html'

      .state 'amplification-chart',
        url: '/experiments/:id/amplification'
        templateUrl: 'app/views/experiment/amplification-chart.html'



]