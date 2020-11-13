import React from "react";
import './App.css';
import {BrowserRouter as Router, NavLink, Route, Redirect, Switch} from 'react-router-dom';
import AuthContext from './context/auth-context'
import Auth from "./pages/Auth/Auth";
import Calendar from "./pages/Calendar/Calendar";
import Navbar from "./components/Navbar/Navbar";

export default class App extends React.Component {
  
  state = {
    userId: localStorage.getItem('userId'),
    token: localStorage.getItem('token'),
  }
  login = (token, userId, tokenExpiration) => {
    console.log("login hit")
    localStorage.setItem('userId',userId);
    localStorage.setItem('token',token);
    this.setState({userId: localStorage.getItem('userId'), token:localStorage.getItem('token')});
  }

  logout = () => {
    localStorage.clear();
    this.setState({userId: null, token: null})
  }

  render(){
    return (
          <Router>
            <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout}}>
              {this.state.token && <Navbar/>}
              <div className='app-body'>
                <Switch>
                  {!this.state.token && <Redirect from='/'exact to='/auth' component={Auth}/>}
                  {this.state.token && <Redirect from='/'exact to='/calendar' component={Auth}/>}
                  {this.state.token && <Redirect from='/auth'exact to='/calendar' component={Auth}/>}
                  <Route path='/auth' component={Auth}/>
                  {!this.state.token && <Redirect to='/auth' from = '/calendar'/>}
                  <Route path='/calendar' component={Calendar}/>
                </Switch>
              </div>
            </AuthContext.Provider>
          </Router>
    );
  }
}