/*
 * Chai PCR - Software platform for Open qPCR and Chai's Real-Time PCR instruments.
 * For more information visit http://www.chaibio.com
 *
 * Copyright 2016 Chai Biotechnologies Inc. <info@chaibio.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

window.ChaiBioTech.ngApp.directive('chartType', [
  function() {
    return {
      restric: 'EA',
      replace: true,
      scope: {
        name: '@name',
        image: '@image',
        second: '@second',
        callChart: '@callChart',
        type: '@type',
        current: '@current',
      },

      templateUrl: 'app/views/directives/chart-type.html',

      link: function(scope, attr, elem) {
        scope.hover = '';
        scope.originalImage = scope.image;

        scope.$watch('hover', function(newVal, oldVal) {

          if(newVal == 'hover') {
            scope.image = scope.originalImage + '-hover';
          } else {
            scope.selectedCheck(scope.current);
          }
        });

        scope.$watch('current', function(newVal) {
          scope.selectedCheck(newVal);
        });

        scope.selectedCheck = function(newVal) {
          if(newVal == scope.type) {
            scope.image = scope.originalImage + '-selected';
          } else {
            scope.image = scope.originalImage;
          }
        };
      }
    };
  }
]);
