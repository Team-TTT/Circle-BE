require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const { expect } = require("chai");

const initAsyncApp = require("../src/loaders/initAsyncApp");
const { testDbConnecting, postLoginAndGetCookie } = require("./utils");

let server = null;

describe("* open server", () => {
  before(function(done) {
    initAsyncApp(express()).then(async (app) => {
      server = request.agent(app);
      await testDbConnecting(process.env.MONGODB_TEST);
      done();
    });
  });

  after(function(done) {
    mongoose.disconnect().then(done);
  });

  describe("Get /auth/users", () => {
    it("회원가입 하기", async () => {
      const response = await postLoginAndGetCookie(server);
      expect(response.body.displayName).to.eql(process.env.DISPLAY_NAME);
    });
  });
});
