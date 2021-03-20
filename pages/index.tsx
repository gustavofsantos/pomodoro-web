import Head from "next/head";
import { usePomodoroMachine } from "../src/pomodoro/use-pomodoro-machine";

const messages = {
  work: "🛠️ Get the job done!",
  shortRest: "🚶 Take a walk",
  longRest: "☕ Rest for a while",
};

export default function Home() {
  const timer = usePomodoroMachine();

  return (
    <div
      className={
        timer.isWorkTimer || timer.isWorkTimerPaused
          ? "w-full h-full text-lg subpixel-antialiased transition duration-300 ease-in-out text-red-100 bg-gradient-to-br from-red-300 to-red-500 dark:from-red-500 dark:to-red-800"
          : "w-full h-full text-lg subpixel-antialiased transition duration-300 ease-in-out text-green-100 bg-gradient-to-br from-green-300 to-green-500 dark:from-green-500 dark:to-green-800"
      }
    >
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>
          ({timer.time}){" "}
          {timer.isWorkTimer
            ? messages.work
            : timer.isShortRestTimer
            ? messages.shortRest
            : timer.isLongRestTimer
            ? messages.longRest
            : "Pomodoro"}
        </title>
      </Head>

      <div
        style={{ width: timer.percentage + "%", height: "2px" }}
        className="fixed top-0 bg-opacity-50 bg-white z-0"
      />
      <div
        style={{ width: timer.percentage + "%" }}
        className="h-full fixed top-0 bg-white bg-opacity-10 z-0"
      />

      <main className="flex flex-col justify-center items-center w-full h-full z-10">
        <h3 className="font-bold">Pomodoro App</h3>

        <h1
          className={
            timer.isPaused
              ? "animate-pulse font-bold text-8xl font-mono mt-8 mb-8"
              : "font-bold text-8xl font-mono mt-8 mb-8"
          }
        >
          {timer.time}
        </h1>

        <div className="flex flex-col justify-center items center space-y-2 mt-4 mb-5 font-bold text-xl">
          {(timer.isWorkTimer || timer.isWorkTimerPaused) && (
            <span>{messages.work}</span>
          )}
          {(timer.isShortRestTimer || timer.isShortRestTimerPaused) && (
            <span>{messages.shortRest}</span>
          )}
          {(timer.isLongRestTimer || timer.isLongRestTimerPaused) && (
            <span>{messages.longRest}</span>
          )}
          {timer.isPaused && <span>Paused</span>}
        </div>

        <section className="flex justify-center items-center space-x-2 mt-4">
          <button
            className="font-bold p-2 pr-6 pl-6 border border-white border-opacity-30 bg-opacity-10 bg-white rounded-md disabled:opacity-20"
            onClick={timer.start}
            disabled={timer.isRunning}
          >
            Start
          </button>
          <button
            className="font-bold p-2 pr-6 pl-6 border border-white border-opacity-30 bg-opacity-10 bg-white rounded-md disabled:opacity-20"
            onClick={timer.pause}
            disabled={timer.isPaused || !timer.isRunning}
          >
            Pause
          </button>
          <button
            className="font-bold p-2 pr-6 pl-6 border border-white border-opacity-30 bg-opacity-10 bg-white rounded-md disabled:opacity-20"
            onClick={timer.stop}
            disabled={!timer.isRunning && !timer.isPaused}
          >
            Stop
          </button>
        </section>

        <section className="mt-6">
          {timer.cycles === 0 && (
            <span>Go ahead and complete your first cycle!</span>
          )}
          {timer.cycles === 1 && <span>One cycle done!</span>}
          {timer.cycles > 1 && <span>{timer.cycles} cycles done!</span>}
        </section>
      </main>
    </div>
  );
}
