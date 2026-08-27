import {
  describe,
  test,
  expect,
  vi,
} from "vitest";

import request from "supertest";


// ===================================
// MOCK GEMINI SERVICE
// ===================================

vi.mock(
  "../src/services/aiService.js",
  () => {
    return {
      generateTripItinerary:
        vi.fn(async () => ({
          summary:
            "Mock Goa itinerary",

          totalEstimatedCost:
            0,

          days: [
            {
              day: 1,

              title:
                "Explore North Goa",

              activities: [
                {
                  time:
                    "10:00 AM",

                  place:
                    "Baga Beach",

                  description:
                    "Visit Baga Beach",

                  estimatedCost:
                    500,
                },

                {
                  time:
                    "2:00 PM",

                  place:
                    "Aguada Fort",

                  description:
                    "Explore the fort",

                  estimatedCost:
                    300,
                },
              ],
            },
          ],
        })),
    };
  }
);


// ===================================
// MOCK LOCATION SERVICE
// ===================================

vi.mock(
  "../src/services/locationService.js",
  () => {
    return {
      addCoordinatesToItinerary:
        vi.fn(
          async (itinerary) => {

            itinerary.days[0]
              .activities[0]
              .latitude =
              15.5553;

            itinerary.days[0]
              .activities[0]
              .longitude =
              73.7517;


            itinerary.days[0]
              .activities[1]
              .latitude =
              15.492;

            itinerary.days[0]
              .activities[1]
              .longitude =
              73.773;


            return itinerary;
          }
        ),
    };
  }
);


// IMPORTANT:
// app import comes after mocks

import app from "../src/app.js";


// ===================================
// HELPER
// ===================================

const createUserAndTrip =
  async () => {

    const registerResponse =
      await request(app)
        .post(
          "/api/auth/register"
        )
        .send({
          name:
            "AI Test User",

          email:
            "ai@test.com",

          password:
            "12345678",
        });


    const token =
      registerResponse.body.token;


    const tripResponse =
      await request(app)
        .post(
          "/api/trips"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          destination:
            "Goa",

          startDate:
            "2026-09-10",

          endDate:
            "2026-09-10",

          budget:
            5000,

          travelers:
            2,

          interests: [
            "Beach",
            "Food",
          ],
        });


    return {
      token,

      tripId:
        tripResponse.body
          .data._id,
    };
  };


// ===================================
// TEST
// ===================================

describe(
  "AI Itinerary API",
  () => {

    test(
      "should generate itinerary without calling real Gemini API",
      async () => {

        const {
          token,
          tripId,
        } =
          await createUserAndTrip();


        const response =
          await request(app)
            .post(
              `/api/trips/${tripId}/generate`
            )
            .set(
              "Authorization",
              `Bearer ${token}`
            );


        expect(
          response.statusCode
        ).toBe(200);


        expect(
          response.body.success
        ).toBe(true);


        expect(
          response.body.data.status
        ).toBe(
          "generated"
        );


        expect(
          response.body
            .data
            .itinerary
            .summary
        ).toBe(
          "Mock Goa itinerary"
        );


        // =========================
        // REAL BUDGET ENGINE
        // =========================

        expect(
          response.body
            .data
            .budgetAnalysis
            .calculatedActivityCost
        ).toBe(800);


        // =========================
        // MOCK COORDINATES
        // =========================

        const activity =
          response.body
            .data
            .itinerary
            .days[0]
            .activities[0];


        expect(
          activity.latitude
        ).toBe(15.5553);


        expect(
          activity.longitude
        ).toBe(73.7517);
      }
    );
  }
);