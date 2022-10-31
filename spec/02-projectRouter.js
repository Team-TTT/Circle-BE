require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const { expect } = require("chai");

const initAsyncApp = require("../src/loaders/initAsyncApp");
const { testDbConnecting } = require("./utils");
const ProjectModel = require("../models/Project");

let server = null;

describe("* projects Router", () => {
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

  let projectId = "";

  it("post /projects", (done) => {
    const newProject = {
      title: "test",
    };

    server
      .post("/projects")
      .set("Cookie", `session=${process.env.COOKIE}`)
      .send(newProject)
      .expect(200)
      .end((err, res) => {
        projectId = res.body.id;
        done();
      })
  });

  it("Get /projects", (done) => {
    server
      .get("/projects")
      .set("Cookie", `session=${process.env.COOKIE}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return err;
        }

        const targetProject = res.body
          .map((project) => project._id)
          .find((id) => id === projectId);

        expect(!!targetProject).to.be.true;
        done();
      });
  });

  it("Put /projects/:projectId", async () => {
    const newTitle = { title: "test2" }

    await server
      .put(`/projects/${projectId}`)
      .set("Cookie", `session=${process.env.COOKIE}`)
      .send(newTitle)
      .expect(200);

    const targetProject = await ProjectModel.findById(projectId).lean().exec();
    expect(targetProject.title).to.equal(newTitle.title);
  });

  it("Delete /projects/:projectId", (done) => {
    server
      .delete(`/projects/${projectId}`)
      .set("Cookie", `session=${process.env.COOKIE}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return err;
        }

        expect(res.body).to.eql({ result: "success" });
        done();
      });
  });
});
