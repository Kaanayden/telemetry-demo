//example get post request express js api

const { DiagLogLevel } = require("@opentelemetry/api");
const { register } = require("../../dist/index.js");

register(
    {
        endpoint: "http://localhost:4317",
        instruments: [ "http"],
        serviceName: "test-service",
        logLevel: DiagLogLevel.DEBUG,
    }
);

const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies from POST requests
app.use(express.json());

// GET request - for retrieving data
app.get('/api/data', (req, res) => {
  res.status(200).json({
    message: 'This is a GET request',
    data: {
      id: 1,
      name: 'Sample Data'
    }
  });
});

// POST request - for sending data
app.post('/api/data', (req, res) => {
  const { id, name } = req.body; // Extract data from the request body

  // You can add logic here to process the data

  res.status(201).json({
    message: 'This is a POST request',
    data: {
      id: id || 2,
      name: name || 'New Data'
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});