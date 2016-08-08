import React, { PropTypes as T } from 'react'
import {Button} from 'react-bootstrap'
import AuthService from 'utils/AuthService'
import styles from './styles.module.css'
import ReactDOM from 'react-dom';


export class Home extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)

  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      profile: props.auth.getProfile()
    }
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile})
    })
  }

  logout(){
    this.props.auth.logout()
    this.context.router.push('/login');
  }


  displayUsers(ldata){

    var data = ldata; 
    for(var i =0;i<data.length;i++){
      
      if(ldata[i].user_metadata.isAdmin){
        data.splice(i,1); 
      }
    }


    


    var ListComponent =   React.createClass({


      switchAccess: function(email, metadata, modifyR, updateUserList, user_id, updateUI){

       // var modifi = modifyR; 

        var req = new XMLHttpRequest();
      
        req.onreadystatechange = function() {

        
          var status;
          var mdata;  
                // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
                if (req.readyState == 4) { // `DONE`
                  status = req.status;
                  if (status == 200) {
                    console.log('the response is: ',req.responseText);
                    mdata = JSON.parse(req.responseText);
                    //var em = email;
                    modifyR.apply(this, [mdata, email, metadata, updateUserList,user_id, updateUI]);//, em,meta, updatecb);
                    //return mdata;

                  } else {
                    alert(status); 
                  }
                }
              }; 

              req.open('GET', "https://yves.eu.auth0.com/api/v2/rules/rul_JiDBbAUX9oUWs3qS?_=1470410245397", true);
              req.setRequestHeader("Authorization", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIwaEVkeUU3VVI2OEg3Z3U1V2pGOG9HelZkZ051dmVaVSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJjcmVhdGUiLCJkZWxldGUiXX0sInVzZXJzX2FwcF9tZXRhZGF0YSI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJkZWxldGUiLCJjcmVhdGUiXX0sInJ1bGVzIjp7ImFjdGlvbnMiOlsicmVhZCIsInVwZGF0ZSIsImRlbGV0ZSIsImNyZWF0ZSJdfX0sImlhdCI6MTQ3MDIzMTQ4OCwianRpIjoiMjQ5MWE4MDNhOWZmOWEzNjQzNjZmZTA5YmEwODJiZTcifQ.sqPz726JSvaAufxXrJ742UKz4g74YujTq9GzSJvqD7o');
              req.setRequestHeader("Accept","application/json"); 
              req.send();

            }, 

            modifyRule: function(response, email, meta, updateUserList, user_id, updateUI){

           
              var add; 

              var script = JSON.stringify(response.script); 
              var scope = this; 
             

              if(meta && meta.hasWickedWifiAccess){

                script = script.replace(",'"+email+"'", ""); 
                add = false; 
              }
              else{

                script = script.replace("]; //authorized", ",'"+ email + "']; //authorized" ); 
                add = true; 
              }


              var req = new XMLHttpRequest();

              req.onreadystatechange = function() {
                var status;
                var mdata; 
             
              if (req.readyState == 4) { // `DONE`
                status = req.status;
                if (status == 200) {
                  console.log('the response is: ',req.responseText);
                  mdata = JSON.parse(req.responseText);
                  updateUserList.apply(scope, [email, add, user_id, updateUI]);
                 

                } else {
                  alert(status); 
                }
              }
            }; 

            req.open('PATCH', "https://yves.eu.auth0.com/api/v2/rules/rul_JiDBbAUX9oUWs3qS", true);
            req.setRequestHeader("Authorization", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIwaEVkeUU3VVI2OEg3Z3U1V2pGOG9HelZkZ051dmVaVSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJjcmVhdGUiLCJkZWxldGUiXX0sInVzZXJzX2FwcF9tZXRhZGF0YSI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJkZWxldGUiLCJjcmVhdGUiXX0sInJ1bGVzIjp7ImFjdGlvbnMiOlsicmVhZCIsInVwZGF0ZSIsImRlbGV0ZSIsImNyZWF0ZSJdfX0sImlhdCI6MTQ3MDIzMTQ4OCwianRpIjoiMjQ5MWE4MDNhOWZmOWEzNjQzNjZmZTA5YmEwODJiZTcifQ.sqPz726JSvaAufxXrJ742UKz4g74YujTq9GzSJvqD7o');
            req.setRequestHeader("Accept","application/json"); 
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            var body = "{\"script\":" + script +"}"; 
            var payl = JSON.parse(body); 
            req.send(JSON.stringify(payl)); 

          },

          updateUserData: function(email, add, id, updateUI){

            var scope = this; 
            var callback= updateUI; 
            var req = new XMLHttpRequest();

            req.onreadystatechange = function() {
              var status;
              var mdata; 
                
                if (req.readyState == 4) { // `DONE`
                  status = req.status;
                  if (status == 200) {
                    console.log('the response is: ',req.responseText);
                    mdata = JSON.parse(req.responseText);
                    updateUI.apply(scope, [email, add]);
                 


                  } else {
                    alert(status); 
                  }
                }
              }; 

              req.open('PATCH', "https://yves.eu.auth0.com/api/v2/users/"+id, true);
              req.setRequestHeader("Authorization", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIwaEVkeUU3VVI2OEg3Z3U1V2pGOG9HelZkZ051dmVaVSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJjcmVhdGUiLCJkZWxldGUiXX0sInVzZXJzX2FwcF9tZXRhZGF0YSI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJkZWxldGUiLCJjcmVhdGUiXX0sInJ1bGVzIjp7ImFjdGlvbnMiOlsicmVhZCIsInVwZGF0ZSIsImRlbGV0ZSIsImNyZWF0ZSJdfX0sImlhdCI6MTQ3MDIzMTQ4OCwianRpIjoiMjQ5MWE4MDNhOWZmOWEzNjQzNjZmZTA5YmEwODJiZTcifQ.sqPz726JSvaAufxXrJ742UKz4g74YujTq9GzSJvqD7o');
              req.setRequestHeader("Accept","application/json");
              req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

              var body; 
              if(add==true){

                body = "{ \"user_metadata\" : { \"hasWickedWifiAccess\": true } }"; 
              } 
              else{
                body = "{\"user_metadata\": {}}"; 
              }

              var payl = JSON.parse(body); 
              req.send(JSON.stringify(payl)); 
            },

            updateList: function(email, add){

             
              for(var i =0;i<this.props.data.length;i++){
                console.log("there is data"); 
                if(this.props.data[i].name == email){
                  var payl; 
                  if(add==true){
                   payl = JSON.parse("{ \"hasWickedWifiAccess\": true }"); 
                   this.props.data[i].user_metadata = payl; 
                 } else{
                  payl = JSON.parse("{}"); 
                  this.props.data[i].user_metadata = payl; 
                }

              }
            }
            this.forceUpdate(); 

          },

          render: function() {
            var results  =  this.props.data;
            var access;
            return (
              <ol>
              {results.map(function(result) {
               if(result.user_metadata && result.user_metadata.hasWickedWifiAccess==true){
                console.log("hasWickedWifiAccess"); 
                access = "Remove WickedWifi"; 
              }
              else{

                access = "add WickedWifi"; 
              } 
            
              return <li key={result.id}>{result.nickname}  <button onClick={this.switchAccess.bind(this, result.name, result.user_metadata, this.modifyRule, this.updateUserData, result.user_id, this.updateList)}>{access}</button></li>;
            }, this)}; 
              </ol>
              );
            }

          });
          



          var elem = React.createElement(ListComponent, Object.assign({}, this.props, { data: data })); 

          ReactDOM.render(elem, document.getElementById('section')) ; 

        }

        administer(){

          var disp = this.displayUsers; 
         
          var req = new XMLHttpRequest();

          var objTmp = this;

            req.onreadystatechange = function() {
              var status;
              var mdata; 

              if (req.readyState == 4) { // `DONE`
                status = req.status;
                if (status == 200) {  
                  console.log('the response is: ',req.responseText);
                  mdata = JSON.parse(req.responseText);
                  disp.apply(objTmp, [mdata]);
                

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





        render(){ 
          const { profile } = this.state
          var adminComp; 
          if(profile.user_metadata.isAdmin){
            adminComp = <Button onClick={this.administer.bind(this)}>Admin</Button>; 
          }

          return (
            <div className={styles.root}>
            <h2>Home</h2>
            <p>Welcome {profile.name}!</p>
            <Button onClick={this.logout.bind(this)}>Logout</Button><br/> <br/> 
            <a href="http://app2.com:3001/">Click here to go to WickedWifi</a><br/> <br/> 

            {adminComp}

            <div id="section"></div>

            </div>
            )
        }
      }

      export default Home;
