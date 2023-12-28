const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());

const server = app.listen(3000, () => {
  console.log("The server is running on port 3000");
});

const wss = new WebSocket.Server({ server });

const centerPoint = {
  lat: 48.015884, // Set the desired center latitude
  lon: 37.802849, // Set the desired center longitude
};

wss.on("connection", (ws) => {
  console.log("The client has connected");

  const intervalId = setInterval(() => makePointsAndSendSignal(ws), 2000);

  ws.on("close", () => {
    clearInterval(intervalId);
  });
});

const makePointsAndSendSignal = (ws) => {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const point = {
      timestamp: Date.now(),
      frequency: Math.random() * 1000,
      point: {
        lat: centerPoint.lat + Math.random() * 0.08 - 0.05,
        lon: centerPoint.lon + Math.random() * 0.08 - 0.05,
      },
    };

    point.zone = [
      {
        lat: point.point.lat + Math.random() / 20 * 0.3,
        lon: point.point.lon + Math.random() / 20 * 0.3,
      },
      {
        lat: point.point.lat - Math.random() / 20 * 0.3,
        lon: point.point.lon - Math.random() / 20 * 0.3,
      },
      {
        lat: point.point.lat + Math.random() / 20 * 0.3,
        lon: point.point.lon + Math.random() / 20 * 0.3,
      },
      {
        lat: point.point.lat - Math.random() / 20 * 0.3,
        lon: point.point.lon - Math.random() / 20 * 0.3,
      },
    ];

    points.push(point);
  }

  console.log(points);
  ws.send(JSON.stringify(points));
};
