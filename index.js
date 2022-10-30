require("dotenv").config();

const express = require("express");
const initAsyncApp = require("./src/loaders/index");
const loadHttpServer = require("./src/loaders/server");

loadHttpServer(initAsyncApp(express()));
