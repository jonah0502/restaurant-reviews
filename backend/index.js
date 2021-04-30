import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import ReviewsDAO from "./dao/reviewsDAO.js"
import restaurantsDAO from "./dao/restaurantsDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port =  process.env.PORT || 8000

MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,  //uri from env
    { // databse connection options
        poolSize:50, // only 50 can connect at a time
        wtimeout:2500, // after 2500ms request will time out
        useNewUrlParser: true
    }
)
.catch(err=>{
    console.error(err.stack)
    process.exit(1)
}) // catch any errors 
.then(async client =>{
    await restaurantsDAO.injectDB(client) // this is how we get our refrence to the restauratns collection in the database
    await ReviewsDAO.injectDB(client)
    app.listen(port, ()=>{ // this is how we start our web server
        console.log(`listening on port ${port}`)
    })
})