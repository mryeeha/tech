import { EventEmitter } from 'events'
import { isTokenExpired } from './jwtHelper'
import Auth0Lock from 'auth0-lock'
//import Auth0LockPasswordless from 'auth0-lock-passwordless'

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super()
    // Configure Auth0
    //this.lock = new Auth0LockPasswordless(clientId, domain, {})
    this.lock = new Auth0Lock(clientId, domain, {auth: {redirect: false}})
    
    //this.lock = new Auth0Lock(clientId, domain, {auth: {redirectUrl: "http://localhost:3000/home"}})
    //this.lock.emailcode( function (err, profile, id_token, state) {
     // if (!err) {
        // Save the JWT token.
        //console.log('the token value', profile.idToken); 
        //localStorage.setItem('id_token', profile.idToken);
        
        //localStorage.setItem('profile', JSON.stringify(profile));
        //this.emit('profile_updated', profile); 

        //use profile 
      //}
    //});
   
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // Add callback for lock `authorization_error` event
   this.lock.on('authorization_error', this._authorizationError.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)

   

  }

  _doAuthentication(authResult){


    // Saves the user token
    this.setToken(authResult.idToken)
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error)
      } else {
        this.setProfile(profile)
        window.location="http://localhost:3000/home";

      }
    })
    
       //window.location="http://localhost:3000/home";
    return; 
  }

  _authorizationError(error){
    // Unexpected authentication error
    console.log('Authentication Error', error)
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show()
  }

  loggedIn(){
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token && !isTokenExpired(token)
  }

  setProfile(profile){
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    localStorage.setItem('apitoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIwaEVkeUU3VVI2OEg3Z3U1V2pGOG9HelZkZ051dmVaVSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJjcmVhdGUiLCJkZWxldGUiXX0sInVzZXJzX2FwcF9tZXRhZGF0YSI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJkZWxldGUiLCJjcmVhdGUiXX0sInJ1bGVzIjp7ImFjdGlvbnMiOlsicmVhZCIsInVwZGF0ZSIsImRlbGV0ZSIsImNyZWF0ZSJdfX0sImlhdCI6MTQ3MDIzMTQ4OCwianRpIjoiMjQ5MWE4MDNhOWZmOWEzNjQzNjZmZTA5YmEwODJiZTcifQ.sqPz726JSvaAufxXrJ742UKz4g74YujTq9GzSJvqD7o')
    console.log('profile content: ', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile)
  }

  getProfile(){
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  setToken(idToken){
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken(){
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout(){
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
     localStorage.removeItem('apitoken');

  }

  getUsers(){
     var req = new XMLHttpRequest();
    

    
    req.onreadystatechange = function() {
      var status;
      var data;
      // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
      if (req.readyState == 4) { // `DONE`
        status = req.status;
        if (status == 200) {
          console.log('the response is: ',req.responseText);
          data = JSON.parse(req.responseText);
          successHandler && successHandler(data);
        } else {
          alert(status); 
        }
      }
    };

    req.open('GET', "https://yves.eu.auth0.com/api/v2/users?_=1470231408486", true);
    req.setRequestHeader("Authorization", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIwaEVkeUU3VVI2OEg3Z3U1V2pGOG9HelZkZ051dmVaVSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJjcmVhdGUiLCJkZWxldGUiXX0sInVzZXJzX2FwcF9tZXRhZGF0YSI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJkZWxldGUiLCJjcmVhdGUiXX0sInJ1bGVzIjp7ImFjdGlvbnMiOlsicmVhZCIsInVwZGF0ZSIsImRlbGV0ZSIsImNyZWF0ZSJdfX0sImlhdCI6MTQ3MDIzMTQ4OCwianRpIjoiMjQ5MWE4MDNhOWZmOWEzNjQzNjZmZTA5YmEwODJiZTcifQ.sqPz726JSvaAufxXrJ742UKz4g74YujTq9GzSJvqD7o');
    req.setRequestHeader("Accept","application/json"); 
    req.send();

  }
}
