import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api/v1/",//remember this is the adress of our backend server all other routes come after this
  headers: {
    "Content-type": "application/json"
  }
});