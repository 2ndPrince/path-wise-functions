/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {generateFromVertex} from "./vertex";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

/**
 * Generates a random integer between 1 and 100 (inclusive).
 *
 * @return {number} A random integer between 1 and 100.
 */
function getRandomInt(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export const helloWorld = onRequest(
  {
    cors: ["https://path-wise-792e5.web.app", "http://localhost:3000"], // ✅ 이 형식만 허용됨
  }, (request, response) => {
    logger.info("Hello logs!", {structuredData: true});
    response.json({message: "Hello from Firebase!" + " " + getRandomInt()});
  });

export const askVertexAI = onRequest(
  {
    cors: ["https://path-wise-792e5.web.app", "http://localhost:3000"],
  },
  async (req, res) => {
    try {
      const message = req.body.message;
      if (!message || typeof message !== "string") {
        res.status(400).json({error: "Missing or invalid message."});
        return;
      }

      const result = await generateFromVertex(message);
      res.status(200).json({response: result}); // ✅ return 안 함
    } catch (err) {
      res.status(500)
        .json({error: "Failed to generate response from Vertex AI."});
    }
  }
);
