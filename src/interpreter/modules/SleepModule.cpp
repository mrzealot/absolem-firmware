#include "SleepModule.h"
#include "../Interpreter.h"

#if defined(DEBUG) && (defined(DEBUG_GLOBAL) || defined(DEBUG_SLEEPMODULE))
#define DD(x) x
#else
#define DD(x)
#endif

namespace absolem {

    bool SleepModule::onBeforeEnqueue(List<Event>& e) {
        auto* controller = interpreter->getController();
        start = controller->time();
        if (e.empty()) {
            sleepTicks++;
            if (sleepTicks >= SLEEP_TICKS) {
                sleepTicks = 0;
                controller->blink(10, 100);
                controller->blink(10, 300);
                controller->blink(10, 100);
                controller->blink(10, 0);
                interpreter->getDecoder()->sleep();
            } else if (tickFrequency == TICK_FREQ && sleepTicks >= LOW_RATE_TICKS) {
                controller->blink(10, 0);
                tickFrequency = TICK_FREQ_LOW;
            }
        } else {
            if (sleepTicks > LOW_RATE_TICKS) {
                controller->blink(10, 0);
            }
            tickFrequency = TICK_FREQ;
            sleepTicks = 0;
        }
    }

    bool SleepModule::onAfterTick() {
        auto* controller = interpreter->getController();
        Time stop = controller->time();
        Time diff = stop - start;
        if ((diff < tickFrequency) && (diff >= 0)) {
            controller->delay(tickFrequency - diff);
        }
    }

    Byte SleepModule::onAfterTickPriority() {
        return 255; // should come LAST!
    }

} // namespace absolem
