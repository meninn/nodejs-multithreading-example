import { execSync } from "child_process";
import { Worker } from "node:worker_threads";

function getCurrentThreadCount() {
  // retorna a quantidade de threads do process
  return parseInt(execSync(`ps -M ${process.pid} | wc -l`).toString());
}

function createThread(data) {
  const worker = new Worker("./thread.mjs");

  const promise = new Promise((resolve, reject) => {
    worker.once("message", (message) => {
      return resolve(message);
    });
    worker.once("error", reject);
  });

  worker.postMessage(data);
  return promise;
}

const nodejsDefaultThreadNumber = getCurrentThreadCount() - 1; // ignora o process, pegando somente as threads
console.log(
  `I'm running ${process.pid} default threads: ${nodejsDefaultThreadNumber}`
);

let nodejsThreadCount = 0;
const intervalId = setInterval(() => {
  // console.log(`running at every sec: ${new Date().toISOString()}`)

  // dessa forma vemos somente as threads que criamos manualmente
  const currentThreads = getCurrentThreadCount() - nodejsDefaultThreadNumber;
  if (currentThreads == nodejsThreadCount) return;

  nodejsThreadCount = currentThreads;
  console.log("threads", nodejsThreadCount);
}, 200);

// for (let i = 0; i < 1e20; i++);

await Promise.all([
  (createThread({
    from: 0,
    to: 1e9,
  }),
  createThread({
    from: 0,
    to: 1e9,
  }),
  createThread({
    from: 0,
    to: 1e8,
  }),
  createThread({
    from: 0,
    to: 1e10,
  })),
]).then((results) => {
  console.log(results);
  //   clearInterval(intervalId);
});
