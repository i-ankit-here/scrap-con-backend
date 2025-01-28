import { Leaderboard } from "../../models/Leaderboard.js";

export const getAllUsers = async(req,res)=>{
    try {
        const leaderboard = await Leaderboard.find({});
        if(!leaderboard || leaderboard.length == 0){
            res.status(500).json({
                message:"Something went wrong"
            })
        }
        res.status(200).json({
            data:leaderboard
        })
    } catch (error) {
        res.status(500).json({
            message:error
        })
    }
}