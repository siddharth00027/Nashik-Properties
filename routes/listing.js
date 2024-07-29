const express = require("express");
const router = express.Router({ mergeParams: true });

//set up for Geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//for using geocodeing services
const mapToken = process.env.MAP_TOKEN;
const GeocodingClient = mbxGeocoding({ accessToken: mapToken });

const multer = require("multer");
const {
    storage
} = require("../cloudConfig.js");
const upload = multer({
    storage
});
const Listing = require('../models/listing.js');
const listingController = require("../controllers/listings.js");

router.route("/")
    .get(listingController.index)
    .post(upload.single('listing[image]'), async (req, res) => { 
        try {
            let response = await GeocodingClient.forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
                .send();
    
            let url = req.file.path;
            let filename = req.file.filename;
            const newListing = new Listing(req.body.listing);
            // console.log(req.body.listing);
            // const developer = await Developer.findOne({
            //     name: req.body.listing.project_by
            // });
            newListing.owner=req.user._id;
            // console.log(developer);
            // newListing.project_by = developer._id;
            newListing.image = {
                url,
                filename
            };
            // developer.sites.push(newListing);
            // await developer.save();
            newListing.geometry = response.body.features[0].geometry;
            await newListing.save();
            console.log("Listing created successfully");
            res.redirect("/listings");
        } catch (error) {
            console.error("Error creating listing:", error);
            res.status(500).send("Internal Server Error");
        }
    });
    
// router.route("/new")
//     .get(listingController.renderNewForm);
//     module.exports.renderNewForm = async (req, res) => {
//         // const allDevelopers = await Developer.find({});
//         res.render("listings/new.ejs");
//         // res.send("Hello");
//     }
router.get('/new',async(req,res)=>{
    console.log("hello new!");
    // res.send("Hello");
    res.render("new.ejs")
})
router.get("/residential", async (req, res) => {
    const allListings = await Listing.find({ property_type: "Residential" })
    console.log(allListings);
    console.log("hi residential ");
    // res.send("HI");
    res.render("index.ejs", {
        allListings
    });
});


router.get("/commercial", async (req, res) => {
    const allListings = await Listing.find({ property_type: "Commercial" })

    console.log("hi commercial");
    console.log(allListings);

    // res.send("hi commercial");
    res.render("index.ejs",  {
        allListings
    });
});
router.get("/plot", async (req, res) => {
    const allListings = await Listing.find({ property_type: "Plot" })

    console.log("hi plot");
    // res.send("hi plot");
    res.render("index.ejs",  {
        allListings
    });
});

// router.delete('/', (req, res) => {

// })
router.route("/:id")
    .get(listingController.showListing)
    .put(upload.single('listing[image]'), listingController.updateListing)
    .delete(listingController.destroyListing);

router.route("/:id/:developerId")
    .delete(listingController.destroyListing);

router.route("/:id/edit")
    .get(listingController.renderEditForm);

// router.route("/residential")
//     .get(listingController.residential); 
// router.route("/commercial")
//     .get(listingController.commercial); 
// router.route("/plot")
//     .get(listingController.plot); 


module.exports = router;
