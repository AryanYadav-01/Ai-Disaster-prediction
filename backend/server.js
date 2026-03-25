import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const AI_URL = "http://127.0.0.1:8000";

app.post("/flood-risk", async (req, res) => {
  try {
    const response = await axios.post(`${AI_URL}/predict`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "AI service error" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
