import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import AddReview from "./components/add-review";
import Restaurant from "./components/restaurants";
import RestaurantsList from "./components/restaurants-list";
import Login from "./components/login";

function App() {
  
  const [user, setUser] = React.useState(null)
  
  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null)
  }


  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/restaurants" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item" >
            { user ? (
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>  // when clicked it will run the logout function which we have not written yet. 
                Logout {user.name}
              </a>
            ) : (            
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
            )} 

          </li>
        </div>
      </nav>

      <div className="container mt-3"> 
        <Switch>
          <Route exact path={["/", "/restaurants"]} component={RestaurantsList} />  //first route
          <Route 
            path="/restaurants/:id/review"
            render={(props) => (  //we use render beacuse it allows us to pass in the props
              <AddReview {...props} user={user} />  // we are accessing the add review component
            )}
          />
          <Route 
            path="/restaurants/:id"
            render={(props) => (
              <Restaurant {...props} user={user} />
            )}
          />
          <Route 
            path="/login"
            render={(props) => (
              <Login {...props} login={login} />  // we are accessing the log in component
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
