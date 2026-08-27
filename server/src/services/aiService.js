import "dotenv/config";
import { GoogleGenAI } from "@google/genai";


// ======================================================
// API KEY
// ======================================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Check your .env file."
  );
}

console.log(
  "Gemini API key loaded:",
  Boolean(apiKey)
);


// ======================================================
// GEMINI CLIENT
// ======================================================

const ai = new GoogleGenAI({
  vertexai: false,
  apiKey: apiKey,
});

const GEMINI_MODEL =
  "gemini-3.6-flash";


// ======================================================
// SLEEP
// ======================================================

const sleep = (ms) => {
  return new Promise(
    (resolve) =>
      setTimeout(resolve, ms)
  );
};


// ======================================================
// RETRYABLE ERRORS
// ======================================================

const isRetryableError = (error) => {
  const status =
    error?.status;

  const networkCode =
    error?.cause?.code;

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    networkCode === "ECONNRESET" ||
    networkCode === "ETIMEDOUT" ||
    networkCode === "EAI_AGAIN"
  );
};


// ======================================================
// GEMINI RETRY LOGIC
// ======================================================

const generateWithRetry = async (
  config,
  maxRetries = 3
) => {

  console.log(
    "Gemini model being used:",
    config.model
  );

  for (
    let attempt = 0;
    attempt <= maxRetries;
    attempt++
  ) {

    try {

      console.log(
        `Sending Gemini request... Attempt ${
          attempt + 1
        }`
      );

      const response =
        await ai.models.generateContent(
          config
        );

      console.log(
        "Gemini response received"
      );

      return response;

    } catch (error) {

      console.error(
        `Gemini request failed - attempt ${
          attempt + 1
        }:`,
        error?.message
      );


      if (
        !isRetryableError(error)
      ) {
        throw error;
      }


      if (
        attempt === maxRetries
      ) {
        throw error;
      }


      const delay =
        Math.min(
          1000 * 2 ** attempt,
          8000
        ) +
        Math.floor(
          Math.random() * 500
        );


      console.log(
        `Temporary Gemini error. Retrying in ${delay}ms...`
      );


      await sleep(delay);
    }
  }


  throw new Error(
    "Gemini request failed after retries"
  );
};


// ======================================================
// JSON PARSER
// ======================================================

const parseGeminiJSON = (
  text
) => {

  try {

    return JSON.parse(text);

  } catch (error) {

    const cleanedText =
      text
        .replace(
          /```json/gi,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();


    try {

      return JSON.parse(
        cleanedText
      );

    } catch (
      secondError
    ) {

      console.error(
        "Gemini JSON parsing failed:",
        cleanedText
      );

      throw new Error(
        "Gemini returned invalid JSON"
      );
    }
  }
};


// ======================================================
// GENERATE TRIP ITINERARY
// ======================================================

export const generateTripItinerary =
  async (tripData) => {

    try {

      console.log(
        "Trip data received by AI service:",
        tripData
      );


      // ----------------------
      // Validation
      // ----------------------

      if (
        !tripData?.destination
      ) {

        throw new Error(
          "Destination is required"
        );
      }


      if (
        !tripData?.days
      ) {

        throw new Error(
          "Number of days is required"
        );
      }


      if (
        tripData.budget ===
        undefined
      ) {

        throw new Error(
          "Budget is required"
        );
      }


      if (
        tripData.travelers ===
        undefined
      ) {

        throw new Error(
          "Travelers are required"
        );
      }


      // ----------------------
      // Interests
      // ----------------------

      const interests =
        tripData.interests?.length
          ? tripData.interests.join(
              ", "
            )
          : "General sightseeing";


      // ----------------------
      // Prompt
      // ----------------------

      const prompt = `
You are an expert AI travel planner.

Create a realistic, practical and personalized travel itinerary.

TRIP DETAILS:

Destination: ${tripData.destination}

Number of Days: ${tripData.days}

Total Budget: ₹${tripData.budget}

Number of Travelers: ${tripData.travelers}

Traveler Interests: ${interests}


IMPORTANT:

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT use triple backticks.

Do NOT provide explanations before or after the JSON.


Return exactly this structure:

{
  "summary": "Short summary of the complete trip",

  "totalEstimatedCost": 20000,

  "days": [
    {
      "day": 1,

      "title": "Title for this day",

      "activities": [
        {
          "time": "09:00 AM",

          "place": "Place name",

          "description": "Description of activity",

          "estimatedCost": 500
        },

        {
          "time": "01:00 PM",

          "place": "Place name",

          "description": "Description of activity",

          "estimatedCost": 800
        },

        {
          "time": "07:00 PM",

          "place": "Place name",

          "description": "Description of activity",

          "estimatedCost": 700
        }
      ]
    }
  ]
}


RULES:

1. Generate exactly ${tripData.days} days.

2. Generate around 3 to 5 activities per day.

3. Use realistic activity times.

4. estimatedCost must always be a NUMBER.

Correct:

"estimatedCost": 500

Wrong:

"estimatedCost": "₹500"

5. totalEstimatedCost must be a NUMBER.

6. Keep the complete trip approximately within ₹${tripData.budget}.

7. The total budget is for ${tripData.travelers} travelers together.

8. Prioritize these interests:

${interests}

9. Include relevant sightseeing, local food, adventure, beaches, nightlife and cultural experiences depending on interests.

10. Avoid repeating attractions.

11. Keep travel distances realistic.

12. totalEstimatedCost should approximately equal the sum of all activity estimatedCost values.

13. Return ONLY valid JSON.
`;


      console.log(
        `Generating ${tripData.days}-day itinerary for ${tripData.destination}`
      );


      // ----------------------
      // Gemini API request
      // ----------------------

      const response =
        await generateWithRetry({

          model:
            GEMINI_MODEL,

          contents:
            prompt,

          config: {

            responseMimeType:
              "application/json",
          },
        });


      // ----------------------
      // Validate response
      // ----------------------

      if (
        !response?.text
      ) {

        throw new Error(
          "Gemini returned an empty response"
        );
      }


      // ----------------------
      // String → Object
      // ----------------------

      const itinerary =
        parseGeminiJSON(
          response.text
        );


      if (
        !Array.isArray(
          itinerary.days
        )
      ) {

        throw new Error(
          "Gemini response does not contain valid itinerary days"
        );
      }


      console.log(
        "Itinerary generated successfully"
      );


      return itinerary;

    } catch (error) {

      console.error(
        "Gemini API Error:",
        {
          message:
            error?.message,

          status:
            error?.status,

          networkCode:
            error?.cause?.code,
        }
      );


      throw error;
    }
  };