//Assumptions
// Each User should have same username in Mattermost and GitHub
// We have currently displaying stale Issues once every 1 minute for demonstration purpose, it was actually intended to be once each day
// Our Idea for an issue to be stale is if it is not updated in the last 15 days but currently we have set it to 1 day for demonstration.
const Client = require('mattermost-client');
const _ = require("underscore");

const github = require("./github.js");
//const case3  = require("./case3.js");
//const case1 = require("./case1.js");
//const nock = require("nock");
// hardcoded
//let host = process.env.MMHOST;
//let group = process.env.MMGROUP;
//let bot_name = process.env.MMBOTNAME;
let repo = process.env.MMREPO;
let botEmail = process.env.MMBOTMAIL;
// Handle all of them with a config file or process.env
const data = require("./mock.json");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function staleIssuesUser(msg,client){
    // Reassign <issueid> to @Jacob,@Charlie
    // parse the msg variable
    //let issueid = 2227;
    let post = JSON.parse(msg.data.post);
    let data = post.message.toLowerCase().split(" ");
    //console.log(data)
    issue_id= data[1]
    assign= data[3]
    owner=process.env.GITOWNER;
    let issues = await github.getIssuesSince(owner,repo);
    //console.log(issue_id)
    //console.log(assign)
    var issueId = []
    let currTime = new Date().getTime();
    for(var i=0;i< issues.length;i++) {
    if(currTime-new Date(issues[i].updated_at).getTime()> 24*60*60*1000){
        if (issues[i].hasOwnProperty('pull_request')==false ){
          if (issues[i].assignee.login != null){
                issueId.push(issues[i].number);
          }
        }
    }
    }
   // console.log(typeof issueId[1]);
    // console.log(typeof Number(issue_id));	
    if (issueId.includes(Number(issue_id))==false){
        client.postMessage("Invalid issueId!!! Please verify the issueId",msg.broadcast.channel_id);
	return ;    
    }
    flag=0	
    for (var i in client.users){
         if(client.users[i].username == assign){
	         flag=1;
		 break;
	 }
    }
    if(flag==0){
        client.postMessage("Have you entered correct assignee? Please verify the assignee username",msg.broadcast.channel_id);
	    return;
    }	
    let editissues = await github.EditIssue(owner,repo,issue_id,assign);
    let channel = msg.broadcast.channel_id;
    if(editissues){
      client.postMessage("assignee has been changed successfully ", channel);
    }
    else{
      client.postMessage("Problem with the request", channel);
    }
}

// issue label change is required
async function staleIssuesBot(client){

  let issues = await github.getIssuesSince(process.env.GITOWNER,repo);
  var dict = {};
  // current time
  let currTime = new Date().getTime();
  for (var i = 0; i < issues.length; i++) {
    if(currTime-new Date(issues[i].updated_at).getTime()> 24*60*60*1000){
        if (issues[i].hasOwnProperty('pull_request')==false ){
          if (issues[i].assignee.login != null){

          if (issues[i].user.login in dict){
          dict[issues[i].user.login].push([issues[i].number,issues[i].title,issues[i].assignee.login]);
          }
          else{
            dict[issues[i].user.login] = [[issues[i].number,issues[i].title,issues[i].assignee.login]];
          }
      }
    }
  }
}
  //console.log(dict)
  if(Object.keys(dict).length>0){
	 // console.log(client.users);
  for(var key in dict){
    //var msg="Here are the stale issues ..... \n";

    var channels = client.getAllChannels();
    for (var i in client.users){
      if (client.users[i].username==process.env.MMBOTNAME){
        var Botid=client.users[i].id;      }
      if (client.users[i].username==key){
        var Userid=client.users[i].id;
      }
    }
    //console.log(dict)
    for (var c in channels){
        if(channels[c].name.includes(Userid) && channels[c].name.includes(Botid)){
          var msg = "";
          msg = msg +"| Issue ID | Issue title | Assignee |\n";
          msg = msg+ "| :----- | :---------: | :------: |\n";
          for(var i=0;i<dict[key].length;i++){
            msg = msg+" | "+ dict[key][i][0]+" | "+dict[key][i][1]+ " | "+dict[key][i][2]+" | "+"\n";
          }
          client.postMessage("Here are the stale issues .....",c);
	  sleep(1000);
          client.postMessage(msg, c);
          break;
        }
    }
    Botid=null
    Userid=null

  }
  }


}

exports.staleIssuesUser = staleIssuesUser;
exports.staleIssuesBot = staleIssuesBot;
