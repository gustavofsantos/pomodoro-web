import Head from "next/head";
import { usePomodoroMachine } from "../src/pomodoro/use-pomodoro-machine";

const messages = {
  work: "Get the job done!",
  shortRest: "Take a walk",
  longRest: "Rest for a while",
};

export default function Home() {
  const timer = usePomodoroMachine();

  return (
    <div className="w-full h-full text-lg subpixel-antialiased text-red-100 bg-gradient-to-br from-red-300 to-red-500 dark:from-red-500 dark:to-red-700">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>
          ({timer.time}) 🍅{" "}
          {timer.isWorkTimer
            ? messages.work
            : timer.isShortRestTimer
            ? messages.shortRest
            : timer.isLongRestTimer
            ? messages.longRest
            : "Pomodoro"}
        </title>
      </Head>

      <main className="flex flex-col justify-center items-center w-full h-full">
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

        <div className="mt-4 mb-5 font-bold text-xl">
          {timer.isWorkTimer && <span>Do your work!</span>}
          {timer.isShortRestTimer && <span>Go walk for 5 min</span>}
          {timer.isLongRestTimer && <span>Rest for 15 min</span>}
        </div>

        <section className="flex justify-center items-center space-x-2 mt-4">
          <button
            className="font-bold p-2 pr-6 pl-6 border border-red-300 bg-opacity-10 bg-white rounded-md disabled:opacity-20"
            onClick={timer.start}
            disabled={timer.isRunning}
          >
            Start
          </button>
          <button
            className="font-bold p-2 pr-6 pl-6 border border-red-300 bg-opacity-10 bg-white rounded-md disabled:opacity-20"
            onClick={timer.pause}
            disabled={timer.isPaused || !timer.isRunning}
          >
            Pause
          </button>
          <button
            className="font-bold p-2 pr-6 pl-6 border border-red-300 bg-opacity-10 bg-white rounded-md disabled:opacity-20"
            onClick={timer.stop}
            disabled={!timer.isRunning && !timer.isPaused}
          >
            Stop
          </button>
        </section>
      </main>
    </div>
  );
}
