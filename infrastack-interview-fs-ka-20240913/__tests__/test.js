const { DiagLogLevel } = require("@opentelemetry/api");
const { register } = require("../dist/index.js");
const path = require("path");
const http = require("http");

register(
    {
        endpoint: "http://localhost:4317",
        instruments: [ "http"],
        serviceName: "test-service",
        logLevel: DiagLogLevel.ALL,
    }
);

//example request with http

http.get("http://server.kaanaydeniz.com", (res) => {
    res.on("data", (data) => {
        console.log("test1");
    });
}
);

//exaple request with fetch

fetch("http://example-privacy-policy.kaanaydeniz.com")
    .then(() => {
        console.log("test2");
    });

// Example request with fetch
async function makeFetchRequest() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        const data = await response.json();
        console.log('Fetch response:', data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

makeFetchRequest();
