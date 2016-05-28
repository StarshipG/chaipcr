//
// Chai PCR - Software platform for Open qPCR and Chai's Real-Time PCR instruments.
// For more information visit http://www.chaibio.com
//
// Copyright 2016 Chai Biotechnologies Inc. <info@chaibio.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

#include <cmath>

#include "filters.h"

////////////////////////////////////////////////////////////////////
// Namespace Filters
double Filters::CutoffFrequencyForTimeConstant(double timeConstant) {
    return (1.0 / (2 * M_PI * timeConstant));
}

////////////////////////////////////////////////////////////////////
// Class SinglePoleRecursiveFilter
SinglePoleRecursiveFilter::SinglePoleRecursiveFilter(double a0, double b1):
    _a0 {a0},
    _b1 {b1},
    _z1 {0} {}
//------------------------------------------------------------------------------
SinglePoleRecursiveFilter::SinglePoleRecursiveFilter(double cutoffFrequency):
    _z1 {0} {

    _b1 = exp(-2.0 * M_PI * cutoffFrequency);
    _a0 = 1.0 - _b1;
}
