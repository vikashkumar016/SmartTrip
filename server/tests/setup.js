import mongoose from "mongoose";

import {
  MongoMemoryServer,
} from "mongodb-memory-server";

import User from "../src/models/User.js";
import Trip from "../src/models/Trip.js";


let mongoServer;


// =================================
// BEFORE ALL TESTS
// =================================

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  process.env.JWT_SECRET =
    "smarttrip-test-secret";

  process.env.JWT_EXPIRES_IN =
    "1h";

  mongoServer =
    await MongoMemoryServer.create();

  const uri =
    mongoServer.getUri();

  await mongoose.connect(uri);
});


// =================================
// AFTER EACH TEST
// =================================

afterEach(async () => {
  await User.deleteMany({});
  await Trip.deleteMany({});
});


// =================================
// AFTER ALL TESTS
// =================================

afterAll(async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
});

