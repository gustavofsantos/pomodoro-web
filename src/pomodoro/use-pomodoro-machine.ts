import { useMachine } from "@xstate/react";
import { formatToMinutes } from "./format-to-minutes";
import {
  createPomodoroMachine,
  DEFAULT_LONG_REST_TIMER_LIMIT_MIN,
  DEFAULT_SHORT_REST_TIMER_LIMIT_MIN,
  DEFAULT_WORK_TIMER_LIMIT_MIN,
} from "./pomodoro-machine";

export function usePomodoroMachine() {
  const [state, send] = useMachine(createPomodoroMachine());

  const value = state.context.value;
  const cycles = state.context.completedCycles;
  const time = formatToMinutes(value);

  const isWorkTimer = state.matches("workTimer");
  const isWorkTimerPaused = state.matches("workTimerPaused");
  const isShortRestTimer = state.matches("shortRestTimer");
  const isShortRestTimerPaused = state.matches("shortRestTimerPaused");
  const isLongRestTimer = state.matches("longRestTimer");
  const isLongRestTimerPaused = state.matches("longRestTimerPaused");

  const percentage =
    (isWorkTimer || isWorkTimerPaused
      ? value / DEFAULT_WORK_TIMER_LIMIT_MIN
      : isShortRestTimer || isShortRestTimerPaused
      ? value / DEFAULT_SHORT_REST_TIMER_LIMIT_MIN
      : isLongRestTimer || isLongRestTimer
      ? value / DEFAULT_LONG_REST_TIMER_LIMIT_MIN
      : 0) * 100;

  const isPaused =
    isWorkTimerPaused || isShortRestTimerPaused || isLongRestTimerPaused;
  const isRunning = isWorkTimer || isShortRestTimer || isLongRestTimer;

  const start = () => send("START");
  const pause = () => send("PAUSE");
  const stop = () => send("STOP");

  return {
    value,
    time,
    percentage,
    cycles,
    start,
    pause,
    stop,
    isRunning,
    isPaused,
    isWorkTimer,
    isShortRestTimer,
    isLongRestTimer,
    isWorkTimerPaused,
    isShortRestTimerPaused,
    isLongRestTimerPaused,
  };
}
