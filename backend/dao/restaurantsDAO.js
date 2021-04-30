
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let restaurants // we will use this variable to store a refrence to our database

export default class RestaurantsDAO {
  static async injectDB(conn) { //as soon as the server starts we will get a refrence to our restaurants DB
    if (restaurants) {
      return
    }
    try {
      restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants") //get collection rest.. fromn [dbname]
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in restaurantsDAO: ${e}`,
      )
    }
  }

  static async getRestaurants({
    filters = null, //setttings
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("name" in filters) { // allows us to sort by name cuisine and zipcode fo teh restaurant notice that unlike the others there is no database field here
        query = { $text: { $search: filters["name"] } } // anywhere in the text we will search for name
      } else if ("cuisine" in filters) {
        query = { "cuisine": { $eq: filters["cuisine"] } } //checks if cuisine from db is same as passed in (in that order)
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } }
      }
    }


    let cursor
    
    try {
      cursor = await restaurants
        .find(query) // this will find all the restaurants from the database that go along with the query that we passed in. 
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { restaurantsList: [], totalNumRestaurants: 0 }
    }
//if no error
//the cursor contains everysingle result so we want to limit our results
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page) //20 items per page so .skip = skip to item 20 * page #

    try { // save results to an array and return the array
      const restaurantsList = await displayCursor.toArray()
      const totalNumRestaurants = await restaurants.countDocuments(query)

      return { restaurantsList, totalNumRestaurants }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { restaurantsList: [], totalNumRestaurants: 0 }
    }
  }

  static async getRestaurantByID(id) { //we are trying to get the reviews from one collection and put them into the restaurant
    try {
      const pipeline = [ //this pipeline will help us match collections together
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews", //from the reviews collection
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$restaurant_id", "$$id"],//we will find all of the reviews which = the restaurant id
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await restaurants.aggregate(pipeline).next() //put the two together and return that
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`)
      throw e
    }
  }

  static async getCuisines() {
    let cuisines = []
    try {
      cuisines = await restaurants.distinct("cuisine") // get all the distinct cuisine values
      return cuisines
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`)
      return cuisines
    }
  }
}