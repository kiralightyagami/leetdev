import { Router } from "express";

const contestRouter = Router();

// https://api.devforces.com/contest?offset=10&page=20
contestRouter.get("/active", (req, res) => {
    const {offset, page} = req.query;

})

contestRouter.get("/finished", (req, res) => {
    let {offset, page} = req.query;
})

// return all the sub challenges and their start times.
contestRouter.get("/:contestId", (req, res) => {
    const contestId = req.params.contestId

})

contestRouter.get("/:contestId/:challengeId", (req, res) => {
    const contestId = req.params.contestId

})

contestRouter.get("/leaderboard/:contestId", (req, res) => {

})

contestRouter.post("/submit/:challengeId", (req, res) => {
    // have rate limitting
    // max 20 submissions per problem
    // forward the request to GPT
    // store the response in sorted set and the DB
})

export default contestRouter;