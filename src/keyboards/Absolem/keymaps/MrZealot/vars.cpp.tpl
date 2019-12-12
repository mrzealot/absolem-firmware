#include "src/interpreter/triggers/PressTrigger.h"
#include "src/interpreter/triggers/MultiTrigger.h"

#include "src/interpreter/actions/KeyCodeAction.h"
#include "src/interpreter/actions/ResetAction.h"
#include "src/interpreter/actions/LayerAction.h"
#include "src/interpreter/actions/SequenceAction.h"
#include "src/interpreter/actions/FlushAction.h"
#include "src/interpreter/actions/ConsumerAction.h"
#include "src/interpreter/actions/BatteryAction.h"

#include "src/interpreter/modules/ReporterModule.h"
#include "src/interpreter/modules/CacheModule.h"
#include "src/interpreter/modules/LayerModule.h"
#include "src/interpreter/modules/SleepModule.h"

#include "src/hidspec/keycodes_hungarian.h"

ReporterModule reporter;
CacheModule cache;
LayerModule layer(100);

