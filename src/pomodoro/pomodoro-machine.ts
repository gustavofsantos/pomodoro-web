import { assign, createMachine } from "xstate";

const WORK_TIMER_LIMIT_MIN = 25;
const SHORT_REST_TIMER_LIMIT_MIN = 5;
const LONG_REST_TIMER_LIMIT_MIN = 15;
const DEFAULT_INITIAL_VALUE = 0;

type Context = {
  timeMs: number;
  value: number;
  workTimerCount: number;
};

export const createPomodoroMachine = ({
  timeMs = 1000,
  initialValue = DEFAULT_INITIAL_VALUE,
} = {}) =>
  createMachine<Context>(
    {
      id: "pomodoro_machine",
      context: {
        timeMs,
        value: initialValue,
        workTimerCount: 0,
      },
      initial: "stopped",
      states: {
        stopped: {
          entry: assign({ value: DEFAULT_INITIAL_VALUE }),
          on: {
            START: "workTimer",
          },
        },
        workTimer: {
          invoke: {
            src: "intervalService",
          },
          entry: ["notifyStartWorkTimer"],
          on: {
            TICK: [
              {
                cond: (ctx) => ctx.value < WORK_TIMER_LIMIT_MIN * 60,
                actions: assign({ value: (ctx) => ctx.value + 1 }),
              },
              {
                cond: (ctx) => ctx.value >= WORK_TIMER_LIMIT_MIN * 60,
                target: "workTimerFinish",
              },
            ],
            PAUSE: "workTimerPaused",
            STOP: "stopped",
          },
        },
        workTimerPaused: {
          on: {
            START: "workTimer",
            STOP: "stopped",
          },
        },
        workTimerFinish: {
          entry: assign({ value: DEFAULT_INITIAL_VALUE }),
          always: [
            {
              cond: (ctx) => ctx.workTimerCount < 4,
              target: "shortRestTimer",
              actions: assign({
                workTimerCount: (ctx) => ctx.workTimerCount + 1,
              }),
            },
            {
              cond: (ctx) => ctx.workTimerCount === 4,
              target: "longRestTimer",
              actions: assign({
                workTimerCount: 0,
              }),
            },
          ],
        },
        shortRestTimer: {
          invoke: { src: "intervalService" },
          entry: ["notifyStartShortRestTimer"],
          on: {
            TICK: [
              {
                cond: (ctx) => ctx.value < SHORT_REST_TIMER_LIMIT_MIN * 60,
                actions: assign({ value: (ctx) => ctx.value + 1 }),
              },
              {
                cond: (ctx) => ctx.value >= SHORT_REST_TIMER_LIMIT_MIN * 60,
                target: "shortRestTimerFinish",
              },
            ],
            PAUSE: "shortRestTimerPaused",
            STOP: "stopped",
          },
        },
        shortRestTimerPaused: {
          on: {
            START: "shortRestTimer",
            STOP: "stopped",
          },
        },
        shortRestTimerFinish: {
          entry: assign({ value: DEFAULT_INITIAL_VALUE }),
          always: "workTimer",
        },
        longRestTimer: {
          invoke: { src: "intervalService" },
          entry: ["notifyStartLongRestTimer"],
          on: {
            TICK: [
              {
                cond: (ctx) => ctx.value < LONG_REST_TIMER_LIMIT_MIN * 60,
                actions: assign({ value: (ctx) => ctx.value + 1 }),
              },
              {
                cond: (ctx) => ctx.value >= LONG_REST_TIMER_LIMIT_MIN * 60,
                target: "workTimer",
              },
            ],
            PAUSE: "longRestTimerFinished",
            STOP: "stopped",
          },
        },
        longRestTimerPaused: {
          on: {
            START: "longRestTimer",
            STOP: "stopped",
          },
        },
        longRestTimerFinished: {
          entry: assign({ value: DEFAULT_INITIAL_VALUE }),
          always: "workTimer",
        },
      },
    },
    {
      actions: {
        resetTimer: assign({
          value: initialValue,
        }),
        notifyStartWorkTimer: () => {
          notify("Get the job done now!");
        },
        notifyStartShortRestTimer: () => {
          notify("Take a break, go walk!");
        },
        notifyStartLongRestTimer: () => {
          notify("Take a break, go eat something and go back in 15 minutes!");
        },
      },
      services: {
        intervalService: (ctx) => (send) => {
          const interval = setInterval(() => send("TICK"), ctx.timeMs);
          return () => clearInterval(interval);
        },
      },
    }
  );

function notify(message) {
  console.log("call notify");

  const doNotification = () => {
    const notification = new Notification(message);
  };

  if ("Notification" in window) {
    if (Notification.permission !== "granted") {
      Notification.requestPermission((permission) => {
        if (permission === "granted") {
          doNotification();
        }
      });
    } else {
      doNotification();
    }
  }
}