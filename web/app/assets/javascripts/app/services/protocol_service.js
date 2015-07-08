window.ChaiBioTech.ngApp.service('ExperimentLoader', [
  'Experiment',
  '$q',
  '$stateParams',
  '$rootScope',
  '$http',
  function(Experiment, $q, $stateParams, $rootScope, $http) {

    this.protocol = {};
    this.index = 0;

    this.getExperiment = function() {

      var delay, that = this;
      delay = $q.defer();
      Experiment.get({'id': $stateParams.id}, function(data) {
        that.protocol = data.experiment;
        $rootScope.$broadcast("dataLoaded");
        delay.resolve(data);
      }, function() {
        delay.reject('Cant bring the data');
      });

      return delay.promise;
    };

    this.loadFirstStages = function() {
      return this.protocol.protocol.stages[0].stage;
    };

    this.loadFirstStep = function() {
      return this.protocol.protocol.stages[0].stage.steps[0].step;
    };

    this.getNew = function() {
      console.log(this.protocol);
      return this.protocol.protocol.stages[1].stage;
    };

    this.changeTemperature = function($scope) {

      var dataToBeSend = {'step':{'temperature': $scope.step.temperature}},
      url = "/steps/" + $scope.step.id,
      delay = $q.defer();

      $http.put(url, dataToBeSend)
        .success(function(data) {
          delay.resolve(data);
        })
        .error(function(data) {
          delay.reject(data);
        });

        return delay.promise;
    };

    this.addStep = function($scope) {

      var thisId = $scope.stage.id,
      dataToBeSend = {"prev_id": thisId},
      delay = $q.defer(),
      url = "/stages/"+ stageId +"/steps";

      $http.post(url, dataToBeSend)
        .success(function(data) {
          delay.resolve(data);
        })
        .error(function(data) {
          delay.reject(data);
        });
      return delay.promise;
    };

    this.deleteStep = function($scope) {

      var that = this,
      url = "/steps/" + $scope.step.id,
      delay = $q.defer();

      $http.delete(url)
        .success(function(data) {
          delay.resolve(data);
        })
        .error(function(data) {
          delay.reject(data);
        }
      );
      return delay.promise;
    };

    this.gatherDuringStep = function($scope) {

      var that = this,
      dataToBeSend = {'step': {'collect_data': $scope.model.collect_data}},
      url = "/steps/" + $scope.step.id,
      delay = $q.defer();

      $http.put(url, dataToB)
        .success(function(data) {
          delay.resolve(data);
        })
        .error(function(data) {
          delay.reject(data);
        }
      );
      return delay.promise;

    };

    this.gatherDataDuringRamp = function($scope) {

      var dataToBeSend = {'ramp': {'collect_data': $scope.step.ramp.collect_data}},
      url = "/ramps/" + $scope.step.id,
      delay = $q.defer();

        $http.delete(url, dataToBeSend)
          .success(function(data) {
            delay.resolve(data);
          })
          .error(function(data) {
            delay.reject(data);
          }
        );
        return delay.promise;
    };

    this.changeRampSpeed = function($scope) {

      var dataToBeSend = {'ramp': {'rate': $scope.step.ramp.rate}},
      url = "/ramps/" + $scope.step.id,
      delay = $q.defer();

      $http.put(url, dataToBeSend)
        .success(function(data) {
          delay.resolve(data);
        })
        .error(function(data) {
          delay.reject(data);
        }
      );
      return delay.promise;
    };

    this.changeHoldDuration = function($scope) {

      var dataToBeSend = {'step': {'hold_time': $scope.step.hold_time}},
      url = "/steps/" + $scope.step.id,
      delay = $q.defer();

      $http.put(url, dataToBeSend)
        .success(function(data) {
          delay.resolve(data);
        })
        .error(function(data) {
          delay.reject(data);
        }
      );
      return delay.promise;
    };

    this.saveName = function($scope) {

      var dataToBeSend = {'step': {'name': $scope.step.name}},
      url = "/steps/" + $scope.step.id,
      delay = $q.defer();

      $http.put(url, dataToBeSend)
        .success(function(data) {
          delay.resolve(data);
        })
        .error(function(data) {
          delay.reject(data);
        }
      );
      return delay.promise;
    };

    this.changeDeltaTemperature = function($scope) {

      var dataToBeSend = {'step': {'delta_temperature': $scope.step.delta_temperature}},
      url = "/steps/" + $scope.step.id,
      delay = $q.defer();

      $http.put(url, dataToBeSend)
        .success(function(data) {
          delay.resolve(data);
        })
        .error(function(data) {
          delay.reject(data);
        }
      );
      return delay.promise;
    };

    this.changeDeltaTime = function($scope) {

      var dataToBeSend = {'step': {'delta_duration_s': $scope.step.delta_duration_s}},
      url = "/steps/" + $scope.step.id,
      delay = $q.defer();

      $http.put(url, dataToBeSend)
        .success(function(data) {
          delay.resolve(data);
        })
        .error(function(data) {
          delay.reject(data);
        }
      );
      return delay.promise;
    };

  }
]);
