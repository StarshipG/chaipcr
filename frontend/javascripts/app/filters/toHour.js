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

window.ChaiBioTech.ngApp.filter('toHour', [
  '$filter',
  function($filter) {
    return function(value) {

      if(isNaN(value)) {
        return "";
      }
      var preZero = $filter('preZero');
      value = parseInt(value);
      var hrs = parseInt(value / 3600);
      var min = parseInt((value % 3600) / 60);
      var sec = (value % 60);

      return preZero(hrs) + ":" + preZero(min) + ":" + preZero(min);
    };
  }
]);
