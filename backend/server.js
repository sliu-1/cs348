import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Friend, Place } from './models/schema.js';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose'
import cors from 'cors';

dotenv.config()

const app = express();

const PORT = process.env.PORT || 8888;

let db;

app.use(express.json());

app.use(cors());

app.get("/api/getFriend", async (req, res) => {
    try {
        const friends = await db.collection("friends").find({}).toArray(); // raw mongodb sql
        res.status(200).json({ success: true, data: friends });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: " +  error });
    }
});

app.get("/api/getFriend/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const objectId = new ObjectId(id);
        const friend = await db.collection("friends").findOne({ _id: objectId });

        if (!friend) {
            return res.status(404).json({ success: false, message: "Friend not found" });
        }

        res.status(200).json({ success: true, data: friend });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: " + error });
    }
});

app.post("/api/addFriend", async (req, res) => {
    const friend = req.body;

    if (!friend.name || !friend.closeness) {
        return res.status(400).json({ success: false, message: "Please enter all required fields." })
    }

    const newFriend = new Friend(friend);
     
    try {
        await newFriend.save();
        res.status(201).json({ success: true, data: newFriend });
    } catch (error) {
        console.error("Error adding friend: ", error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
});

app.delete("/api/deleteFriend/:id", async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid id: " + id });
    }

    try {
        await Friend.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Friend removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error: " + error })
    }
});

app.put("/api/updateFriend/:id", async (req, res) => {
    const { id } = req.params;
    const params = req.body;
  
    if (!params.name || !params.closeness) {
      return res.status(400).json({ success: false, message: "Please provide both name and closeness." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid id" });
    }
  
    try {
      const updatedFriend = await Friend.findByIdAndUpdate(
        id,
        params,
        { new: true, runValidators: true }
      );
  
      if (!updatedFriend) {
        return res.status(404).json({ success: false, message: "Friend not found" });
      }
  
      res.status(200).json({ success: true, data: updatedFriend });
    } catch (error) {
      console.error("Error updating friend with Mongoose:", error);
      res.status(500).json({ message: "Server Error", error });
    }
});

app.get("/api/getPlace", async (req, res) => {
    try {
        const places = await db.collection("places").find({}).toArray(); // raw mongodb sql
        res.status(200).json({ success: true, data: places });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: " +  error });
    }
});

app.post("/api/addPlace", async (req, res) => {
    const place = req.body;

    if (!place.name) {
        return res.status(400).json({ success: false, message: "Please enter all required fields." })
    }

    const newPlace = new Place(place);
     
    try {
        await newPlace.save();
        res.status(201).json({ success: true, data: newPlace });
    } catch (error) {
        console.error("Error adding place: ", error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
});

app.delete("/api/deletePlace/:id", async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid id: " + id });
    }

    try {
        await Place.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Friend removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error: " + error })
    }
});

app.put("/api/updatePlace/:id", async (req, res) => {
    const { id } = req.params;
    const params = req.body;
  
    if (!params.name || !params.closeness) {
      return res.status(400).json({ success: false, message: "Please provide both name and closeness." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid id" });
    }
  
    try {
      const updatedPlace = await Place.findByIdAndUpdate(
        id,
        params,
        { new: true, runValidators: true }
      );
  
      if (!updatedPlace) {
        return res.status(404).json({ success: false, message: "Friend not found" });
      }
  
      res.status(200).json({ success: true, data: updatedPlace });
    } catch (error) {
      console.error("Error updating friend with Mongoose:", error);
      res.status(500).json({ message: "Server Error", error });
    }
});

app.listen(PORT, async() => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db("test"); 
        await connectDB();
        console.log("Server started at http://localhost:" + PORT);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
});