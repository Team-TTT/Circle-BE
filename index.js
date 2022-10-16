require("dotenv").config();

const express = require("express");
const initLoaders = require("./src/loaders/index");

initLoaders(express());
