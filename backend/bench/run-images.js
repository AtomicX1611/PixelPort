import autocannon from "autocannon";

const target = process.env.BENCH_URL || "http://localhost:5000/api/places/images?page=1";
const duration = Number(process.env.BENCH_DURATION || 20); // seconds
const connections = Number(process.env.BENCH_CONN || 30);

const run = () => {
  console.log(`Benchmarking GET ${target} for ${duration}s with ${connections} connections`);
  const instance = autocannon({
    url: target,
    method: "GET",
    duration,
    connections,
    headers: {
      // Add auth header if your endpoint requires it
      // Authorization: `Bearer ${process.env.BENCH_TOKEN || ""}`
    },
  });

  autocannon.track(instance, { renderProgressBar: true });

  instance.on("done", (result) => {
    const { latency, requests, non2xx, timeouts, statusCodeStats = {} } = result;
    const reqMean = requests?.mean ?? requests?.average ?? 0;
    const reqP95 = requests?.p95 ?? requests?.['95%'] ?? 0;
    console.log("Summary -> latency p50/p95/p99 (ms):", latency.p50, latency.p95, latency.p99);
    console.log("Summary -> req/s avg/p95:", reqMean.toFixed(1), reqP95.toFixed(1));
    console.log("Non-2xx responses:", non2xx || 0, "timeouts:", timeouts || 0, "status codes:", statusCodeStats);
  });
};

run();
