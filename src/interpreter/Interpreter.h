#ifndef INTERPRETER_H
#define INTERPRETER_H

#include <functional>

#include "../common/keys.h"
#include "../common/types.h"
#include "../controllers/Controller.h"
#include "../decoder/Decoder.h"
#include "../decoder/Event.h"
#include "Rule.h"
#include "modules/Module.h"

namespace absolem {

    using Callback = std::function<bool (Module*)>;

    class Interpreter {
        public:
        Interpreter(Controller* c, Decoder* d) : controller(c), decoder(d) {}

        void tick(List<Event> events);

        void addRule(VirtualKey key, List<Rule> rule);
        void addModule(Module* module);
        void complete(Size num);

        Controller* getController();
        Decoder* getDecoder();
        List<Event>& getQueue();
        Module* getModule(String name);
        Key getPhysicalKey();
        VirtualKey getVirtualKey();
        Time getCurrentTime();
        Time getLastUpdate();

        private:
        void notify(String event, Callback callback);

        Controller* controller;
        Decoder* decoder;
        List<Event> queue;
        Time currentTime;
        Time lastUpdate;
        Key physicalKey;
        VirtualKey virtualKey;
        Map<VirtualKey, List<Rule>> rules;
        Map<String, Module*> modules;
        Map<String, List<Pair<Byte, Module*>>> priorities;
    };

} // namespace absolem

#endif