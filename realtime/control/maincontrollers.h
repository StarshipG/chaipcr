#ifndef MAINCONTROLLERS_H
#define MAINCONTROLLERS_H

#include "instance.h"

#include "adccontroller.h"
#include "heatblock.h"
#include "heatsink.h"
#include "optics.h"
#include "lid.h"

#include "test/adccontrollermock.h"

class ADCControllerInstance : public Instance<ADCController>
{

};

class HeatBlockInstance : public Instance<HeatBlock>
{

};

class HeatSinkInstance : public Instance<HeatSink>
{

};

class OpticsInstance : public Instance<Optics>
{

};

class LidInstance : public Instance<Lid>
{

};

class ADCControllerMockInstance : public Instance<ADCControllerMock>
{

};


#endif // MAINCONTROLLERS_H
