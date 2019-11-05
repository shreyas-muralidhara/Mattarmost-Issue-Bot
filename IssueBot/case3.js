const github = require("./github.js");
const nock = require("nock");
const collabData = require("./collabMock.json");
const issueData = require("./Mockissues.json");
//set global variable
// set repo name,owner, from environment variable
// let repo = "Process-Milestone";
// let owner = "sghanta"
// let bot_name = "testbot";
// var issueLabel = "";
// var createlist;
// Assumptions and problems
// assuming milestone date is not passed;
// What if closed weight is zero for now assigning solved by adding one hard issue
// see about the http returns
// parsing the messages getAttributes,createApi
// Integrate with process.env
class Case3{
  constructor(client){
    this.client = client;
    this.repo = "Process-Milestone";
    this.owner = "sghanta";
    this.issuelabel="";
    this.createlist={};
    this.channelid;
  }
  // create Issue;
  async createIssue(msg){
    var data = JSON.parse(msg.data.post).message;
    let splitData = data.split(" ");
    //var issue_label = "";
    if (splitData.includes("hard")){
      this.issuelabel = "hard";
    }else if (splitData.includes("medium")) {
      this.issuelabel = "medium";
    }else if (splitData.includes("easy")){
      this.issuelabel = "easy";
    }else{
      this.client.postMessage("Can't interpet the message",msg.broadcast.channel_id);
      this.issuelabel="";
      return ;
    }
    if(this.issuelabel!=""){
      this.channelid=msg.broadcast.channel_id;
      this.client.postMessage("list issue attributes to create the issue",msg.broadcast.channel_id);
    }
  }
  async getAttributes(msg){

    if(this.issuelabel==""){
      this.client.postMessage("Haven't mentioned about the type of the issue",this.channelid);
      return;
    }
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
    create.title = temp_issue[1];
    create.body = temp_issue[2];
    let milestoneTitle = temp_issue[3];
    create.milestone = -1;
    create.labels = [this.issuelabel];
    this.createlist=create;

     // const miles = nock("https://api.github.com")
     //     .get("/repos/testuser/Hello-World/milestones")
     //     .reply(200, JSON.stringify(issueData.milestone));
    var due_on = "";
    var milestones = await github.getMilestone(this.owner,this.repo);
    //console.log(milestones);
    if(milestones===null){
      return;
    }
    for(var i=0;i<milestones.length;i++){
      if(milestones[i].title==milestoneTitle){
        due_on = milestones[i].due_on;
        create.milestone = milestones[i].number;
      }
    }
    if(new Date(due_on).getTime() < new Date().getTime()){
      this.client.postMessage("The milestone due date is already over!!!!",this.channelid);
      return;
    }
    //console.log("entered into function planning");
    var users= await this.planning(due_on);
    //console.log("Shold enter planning",users,users.length);
    if(users.length>0){
    this.client.postMessage("Here are the users who can complete the work: "+users,this.channelid);
    //createlist = create;
    }
    else{
      this.client.postMessage("No user available to complete the work",this.channelid);
    }
  }
  async planning(due_on){
    try{
      var users = await github.getCollaborators(this.owner,this.repo);
    }catch(error){
      console.log("error in the api request");
      return;
    }

    var user_li =[];
    let currTime = new Date().getTime();
    for (var x=0;x<users.length; x++) {
    //closed_li=  get all closed issues for a user in the last 30 days : GET /repos

    var Closedweight=0;
    var Openweight=0;
    var u = users[x].login;
    var performance_metric = 0;
    var closed_li = await github.getIssueswithState(this.owner,this.repo,"closed",users[x].login);

      for (var i=0;i<closed_li.length;i++){
        var weight=0;
        if(currTime-new Date(closed_li[i].closed_at).getTime() <= 30*24*60*60*1000){
          //accessing only the last 30 issues.
        for(var j=0;j<closed_li[i].labels.length;j++){
          if(closed_li[i].labels[j].name.includes("Hard") == true){
            weight = 80;
            break;
          }
          else if (closed_li[i].labels[j].name.includes("Medium") == true){
              weight=50;
              break;
          }
          else if (closed_li[i].labels[j].name.includes("Easy") == true){
              weight=25;
              break;
          }
        }
        Closedweight+= weight;
      }
    }

    //open_li= get all the open issues for a user
    //var temp = "open"+u;
    // var op = nock("https://api.github.com")
    //     .get("/repos/testuser/Hello-World/issues?state=opened&assignee="+u)
    //     .reply(200, JSON.stringify(issueData[temp]));
    var open_li = await github.getIssueswithState(this.owner,this.repo,"open",users[x].login);

    for (var i=0;i<open_li.length;i++){
      var weight=0;
      var flag=0;
      var days = (new Date(open_li[i].milestone.due_on).getTime() - currTime)/(24*60*60*1000);
      if(days<=0){
        continue;
      }
      for(var j=0;j<open_li[i].labels.length;j++){

        if(open_li[i].labels[j].name.includes("Hard") == true && weight<80){
          weight = 80;
        }
        else if (open_li[i].labels[j].name.includes("Medium") == true && weight< 50){
            weight=50;
        }
        else if (open_li[i].labels[j].name.includes("Easy") == true && weight<25){
            weight=25;
        }
        else if(open_li[i].labels[j].name.includes("InProgress") == true){
          flag=1;
        }
        else if(open_li[i].labels[j].name.includes("Rejected") == true){
          weight=0;
          break;
        }
        else if(open_li[i].labels[j].name.includes("Resolved") == true && (currTime-new Date(open_li[i].updated_at).getTime() <= 30*24*60*60*1000)){
          flag=2;
        }
      }
          if(flag==1){
            weight = weight/2.0;
          }
          else if(flag==2){
            Closedweight+= weight;
            weight = 0;
          }
          Openweight = Openweight+ (weight/days); // open weight metric
      }
      var temp_weight = 0;
      if (this.createlist.labels.includes("hard") == true){
          temp_weight=80;
        }
        else if (this.createlist.labels.includes("medium") == true){
        temp_weight=50;
      }
      else if (this.createlist.labels.includes("easy") == true){
          temp_weight=25;
        }
        if(Closedweight==0){
          Closedweight=80;
        }
        performance_metric=Closedweight/30;

        var tdays = (new Date(due_on).getTime()-currTime)/(24*60*60*1000);
        var workload_metric=Openweight+(temp_weight)/(tdays);
        console.log(performance_metric,workload_metric,u);
      if (performance_metric > workload_metric){
            user_li.push(u);
        }

      }
      //console.log(user_li,"The loop ended!!!!");
      return user_li;
  }
  async createAPI(msg){
    // const con = nock("https://api.github.com")
    //     .post("/repos/testuser/Hello-World/issues/",JSON.stringify(createlist))
    //     .reply(200, JSON.stringify(issueData.bobcat[0]));
  //   var create = {
  //   "title": "",
  //   "body": "",
  //   "milestone": "",
  //   "labels": [],
  //   "assignees":[]
  // };
    var data = JSON.parse(msg.data.post).message;
    let splitData = data.split(" ");
    if (this.createlist.hasOwnProperty('assignees')==false){
      this.client.postMessage("Context is not found",msg.broadcast.channel_id);
      return;
    }
    this.createlist.assignees.push(splitData[3]);
    var iss = await github.createIssue(this.owner,this.repo,this.createlist);
    if(iss.hasOwnProperty('id')==true){
     this.client.postMessage("Issue is created",msg.broadcast.channel_id);
    }
  }

}


// see about the empty labels


module.exports = Case3;
// exports.createAPI = createAPI;
// exports.createIssue = createIssue;
// exports.getAttributes = getAttributes;
