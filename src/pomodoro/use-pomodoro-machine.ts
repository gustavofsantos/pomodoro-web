import { useMachine } from "@xstate/react";
import { formatToMinutes } from "./format-to-minutes";
import { createPomodoroMachine } from "./pomodoro-machine";

export function usePomodoroMachine() {
  const [state, send] = useMachine(createPomodoroMachine());

  const value = state.context.value;
  const time = formatToMinutes(value);

  const isWorkTimer = state.matches("workTimer");
  const isShortRestTimer = state.matches("shortRestTimer");
  const isLongRestTimer = state.matches("longRestTimer");

  const isWorkTimerPaused = state.matches("workTimerPaused");

  const isPaused = isWorkTimerPaused;
  const isRunning = isWorkTimer;

  const start = () => send("START");
  const pause = () => send("PAUSE");
  const stop = () => send("STOP");

  return {
    value,
    time,
    start,
    pause,
    stop,
    isRunning,
    isPaused,
    isWorkTimer,
    isShortRestTimer,
    isLongRestTimer,
    isWorkTimerPaused,
  };
}
