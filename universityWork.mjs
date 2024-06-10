import { Worker } from "node:worker_threads";

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

const startTimeWithThread = new Date();

await Promise.all([
  createThread({
    from: 0,
    to: 1e9,
  }),
  createThread({
    from: 0,
    to: 1e9,
  }),
  createThread({
    from: 0,
    to: 1e10,
  }),
  createThread({
    from: 0,
    to: 1e10,
  }),
]).then((results) => {
  const endTimeWithThread = new Date();

  console.log(
    `With multithreading I processed items in ${
      endTimeWithThread - startTimeWithThread
    }ms`
  );
});

// now withou using worker threads

const startTimeWithoutThread = new Date();
let count = 0;
for (let i = 0; i < 1e9; i++) {
  count++;
}
for (let i = 0; i < 1e9; i++) {
  count++;
}
for (let i = 0; i < 1e10; i++) {
  count++;
}
for (let i = 0; i < 1e10; i++) {
  count++;
}

const endTimeWithoutThread = new Date();

console.log(
  `Without multithreading I processed items in ${
    endTimeWithoutThread - startTimeWithoutThread
  }ms`
);
