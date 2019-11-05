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

async function staleIssuesUser(msg,client){
    // Reassign <issueid> to @Jacob,@Charlie
    // parse the msg variable
    let issueid = 2227;
    users = ["tom@gmail.com","jerry@gmail.com"]
    const issue1 = nock("https://api.github.com")
        .intercept("/repos/testuser/Hello-World/issues/2227","PATCH")
        .reply(200, JSON.stringify(data[0]));

    let issues = await github.EditIssue("testuser",repo,issueid);
    let channel = msg.broadcast.channel_id;
    if(issues){
      client.postMessage("assignee has been successfully changed", channel);
    }
    else{
      client.postMessage("Problem with the request", channel);
    }
}

// issue label change is required
async function staleIssuesBot(client){
  
  let issues = await github.getIssuesSince("sghanta",repo);
  var dict = {};
  // current time
  let currTime = new Date().getTime();
  for (var i = 0; i < issues.length; i++) {
    if(currTime-new Date(issues[i].updated_at).getTime()> 24*60*60*1000){
        if (issues[i].hasOwnProperty('pull_request')==false ){
          if (issues[i].assignee.login != null){

          if (issues[i].user.login in dict){  
          dict[issues[i].user.login].push([issues[i].id,issues[i].title,issues[i].assignee.login]);
          }
          else{
            dict[issues[i].user.login] = [[issues[i].id,issues[i].title,issues[i].assignee.login]];
          }
      }  
    }
  }
}

  if(Object.keys(dict).length>0){
  for(var key in dict){
    var msg="Here are the stale issues ..... \n";
    var channels = client.getAllChannels();
    for (var i in client.users){
      if (client.users[i].email==botEmail){
        var Botid=client.users[i].id      }
      if (client.users[i].username==key){
        var Userid=client.users[i].id
      }
    } 
    
    for (var c in channels){
        if(channels[c].name.includes(Userid) && channels[c].name.includes(Botid)){
          
          for(var i=0;i<dict[key].length;i++){
            msg = msg+dict[key][i][0]+"    "+dict[key][i][1]+ "     "+dict[key][i][2]+"\n";
          }
          client.postMessage(msg, c);
          break;
        }
    }


  }
  }


}

exports.staleIssuesUser = staleIssuesUser;
exports.staleIssuesBot = staleIssuesBot;
