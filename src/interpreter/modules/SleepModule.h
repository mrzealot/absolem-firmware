#ifndef SLEEP_MODULE_H
#define SLEEP_MODULE_H

#include "Module.h"

namespace absolem {

    class SleepModule : public Module {
        public:
        SleepModule() :
            Module("sleep"),
            sleepTicks(0),
            tickFrequency(TICK_FREQ) {}

        virtual bool onBeforeEnqueue(List<Event>& e) override;

        virtual bool onAfterTick() override;
        virtual Byte onAfterTickPriority() override;

        private:
        Time start;
        Time sleepTicks;
        uint32_t tickFrequency;
    };

} // namespace absolem

#endif