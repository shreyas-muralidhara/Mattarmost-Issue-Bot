const github = require("./github.js");
const nock = require("nock");
const collabData = require("./collabMock.json");
const issueData = require("./Mockissues.json");
//set global variable
let repo = "Hello-World";
let bot_name = "testbot";
var issueLabel = "";
var createlist;
// list of attributes
// implement in class
async function createIssue(msg,client){
  var data = JSON.parse(msg.data.post).message;
  let splitData = data.split(" ");
  var issue_label = "";
  if (splitData.includes("hard")){
    issue_label = "hard";
  }else if (splitData.includes("medium")) {
    issue_label = "medium";
  }else if (splitData.includes("easy")){
    issue_label = "easy";
  }else{
    client.postMessage("Can't interpet the message",msg.broadcast.channel_id);
    return ;
  }
  if(issue_label!=""){
    client.postMessage("list issue attributes to create the issue",msg.broadcast.channel_id);
    issueLabel = issue_label;
    // client.on('message', function(msg1)
    // {
    //   if(hears(msg1,"Attributes")){
    //     getAttributes(msg1,client,issue_label);
    //   }
    // });
  }
}
async function getAttributes(msg,client){
  var create = {
  "title": "",
  "body": "",
  "milestone": "",
  "labels": [],
  "assignees":[]
};
  var data = JSON.parse(msg.data.post).message;
  // Data parsing

  let temp_issue = data.split(";");
  console.log(temp_issue);

  create.title = temp_issue[1];
  create.body = temp_issue[2];
  create.milestone = temp_issue[3];
  create.labels = [issueLabel];

   const miles = nock("https://api.github.com")
       .get("/repos/testuser/Hello-World/milestones")
       .reply(200, JSON.stringify(issueData.milestone));
  var due_on = "";
  var milestones = await github.getMilestone("testuser",repo);
  for(var i=0;i<milestones.length;i++){
    if(milestones[i].title==create.milestone){
      due_on = milestones[i].due_on;
    }
  }
  var users= await planning(create,due_on);
  if(users.length>0){
  client.postMessage("Here are the users who can complete the work: "+users,msg.broadcast.channel_id);
  createlist = create;
  }
  else{
    client.postMessage("No user available to complete the work");
  }
  // client.on('message', function(msg1)
  // {
  //   if(hears(msg1,"Assign")){
  //     create.assignees = ["bobcat"];
  //     // parse the assignees
  //     createAPI(create,msg1,client);
  //     client.close();
  //   }
  // });
}

async function createAPI(msg,client){
  const con = nock("https://api.github.com")
      .post("/repos/testuser/Hello-World/issues/",JSON.stringify(createlist))
      .reply(200, JSON.stringify(issueData.bobcat[0]));
  var iss = await github.createIssue("testuser",repo,createlist);
  if(iss){
  client.postMessage("Issue is created",msg.broadcast.channel_id);
  }
}
// see about the empty labels
async function planning (temp_issue,due_on){

  const collabo = nock("https://api.github.com")
      .get("/repos/testuser/Hello-World/collaborators")
      .reply(200, JSON.stringify(collabData));

  var users = await github.getCollaborators("testuser",repo);

  var user_li =[];

  var weight=0;

  for (var x=0;x<users.length; x++) {
  //closed_li=  get all closed issues for a user in the last 30 days : GET /repos

  var Closedweight=0;
  var Openweight=0;
  var u = users[x].login;
  var performance_metric = 0;
  var cl = nock("https://api.github.com")
      .get("/repos/testuser/Hello-World/issues?state=closed&assignee="+users[x].login)
      .reply(200, JSON.stringify(issueData[u]));
  var closed_li = await github.getIssueswithState("testuser",repo,"closed",users[x].login);

    for (var i=0;i<closed_li.length;i++){
      if (closed_li[i].labels.includes("hard") == true){
          weight=80;
      }
      else if (closed_li[i].labels.includes("medium") == true){
          weight=50;
      }
      else if (closed_li[i].labels.includes("easy") == true){
          weight=25;
      }
      Closedweight+= weight;
  }
  performance_metric=Closedweight/30;
  //open_li= get all the open issues for a user
  var temp = "open"+u;
  var op = nock("https://api.github.com")
      .get("/repos/testuser/Hello-World/issues?state=opened&assignee="+u)
      .reply(200, JSON.stringify(issueData[temp]));
  var open_li = await github.getIssueswithState("testuser",repo,"opened",users[x].login);

  for (var j=0;j<open_li.length;j++){
      if (open_li[j].labels.includes("hard") == true){
            weight=80;
        }
        else if (open_li[j].labels.includes("medium") == true){
            weight=50;
        }
        else if (open_li[j].labels.includes("easy") == true){
            weight=25;
        }
        Openweight+= weight;
    }
    var temp_weight = 0;
    if (temp_issue.labels.includes("hard") == true){
        temp_weight=80;
      }
      else if (temp_issue.labels.includes("medium") == true){
      temp_weight=50;
    }
    else if (temp_issue.labels.includes("easy") == true){
        temp_weight=25;
      }
      var currTime = new Date().getTime();
      var days = (new Date(due_on).getTime()-currTime)/(24*60*60*1000);
      var workload_metric=(Openweight+temp_weight)/(days);
      //console.log(performance_metric,workload_metric);
    if (performance_metric > workload_metric){
          user_li.push(u);
      }
    }
    return user_li;
}


exports.createAPI = createAPI;
exports.createIssue = createIssue;
exports.getAttributes = getAttributes;
