#include "src/controllers/Nrf52Bluefruit.h"
#include "src/decoder/wiring/MatrixWiring.h"
#include "src/decoder/debounce/DebouncePerKey.h"
#include "src/decoder/Decoder.h"
#include "src/interpreter/Interpreter.h"

Nrf52Bluefruit controller;
MatrixWiring wiring(&controller, KEYBOARD_ROWS, KEYBOARD_COLS);
DebouncePerKey debounce(&controller, DEBOUNCE_DELAY);
Decoder decoder(&wiring, &debounce);

Interpreter interpreter(&controller, &decoder);