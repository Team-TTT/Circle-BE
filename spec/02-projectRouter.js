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
  before(async () => {
    const app = await initAsyncApp(express());
    server = request.agent(app);

    return testDbConnecting(process.env.MONGODB_TEST);
  });

  after(() => mongoose.disconnect());

  let projectId = "";

  it("post /projects", async () => {
    const newProject = {
      title: "test",
    };

    const response = await server
      .post("/projects")
      .set("Cookie", `session=${process.env.COOKIE}`)
      .send(newProject)
      .expect(200);

    projectId = response.body.id;
  });

  it("Get /projects", async () => {
    const response = await server
      .get("/projects")
      .set("Cookie", `session=${process.env.COOKIE}`)
      .expect(200);

    const targetProject = response.body
      .map((project) => project._id)
      .find((id) => id === projectId);

    expect(!!targetProject).to.be.true;
  });

  it("Put /projects/:projectId", async () => {
    const newTitle = { title: "test2" };

    await server
      .put(`/projects/${projectId}`)
      .set("Cookie", `session=${process.env.COOKIE}`)
      .send(newTitle)
      .expect(200);

    const targetProject = await ProjectModel.findById(projectId).lean().exec();
    expect(targetProject.title).to.equal(newTitle.title);
  });

  it("Delete /projects/:projectId", async () => {
    const response = await server
      .delete(`/projects/${projectId}`)
      .set("Cookie", `session=${process.env.COOKIE}`)
      .expect(200);

    expect(response.body).to.eql({ result: "success" });
  });
});
