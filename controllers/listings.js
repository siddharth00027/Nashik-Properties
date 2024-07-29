
const Developer = require("../models/developer");
const Listing = require("../models/listing");


//set up for Geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//for using geocodeing services
const mapToken = process.env.MAP_TOKEN;
const GeocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})//.populate({
    //     path: "project_by",
    //     model: "Developer", // Make sure to specify the model name if it's different
    // }) ;
    res.render("index.ejs", {
        allListings
    });
}

module.exports.renderNewForm = async (req, res) => {
    // const allDevelopers = await Developer.find({});
    // res.render("listings/new.ejs");
    // res.send("Hello");
}



module.exports.createListing = async (req, res) => {
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
        const developer = await Developer.findOne({
            name: req.body.listing.project_by
        });
        newListing.owner=req.user._id;
        console.log(developer);
        newListing.project_by = developer._id;
        newListing.image = {
            url,
            filename
        };
        developer.sites.push(newListing);
        await developer.save();
        newListing.geometry = response.body.features[0].geometry;
        await newListing.save();
        console.log("Listing created successfully");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).send("Internal Server Error");
    }
};


module.exports.showListing = async (req, res) => {
    let {
        id
    } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "givenBy"
            },
        })
        .populate('owner');

    res.render("show.ejs", {
        listing
    });
}

module.exports.renderEditForm = async (req, res) => {
    let {
        id
    } = req.params;
    // const allDevelopers = await Developer.find({});
    let listing = await Listing.findById(id);
    res.render("edit.ejs", {
        listing
    });
}

module.exports.updateListing = async (req, res) => {
    let {
        id
    } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing
    });
    if (req.file) {
        let url = req.file.url;
        let filename = req.file.filename;

        listing.image = {
            url,
            filename
        };
    }

    await listing.save();
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req, res) => {
    let {
        id
    } = req.params;

    try {
        // console.log("Developer ID:", developerId); // Log the developerId

        // Delete the listing
        const deletedListing = await Listing.findByIdAndDelete(id);

        // Find the developer
        // let developer = await Developer.findById(developerId);

        // Check if the developer exists
        // if (!developer) {
        //     console.log("Developer not found");
        //     return res.status(404).send("Developer not found");
        // }

        // // Remove the listing from the developer's sites
        // developer.sites.pull(deletedListing._id);
        // await developer.save();

        // console.log(developer);
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};




module.exports.residential = async (req, res) => {


    const allListings = await Listing.find({property_type:'residential'}).populate({
        path: "project_by",
        model: "Developer",
    });

    res.render("listings/indexx.ejs", {
        allListings
    });
};
module.exports.commercial = async (req, res) => {
    const allListings = await Listing.find({}).populate({
        path: "project_by",
        model: "Developer",
    });

    res.render("listings/indexx.ejs", {
        allListings
    });
};
module.exports.plot = async (req, res) => {
    const allListings = await Listing.find({}).populate({
        path: "project_by",
        model: "Developer",
    });

    res.render("listings/indexx.ejs", {
        allListings
    });
};