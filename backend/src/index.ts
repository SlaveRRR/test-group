import express, { Application, json, urlencoded } from "express";
import cors from 'cors'
import groups from "./groups.json";
import { Group } from "./types";

const random = (min: number, max: number): number => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const app: Application = express();

const delay = (ms: number) =>
  new Promise((res, rej) => setTimeout(() => res(ms), ms));

const PORT = 3000;

// Middleware
app.use(cors())
app.use(json());
app.use(urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  await delay(1000);
  try {
    const status = random(1, 4);
    let response = {} as {
      result: 0 | 1;
      data: Group[];
    };
    switch (status) {
      case 1:
        response["result"] = 0;
        response["data"] = undefined;
        break;
      case 2:
        response["result"] = 1;
        response["data"] = groups;
        break;
      case 3:
        throw new Error("Suddenly error :(");
      case 4:
        response['result'] = 1
        return res.status(500).json(response)
    }
    return res.json(response)
  } catch (error) {
    return res.status(500).send(`Server error - ${error}`);
  }
});

/**
 * Обработка несуществующего роута
 */
app.use((req, res) => res.json("not found").status(404));

app.listen(PORT, () =>
  console.log(
    "\x1b[33m%s\x1b[0m",
    `Server started on port ${PORT}\nLink - http://localhost:${PORT}`
  )
);
