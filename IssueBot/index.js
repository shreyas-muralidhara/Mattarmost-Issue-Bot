const Client = require('mattermost-client');
const _ = require("underscore");
// see about this !!!
const github = require("./github.js");
const case3  = require("./case3.js");
const nock = require("nock");
// hardcoded
let host = "127.0.0.1:8065"
let group = "se-team"
let bot_name = "testbot";
let client = new Client(host, group, {});
let repo = "Hello-World";
let botEmail = "testbot@localhost";
// Handle all of them with a config file or process.env
const data = require("./mock.json");

async function main()
{
    console.log(process.env.BOTTOKEN);
    let request = await client.tokenLogin(process.env.BOTTOKEN);

    setInterval(staleIssuesBot,60000);
    client.on('message', function(msg)
    {
        if (hears(msg)){
            msg_parse(msg)
        }
    });
}

function msg_parse (msg)
{
    if( msg.data.post )
    {

        let post = JSON.parse(msg.data.post);
        for text in []
        if( post.message.indexOf(text) >= 0)
        {
            return true;
        }
        //if none of the functions are called request user to give proper input
    }
    
    
}
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
            getPriority(msg);
          }
          else if( hears(msg, "update the priority for "))
          {
            updatePrio(msg);
          }
          else if( hears(msg, "change issue priority"))
          {
            var print = "";
            print += "Issue label updated";
            client.postMessage(print,msg.broadcast.channel_id);
          }


function hears(msg)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {

        let post = JSON.parse(msg.data.post);
        if( len(post.message) >= 0) //check this 
        {
            return true;
        }
    }
    return false;
}
    
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
async function getPriority(msg)
{
    const issue2 = nock("https://api.github.com")
    .get("/repos/testuser/Hello-World/issues")
    .reply(200, JSON.stringify(data));

    let issue = await github.getIssuesSince("testuser",repo);

    var time_weight = 35;
    var prio_weight = 35;
    var status_weight = 15;
    var type_weight = 15;

    var prio_score = [];

    /* Assigning weights to attribut:priority based on labels.
    // We consider high as Maximum and low as minimum.*/
    var prio_high = 1;
    var prio_normal = 0.7;
    var prio_low = 0.3;
    // default value considered if tag attribute not assigned.
    var prio_def = 0.3;
    var val_prio = -1; // updated to value of attribute priority

    /* Assign weights to the attribute:status based on labels.
    // With the issue progress along various phases of resolution, we reduce the weight for the labels.*/
    var stat_created = 1;
    var stat_confirmed = 0.8;
    var stat_deferred = 1;
    var stat_in_progress = 0.6;
    var stat_fix_committed = 0.25;
    var stat_resolved = 0;
    var stat_incomplete = 1;
    var stat_rejected = 0;
    // default value considered if tag attribute not assigned.
    var stat_def = 1;
    var val_status = -1; // updated to value of attribute priority.

    /* Assign weights to the attribute:issue_type based on labels.
    // we consider the weight of bug as highest,  idea as lowest*/
    var isstype_bug = 1;
    var isstype_support = 0.8;
    var isstype_task = 0.7;
    var isstype_feature = 0.5;
    var isstype_invalid = 0;
    var isstype_idea = 0.3;
    // default value considered if tag attribute not assigned.
    var isstype_def = 0.3;
    var val_issue_type = -1;

    var currtime = new Date().getTime();

    for (var i = 0; i < issue.length; i++)
    {
      //Consider only open issues for Priority ordering
      if(issue[i].state == "open")
      {
        if(issue[i].labels.length > 0)
        {
          for(var j = 0; j < issue[i].labels.length; j++)
          {
            //Assigning priority attribute weights based on its labels
            if(issue[i].labels[j].name.toUpperCase().match(/HIGH/i))
                val_prio = prio_high;
            else if (issue[i].labels[j].name.toUpperCase().match(/NORMAL/i))
                val_prio = prio_normal;
            else if (issue[i].labels[j].name.toUpperCase().match(/LOW/i))
                val_prio = prio_low;

            //Assigning status attribute weights based on its labels
            else if (issue[i].labels[j].name.toUpperCase().match(/CREATED/i))
                val_status = stat_created;
            else if (issue[i].labels[j].name.toUpperCase().match(/CONFIRMED/i))
                val_status = stat_confirmed;
            else if (issue[i].labels[j].name.toUpperCase().match(/DEFERRED/i))
                val_status = stat_deferred;
            else if (issue[i].labels[j].name.toUpperCase().match(/PROGRESS/i))
                val_status = stat_in_progress;
            else if (issue[i].labels[j].name.toUpperCase().match(/FIX/i))
                val_status = stat_fix_committed;
            else if (issue[i].labels[j].name.toUpperCase().match(/RESOLVED/i))
                val_status = stat_resolved;
            else if (issue[i].labels[j].name.toUpperCase().match(/INCOMPLETE/i))
                val_status = stat_incomplete;
            else if (issue[i].labels[j].name.toUpperCase().match(/REJECTED/i))
                val_status = stat_rejected;

            //Assigning Issue type attribute weights based on its labels
            else if (issue[i].labels[j].name.toUpperCase().match(/BUG/i))
                val_issue_type = isstype_bug;
            else if (issue[i].labels[j].name.toUpperCase().match(/SUPPORT/i))
                val_issue_type = isstype_support;
            else if (issue[i].labels[j].name.toUpperCase().match(/TASK/i))
                val_issue_type = isstype_task;
            else if (issue[i].labels[j].name.toUpperCase().match(/FEATURE/i))
                val_issue_type = isstype_feature;
            else if (issue[i].labels[j].name.toUpperCase().match(/IDEA/i))
                val_issue_type = isstype_idea;
            else if (issue[i].labels[j].name.toUpperCase().match(/INVALID/i))
                val_issue_type = isstype_invalid;



            //Assigning default attribute valies i.e. priority - low, status - created and issue type - idea.
            if(val_prio == -1) val_prio = prio_def;
            if(val_status == -1) val_status = stat_def;
            if( val_issue_type == -1) val_issue_type = isstype_def;
          }
        }
        else if(issue[i].labels.length==0)
        {
          val_prio = prio_def;
          val_status = stat_def;
          val_issue_type = isstype_def;
        }

        var currtime = new Date().getTime();
        if(issue[i].milestone==null)
            var milestoneDue = 7*24*60*60*1000+currtime;
        else
          var milestoneDue = new Date(issue[i].milestone.due_on).getTime();


        if( (milestoneDue-currtime) > (milestoneDue- new Date(issue[i].created_at).getTime())*val_status)
          var val_timeDays = 100 - ((currtime - new Date(issue[i].created_at).getTime())/(24*60*60*1000));
        else
          var val_timeDays= 100 - (((milestoneDue - new Date(issue[i].created_at).getTime())/(24*60*60*1000))*val_status);

        if(issue[i].assignee == null)
            var user_assignee = "No assignee";
        else
            var user_assignee = issue[i].assignee.login;

        var weight = ((val_timeDays/100) * time_weight) + (val_prio * prio_weight) + (val_status * status_weight) + (val_issue_type * type_weight);
        weight = weight.toFixed(2);

        prio_score[i] = [issue[i].id,issue[i].title,user_assignee,weight];

        //console.log("weight ",weight,"issue: ",val_timeDays.toFixed(2),"Prio value: ",val_prio," status value: ",val_status," Issue type value: ",val_issue_type);
      }
    }
    prio_score = prio_score.sort(function(a,b){return a[3] < b [3]});
    var message ="Here are the issues\n";
    message += "Issue ID\t\tIssue label\t\tassignee\t\tPriority\n"
    for (var i=0;i<prio_score.length;i++){

      for(var j=0; j<prio_score.length; j++)
           message += prio_score[i][j] + "\t\t";
      message += "\n"
    }
    client.postMessage(message,msg.broadcast.channel_id);
}

async function updatePrio(msg)
{
  const issue3 = nock("https://api.github.com")
  .get("/repos/testuser/Hello-World/issues")
  .reply(200, JSON.stringify(data));

  let issue = await github.getIssuesSince("testuser",repo);
  var message = JSON.parse(msg.data.post).message;

  var labels = "";
  var flag = false;

  console.log("echo message",message.substring(24));

  for (var i=0;i < issue.length; i++)
  {
    if(issue[i].title == message.substring(24))
    {
      flag = true;

      for(var j=0;j < issue[i].labels.length; j++)
        labels += issue[i].labels[j].name + "\t";
    }
  }
  var print ="";
  console.log("labels",labels,"flag",flag);
  if (flag == true && labels == null)
      print += "no labels assigned for this issue";
  else if (flag == false)
      print += "Issue label does not exist"
  else
      print += "These are the labels currently set for the issues:\n" + labels +"\n\nProide the labels in following format\" change issue <attribute> <new label> <old label>\"";

  client.postMessage(print,msg.broadcast.channel_id);
}


////////////
(async () =>
{

    await main();

})()
