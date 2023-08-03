const catchAysnc = require("../utilities/catchAsync");
const { findByIdAndDelete } = require("../models/category");

exports.getAll = (model) =>
  catchAysnc(async (req, res, next) => {
    const data = await model.find();
    res.status(200).end(
      JSON.stringify({
        status: "success",
        length: data.length,
        data: data,
      })
    );
  });

exports.createOne = (model) =>
  catchAysnc(async (req, res) => {
    const doc = await model.create(req.body);
    res.status(201).end(
      JSON.stringify({
        status: "success",
        data: doc,
      })
    );
  });

exports.findOneAndEdit = (model) =>
  catchAysnc(async (req, res, next) => {
    const id = await req.params.id;
    const doc = await model.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,
      }
    );
    res.status(201).end(
      JSON.stringify({
        status: "success",
        data: doc,
      })
    );
  });

exports.findOneAndDelete = (model) =>
  catchAysnc(async (req, res, next) => {
    const id = await req.params.id;
    const doc = await model.findByIdAndDelete(id);

    res.status(202).end(
      JSON.stringify({
        status: "success",
        data: doc,
      })
    );
  });
