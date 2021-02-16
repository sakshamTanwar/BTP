import express from "express";
import path from "path"
import { IResolvedCoordInfo } from "../interfaces/coordResolverInterfaces";
import {resolveCoords} from "../services/coordResolver"
import { LandRecordExtractor } from "../services/recordExtractor"

var router = express.Router();

router.get( "/", (req, res, next) => {
    //Takes lat and lon as query params
    if(!req.isAuthenticated()) return res.redirect("../login");
    let lat = req.query.lat;
    let lon = req.query.lon;
    if(!lat || !lon) return res.sendFile(path.join(__dirname,'..','views','landrecord.html'));
    console.log(typeof(lat), typeof(lon));
    console.log(`Lat=${lat} and lon=${lon}`);
    resolveCoords(lat, lon)
    .then((data)=>{
        res.send(data);
    })
    .catch(err=>{
       next(err);
    })
    
});


router.get( "/test", (req, res, next) => {
    //Takes lat and lon as query params
    if(!req.isAuthenticated()) return res.redirect("../login");
    let { lat, lon } = req.query;
    if(!lat || !lon) return res.sendFile(path.join(__dirname,'..','views','landrecord.html'));
    console.log(`Lat=${lat} and lon=${lon}`);
    resolveCoords(lat, lon)
    .then((data: IResolvedCoordInfo)=>{
        LandRecordExtractor.extractLandRecordFromBL(data);
        res.send(data);
    })
    .catch(err=>{
       next(err);
    }); 
});



export default router;