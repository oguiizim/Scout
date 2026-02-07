import express from "express";
import { getUsers, addTeams } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);

router.post("/", addTeams);

export default router;
