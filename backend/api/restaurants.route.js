import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

const router = express.Router()

router.route("/").get(RestaurantsCtrl.apiGetRestaurants) // if you go to the root url it will respond with hello world
router.route("/id:id").get(RestaurantsCtrl.apiGetRestaurantById) //if we want to get a specific restaurant with a specific id it will also return all reviews associated
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines) // this will return a list of cuisines 


router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)



export default router