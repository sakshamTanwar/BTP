import express from "express";
import {resolveCoords} from "../services/coordResolver"

var router = express.Router();


router.get( "/", (req, res) => {
    //Takes lat and long as query params 
    let lat = req.query.lat;
    let long = req.query.long;
    console.log(typeof(lat), typeof(long));
    console.log(`Lat=${lat} and long=${long}`);
    resolveCoords(lat, long)
    .then((data)=>{
        res.send(data);
    })
    
});


export default router;