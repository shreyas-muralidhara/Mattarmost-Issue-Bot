const Client = require('mattermost-client');
const _ = require("underscore");
// see about this !!!
const github = require("./github.js");
const case3  = require("./case3.js");
const case1 = require("./case1.js");
const nock = require("nock");
// hardcoded
let host = process.env.MMHOST;
let group = process.env.MMGROUP;
let bot_name = process.env.MMBOTNAME;
let client = new Client(host, group, {});
let repo = process.env.MMREPO;
let botEmail = process.env.MMBOTMAIL;
// Handle all of them with a config file or process.env
const data = require("./mock.json");

async function main()
{
    console.log(process.env.BOTTOKEN);
    let request = await client.tokenLogin(process.env.BOTTOKEN);

    setInterval(staleIssuesBot,60000);
    client.on('message', function(msg)
    {
        console.log(msg);
          if( hears(msg, "Reassign") )
          {
            staleIssuesUser(msg);
          }
          else if(hears(msg,"I have a"))
          {
            case3.createIssue(msg,client);
          }
          else if(hears(msg,"Attributes")){
            case3.getAttributes(msg,client);
          }else if(hears(msg,"Assign")){
            case3.createAPI(msg,client);
          }else if( hears(msg, "display list of open issues"))
          {
            case1.getPriority(msg,client);
          }
          else if( hears(msg, "update the priority for "))
          {
            case1.updatePrio(msg,client);
          }
          else if( hears(msg, "change issue priority"))
          {
            var print = "";
            print += "Issue label updated";
            client.postMessage(print,msg.broadcast.channel_id);
          }
    });
}

function hears(msg, text)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {

        let post = JSON.parse(msg.data.post);
        if( post.message.indexOf(text) >= 0)
        {
            return true;
        }
    }
    return false;
}

async function staleIssuesUser(msg){
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
      client.postMessage("Assignee has been successfully changed", channel);
    }
    else{
      client.postMessage("Problem with the request", channel);
    }
}

// issue label change is required
async function staleIssuesBot(){
  //let channel = msg.broadcast.channel_id;

  // Mocking service
  const issue0 = nock("https://api.github.com")
      .get("/repos/testuser/Hello-World/issues")
      .reply(200, JSON.stringify(data));

  let issues = await github.getIssuesSince("testuser",repo);

  var dict = {};
  // curr time
  let currTime = new Date().getTime();
  for (var i = 0; i < issues.length; i++) {
    if(currTime-new Date(issues[i].updated_at).getTime()> 24*60*60*1000){
      // see about the assignee field
      if (issues[i].user.login in dict){
      dict[issues[i].user.login].push([issues[i].id,issues[i].title,issues[i].assignees]);
      }
      else{
        dict[issues[i].user.login] = [[issues[i].id,issues[i].title,issues[i].assignees]];
      }
    }
  }
  // actual data
  //console.log(dict);
  //////

  // Mock DATA of users
  var mockDict = {
    "cmanideep96@gmail.com":[[85705,"bugfix",["sandeep"]],[11865,"changecode",["manideep"]]]
  };
  //

  if(Object.keys(mockDict).length>0){
  for(var key in mockDict){
    var msg="Here are the stale issues ..... \n";
    var channels = client.getAllChannels();

    for (var c in channels){
        if(channels[c].name.includes(client.getUserByEmail(key).id) && channels[c].name.includes(client.getUserByEmail(botEmail).id)){
          for(var i=0;i<mockDict[key].length;i++){
            msg = msg+mockDict[key][i][0]+"    "+mockDict[key][i][1]+ "     "+mockDict[key][i][2]+"\n";
          }
          //console.log(msg);
          client.postMessage(msg, c);
          break;
        }
    }
    //let channelName = client.getUserByEmail(key).id+"__"+client.getUserByEmail(botEmail).id;
    //var channel = client.findChannelByName(channelName).id;
  }
  }


}

async function parseMessage(msg)
{
    let channel = msg.broadcast.channel_id;
    let w = await weather.getWeather().catch( err => client.postMessage("Weather service is down. Sorry!", channel) );
    if( w )
    {
        client.postMessage(w, channel);
    }
}
// usecase 1:


////////////
(async () =>
{

    await main();

})()
