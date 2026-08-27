import request from "supertest";

import app from "../src/app.js";


// =================================
// REGISTER
// =================================

describe(
  "Authentication API",
  () => {

    test(
      "should register a new user",
      async () => {

        const response =
          await request(app)
            .post(
              "/api/auth/register"
            )
            .send({
              name: "Vikash",
              email:
                "vikash@test.com",
              password:
                "12345678",
            });

        expect(
          response.statusCode
        ).toBe(201);

        expect(
          response.body.success
        ).toBe(true);

        expect(
          response.body.token
        ).toBeDefined();

        expect(
          response.body.user.email
        ).toBe(
          "vikash@test.com"
        );

        expect(
          response.body.user.password
        ).toBeUndefined();
      }
    );


    // =================================
    // DUPLICATE USER
    // =================================

    test(
      "should reject duplicate email",
      async () => {

        const userData = {
          name: "Vikash",
          email:
            "duplicate@test.com",
          password:
            "12345678",
        };

        await request(app)
          .post(
            "/api/auth/register"
          )
          .send(userData);

        const response =
          await request(app)
            .post(
              "/api/auth/register"
            )
            .send(userData);

        expect(
          response.statusCode
        ).toBe(409);
      }
    );


    // =================================
    // LOGIN
    // =================================

    test(
      "should login registered user",
      async () => {

        await request(app)
          .post(
            "/api/auth/register"
          )
          .send({
            name: "Vikash",
            email:
              "login@test.com",
            password:
              "12345678",
          });

        const response =
          await request(app)
            .post(
              "/api/auth/login"
            )
            .send({
              email:
                "login@test.com",
              password:
                "12345678",
            });

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body.token
        ).toBeDefined();

        expect(
          response.body.user.email
        ).toBe(
          "login@test.com"
        );
      }
    );


    // =================================
    // WRONG PASSWORD
    // =================================

    test(
      "should reject wrong password",
      async () => {

        await request(app)
          .post(
            "/api/auth/register"
          )
          .send({
            name: "Vikash",
            email:
              "wrong@test.com",
            password:
              "12345678",
          });

        const response =
          await request(app)
            .post(
              "/api/auth/login"
            )
            .send({
              email:
                "wrong@test.com",
              password:
                "wrong-password",
            });

        expect(
          response.statusCode
        ).toBe(401);
      }
    );
  }
);