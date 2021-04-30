import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js" // we are going to have our routes in a seperate file

const app = express() //creates express app (make3s our server)
//things that express will use
app.use(cors())
app.use(express.json()) // server can accept json in the body of a request

app.use("/api/v1/restaurants", restaurants) // we have to specify what the url is going to be (after lcoalhost) located in the restaurants file
app.use("*", (req, res)=> res.status(404).json({error: "not found"}) ) //if a user goes to a page which does not exist (*) send 404 error

export default app