const express = require("express");
const path = require("path");
const connectDB = require("./db");
const Worker = require("./models/worker");
const Feedback = require("./models/Feedback");

const app = express();

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/workers", async (req, res) => {
  try {
    console.log(req.body);
    const worker = await Worker.create(req.body);
    res.json(worker);
  } catch (err) {
    console.log(err); // இதை add பண்ணு
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/workers", async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/workers/verify", async (req, res) => {
  try {
    const { phone, pin } = req.body;

    const worker = await Worker.findOne({ phone, pin });

    if (!worker) {
      return res.status(401).json({
        success: false,
        message: "Invalid Phone Number or PIN"
      });
    }

    res.json({
      success: true,
      worker
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/workers/:id", async (req, res) => {
  try {

    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(worker);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/feedback", async (req, res) => {
  try {

    const feedback = new Feedback(req.body);

    await feedback.save();

    res.json({
      success: true
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
});



app.listen(3000, () => {
  console.log("Server running on port 3000");
});