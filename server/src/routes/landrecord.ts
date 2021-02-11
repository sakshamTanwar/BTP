import express from "express";
import path from "path"
import {resolveCoords} from "../services/coordResolver"

var router = express.Router();


router.get( "/", (req, res) => {
    //Takes lat and long as query params
    if(!req.isAuthenticated()) return res.redirect("../login");
    let lat = req.query.lat;
    let long = req.query.long;
    if(!lat || !long) return res.sendFile(path.join(__dirname,'..','views','landrecord.html'));
    console.log(typeof(lat), typeof(long));
    console.log(`Lat=${lat} and long=${long}`);
    resolveCoords(lat, long)
    .then((data)=>{
        res.send(data);
    })
    
});

export default router;