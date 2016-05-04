(function () {

  App.controller('DiagnosticWizardCtrl', [
    '$scope',
    'Experiment',
    'Status',
    '$interval',
    'DiagnosticWizardService',
    '$stateParams',
    '$state',
    'CONSTANTS',
    function ($scope, Experiment, Status, $interval, DiagnosticWizardService, $params, $state, CONSTANTS) {

      $scope.$on('$destroy', function() {
        stopPolling();
        cancelAnimation();
      });

      $scope.CONSTANTS = CONSTANTS;
      $scope.lidTemps = null;
      $scope.blockTemps = null;
      var fetchingTemps = false;
      var temperatureLogs = [];
      var tempPoll = null;
      var animation;

      function fetchTempLogs () {
        if(!fetchingTemps) {
          fetchingTemps = true;
          var last_elapsed_time = temperatureLogs[temperatureLogs.length-1]? temperatureLogs[temperatureLogs.length-1].temperature_log.elapsed_time : -1;
          Experiment.getTemperatureData($scope.experiment.id, {starttime: last_elapsed_time*1+1})
          .then(function(resp) {
            if (resp.data.length === 0) return;
            var data = resp.data;
            updateData(angular.copy(data));
          })
          .finally(function () {
            fetchingTemps = false;
          });
        }
      }

      function updateData (data) {
        animate(angular.copy(temperatureLogs), angular.copy(data));
        temperatureLogs = temperatureLogs.concat(data);
        $scope.lidTemps = DiagnosticWizardService.temperatureLogs(temperatureLogs).getLidTemps();
        $scope.blockTemps = DiagnosticWizardService.temperatureLogs(temperatureLogs).getBlockTemps();
        // temperatureLogs = DiagnosticWizardService.temperatureLogs(temperatureLogs).getLast30seconds();
      }

      function animate (old, data) {

        cancelAnimation();
        var calibration = 50;
        var duration = 2500;//ms
        var calibration_index = 0;

        old = old.length > 0? old : data;
        $scope.min_x = $scope.min_x || old[0].temperature_log.elapsed_time;
        $scope.max_x = $scope.max_x ||old[old.length-1].temperature_log.elapsed_time;

        var x_diff = (data[data.length-1].temperature_log.elapsed_time) - $scope.max_x;
        var x_increment;
        // x_increment = x_increment || x_diff/calibration;
        x_increment = x_diff/calibration;

        animation = $interval(function () {

          if (calibration_index === calibration) {
            cancelAnimation();
          }

          if ($scope.max_x/1000 > 30) $scope.min_x = ($scope.min_x*1 + x_increment*1);
          $scope.max_x += x_increment;
          $scope.$broadcast('update:rainbow:chart');
          calibration_index ++;
        }, duration/calibration);

      }

      function cancelAnimation () {
        $interval.cancel(animation);
      }

      function pollTemperatures () {
        if (!tempPoll) tempPoll = $interval(fetchTempLogs, 1000);
      }
      function stopPolling () {
        $interval.cancel(tempPoll);
        tempPoll = null;
      }
      function getExperiment (cb) {
        if (!$params.id) return;
        cb = cb || angular.noop;
        return Experiment.get($params.id).then(function(resp) {
          return cb(resp.data);
        });
      }
      function analyzeExperiment () {
        if (!$scope.analyzedExp) {
          Experiment.analyze($params.id).then(function (resp) {
            $scope.analyzedExp = resp.data;
            console.log($scope.analyzedExp);
          });
        }
      }

      $scope.$watch(function() {
        return Status.getData();
      }, function(data, oldData) {
        var exp, newState, oldState, ref, ref1;
        if (!data) {
          return;
        }
        if (!data.experiment_controller) {
          return;
        }
        if (!data.experiment_controller.machine) {
          return;
        }
        newState = data.experiment_controller.machine.state;
        oldState = oldData !== null ? (ref = oldData.experiment_controller) !== null ? (ref1 = ref.machine) !== null ? ref1.state : void 0 : void 0 : void 0;
        $scope.status = newState === 'running' ? data.experiment_controller.machine.thermal_state : newState;
        $scope.heat_block_temp = data.heat_block.temperature;
        $scope.lid_temp = data.lid.temperature;
        if (data.experiment_controller.expriment) $scope.elapsedTime = data.experiment_controller.expriment.run_duration;

        if (!$scope.experiment) {
          getExperiment(function(resp) {
            $scope.experiment = resp.experiment;
            if (resp.experiment.started_at && !resp.experiment.completed_at) {
              pollTemperatures();
            }
            if (resp.experiment.started_at && resp.experiment.completed_at) {
              fetchTempLogs();
              if (resp.experiment.completion_status === 'success') analyzeExperiment();
              Status.stopSync();
            }
          });
        }
        if (newState === 'idle' && oldState !== 'idle' && $params.id) {
          stopPolling();
          Status.stopSync();
          getExperiment(function(resp) {
            $scope.experiment = resp.experiment;
            if($scope.experiment.completion_status === 'success') analyzeExperiment();
          });
        }
      });

      $scope.stopExperiment = function() {
        Experiment.stopExperiment({
          id: $scope.experiment.id
        }).then(function() {
          window.location.assign('/#/settings/');
        });
      };
    }
  ]);

})();