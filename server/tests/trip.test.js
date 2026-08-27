import request from "supertest";

import app from "../src/app.js";


const createUserAndGetToken =
  async (
    email = "user@test.com"
  ) => {

    const response =
      await request(app)
        .post(
          "/api/auth/register"
        )
        .send({
          name: "Test User",
          email,
          password:
            "12345678",
        });

    return response.body.token;
  };


const tripData = {
  destination: "Goa",

  startDate:
    "2026-09-10",

  endDate:
    "2026-09-15",

  budget: 25000,

  travelers: 2,

  interests: [
    "Beach",
    "Food",
  ],
};


describe(
  "Trip API",
  () => {

    // =================================
    // UNAUTHORIZED
    // =================================
    test(
  "user B should not access user A's trip",
  async () => {

    // =========================
    // USER A
    // =========================

    const tokenA =
      await createUserAndGetToken(
        "userA@test.com"
      );

    const createResponse =
      await request(app)
        .post(
          "/api/trips"
        )
        .set(
          "Authorization",
          `Bearer ${tokenA}`
        )
        .send(tripData);

    const tripId =
      createResponse.body
        .data._id;


    // =========================
    // USER B
    // =========================

    const tokenB =
      await createUserAndGetToken(
        "userB@test.com"
      );


    // =========================
    // USER B TRIES USER A TRIP
    // =========================

    const response =
      await request(app)
        .get(
          `/api/trips/${tripId}`
        )
        .set(
          "Authorization",
          `Bearer ${tokenB}`
        );


    expect(
      response.statusCode
    ).toBe(404);

    expect(
      response.body.message
    ).toBe(
      "Trip not found"
    );
  }
);

    test(
      "should reject trip request without token",
      async () => {

        const response =
          await request(app)
            .get(
              "/api/trips"
            );

        expect(
          response.statusCode
        ).toBe(401);
      }
    );


    // =================================
    // CREATE TRIP
    // =================================

    test(
      "should create trip for authenticated user",
      async () => {

        const token =
          await createUserAndGetToken();

        const response =
          await request(app)
            .post(
              "/api/trips"
            )
            .set(
              "Authorization",
              `Bearer ${token}`
            )
            .send(tripData);

        expect(
          response.statusCode
        ).toBe(201);

        expect(
          response.body.success
        ).toBe(true);

        expect(
          response.body.data.destination
        ).toBe("Goa");

        expect(
          response.body.data.user
        ).toBeDefined();
      }
    );


    // =================================
    // GET ALL
    // =================================

    test(
      "should return logged-in user's trips",
      async () => {

        const token =
          await createUserAndGetToken();

        await request(app)
          .post(
            "/api/trips"
          )
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send(tripData);

        const response =
          await request(app)
            .get(
              "/api/trips"
            )
            .set(
              "Authorization",
              `Bearer ${token}`
            );

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body.count
        ).toBe(1);

        expect(
          response.body.data
        ).toHaveLength(1);
      }
    );


    // =================================
    // GET SINGLE
    // =================================

    test(
      "should get one trip by id",
      async () => {

        const token =
          await createUserAndGetToken();

        const createResponse =
          await request(app)
            .post(
              "/api/trips"
            )
            .set(
              "Authorization",
              `Bearer ${token}`
            )
            .send(tripData);

        const tripId =
          createResponse.body
            .data._id;

        const response =
          await request(app)
            .get(
              `/api/trips/${tripId}`
            )
            .set(
              "Authorization",
              `Bearer ${token}`
            );

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body.data._id
        ).toBe(tripId);
      }
    );


    // =================================
    // UPDATE
    // =================================

    test(
      "should update user's trip",
      async () => {

        const token =
          await createUserAndGetToken();

        const createResponse =
          await request(app)
            .post(
              "/api/trips"
            )
            .set(
              "Authorization",
              `Bearer ${token}`
            )
            .send(tripData);

        const tripId =
          createResponse.body
            .data._id;

        const response =
          await request(app)
            .patch(
              `/api/trips/${tripId}`
            )
            .set(
              "Authorization",
              `Bearer ${token}`
            )
            .send({
              budget: 30000,
              travelers: 3,
            });

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body.data.budget
        ).toBe(30000);

        expect(
          response.body.data.travelers
        ).toBe(3);
      }
    );


    // =================================
    // DELETE
    // =================================

    test(
      "should delete user's trip",
      async () => {

        const token =
          await createUserAndGetToken();

        const createResponse =
          await request(app)
            .post(
              "/api/trips"
            )
            .set(
              "Authorization",
              `Bearer ${token}`
            )
            .send(tripData);

        const tripId =
          createResponse.body
            .data._id;

        const response =
          await request(app)
            .delete(
              `/api/trips/${tripId}`
            )
            .set(
              "Authorization",
              `Bearer ${token}`
            );

        expect(
          response.statusCode
        ).toBe(200);

        const getResponse =
          await request(app)
            .get(
              `/api/trips/${tripId}`
            )
            .set(
              "Authorization",
              `Bearer ${token}`
            );

        expect(
          getResponse.statusCode
        ).toBe(404);
      }
    );
  }
);

test(
  "should reject invalid trip data",
  async () => {

    const token =
      await createUserAndGetToken();

    const response =
      await request(app)
        .post(
          "/api/trips"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          destination: "",
          startDate:
            "invalid-date",
          endDate:
            "2026-09-10",
          budget: -100,
          travelers: 0,
        });

    expect(
      response.statusCode
    ).toBe(400);

    expect(
      response.body.success
    ).toBe(false);

    expect(
      response.body.message
    ).toBe(
      "Validation failed"
    );
  }
);