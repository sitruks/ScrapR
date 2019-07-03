const express = require("express");
const index = require("../schema/index");
const Note = index.Note;
const mongoose = require("mongoose");

// import express from "express";
// import Note from "../schema/Note"
// import mongoose from "mongoose";

const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message:"Serving Notes on the Endpoint."
    });   
});

router.get("/list", (req, res, next) => {
    Note.find({})
        .exec()
        .then(docs => {
            res.status(200).json({
                docs
            });
        })
        .catch(err => {
            console.log(err)
        });
});

router.post("/add", (req, res, next) => {

    const note = new Note({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        body: req.body.body
    });

    note.save()
    .then(result => {
        res.status(200).json({
            docs:[note]
        });
    })
    .catch(err => {
        console.log(err);
    });
});

router.post("/delete", (req, res, next) => {
    const rid = req.body.id;

    Note.findById(rid)
        .exec()
        .then(docs => {
            docs.remove();
            res.status(200).json({
                deleted:true
            });
        })
        .catch(err => {
            console.log(err)
        });
});

module.exports = router;