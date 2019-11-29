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
    this.repo = process.env.MMREPO;
    this.owner = process.env.GITOWNER;
    this.issuelabel="";
    this.createlist={};
    this.milestone="";
    this.channelid;
  }
  // create Issue;
  async createIssue(msg){
      
    var data = JSON.parse(msg.data.post).message;
    let splitData = data.split(" ");
    //var issue_label = "";
    if (splitData.includes("hard")){
      this.issuelabel = "Difficulty:Hard";
    }else if (splitData.includes("medium")) {
      this.issuelabel = "Difficulty:Medium";
    }else if (splitData.includes("easy")){
      this.issuelabel = "Difficulty:Easy";
    }else{
      this.client.postMessage("Can't interpet the message",msg.broadcast.channel_id);
      this.issuelabel="";
      return ;
    }
    if(this.issuelabel!=""){
      this.channelid=msg.broadcast.channel_id;
      this.client.postMessage("Sure....\n List the attributes in the following format..\n *** \n ```title: <Title of the issue>\n body: <Body of the title> \n labels: <labels seperated with comma eg: label1,label2,label3> \n milestone: <milestone name> ```\n *** \n After entering the attributes type **done listing attributes** to see the recommended assignees",msg.broadcast.channel_id);
      this.createlist = {
      "title": null,
    "body": "",
    "milestone": null,
    "labels": [],
    "assignees":[]
      }	    
    }
  }
  async getAttributes(msg){

    if(this.issuelabel==""){
      this.client.postMessage("Haven't mentioned about the type of the issue",this.channelid);
      return;
    }
    //console.log("entered into getAttributes",this.createlist);	  
    /*	  
    var create = {
    "title": "",
    "body": "",
    "milestone": "",
    "labels": [],
    "assignees":[]
  };*/
    /*	  
     */
     // const miles = nock("https://api.github.com")
     //     .get("/repos/testuser/Hello-World/milestones")
     //     .reply(200, JSON.stringify(issueData.milestone));
     
    if(!this.createlist.title || this.milestone=="" ){
    this.client.postMessage("Unable to get the required the attributes",this.channelid);
     return;
    }
    var due_on = "";
    var milestones = await github.getMilestone(this.owner,this.repo);
    //console.log(milestones);
    if(milestones===null){
      return;
    }
    // milestone title mismatch	   
    var flag1=0;
    //this.milestone="Deployment milestone"
    for(var i=0;i<milestones.length;i++){
      if(milestones[i].title==this.milestone){
        due_on = milestones[i].due_on;
	//console.log(milestones[i].title, this.milestone,"in if loop");
        this.createlist.milestone = milestones[i].number;
	flag1=1;
      }
    }
    if(flag1==0){
    this.client.postMessage("Milestone title not found",this.channelid);
    return;
    }	  
    //console.log(this.createlist.milestone,"in the loop");	  
    if(new Date(due_on).getTime() < new Date().getTime()){
      this.client.postMessage("The milestone due date is already over!!!!",this.channelid);
      return;
    }
    //console.log("entered into function planning");
    var users= await this.planning(due_on);
    //console.log("Shold enter planning",users,users.length);
    if(users.length>0){
      msg = "Here are the users who can complete the work: \n";
      for (var i = 0; i < users.length; i++) {
        msg = msg+"  * "+ users[i]+"\n";
      }
    //this.client.postMessage("Here are the users who can complete the work: "+users,this.channelid);
    this.client.postMessage(msg,this.channelid);
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
        if(currTime-new Date(closed_li[i].closed_at).getTime() <= 30*24*60*60*1000){
          //accessing only the last 30 issues.
        var weight=0;
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
        if(weight==0){
		weight = 25; // default weight is set as 25
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
      if (open_li[i].hasOwnProperty('milestone')==false && open_li[i].milestone.due_on !=null){
         var days = (new Date(open_li[i].milestone.due_on).getTime() - currTime)/(24*60*60*1000);
      }else{
	 var days = 14 // default days = 14     
      }	    
      if(days<=0){
        continue;  // tackle this ....... Remember to close this issues which crossed the deadline to get better accuracy
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
          flag=3
	  weight=0;
          break;
        }
        else if(open_li[i].labels[j].name.includes("Resolved") == true && (currTime-new Date(open_li[i].updated_at).getTime() <= 30*24*60*60*1000)){
          flag=2;
        }
      }
	  if(weight==0 && flag!=3){
	        weight = 25 // assuming it is an easy issue
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
          Closedweight=80; // Default value atleast the user will do 
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
    	  
    var flag=0
    for (var i in this.client.users){
         if(this.client.users[i].username == splitData[3]){
                 flag=1;
                 break;
         }
    }
    if(flag==0){
        this.client.postMessage("Have you entered correct assignee? Please verify the assignee username",msg.broadcast.channel_id);
            return;
    }
    	  
    this.createlist.assignees.push(splitData[3]);
    var iss = await github.createIssue(this.owner,this.repo,this.createlist);
    console.log(iss);
    if(iss.hasOwnProperty('id')==true){
     this.client.postMessage("Issue is created",msg.broadcast.channel_id);
    }
    else{
    this.client.postMessage("Something went wrong..",msg.broadcast.channel_id);
    }

  }



async assignTitle(msg){
     let post = JSON.parse(msg.data.post);
     let data = post.message.split(":");
     this.createlist.title = data[1];
     return;
}
async assignBody(msg){
     
     let post = JSON.parse(msg.data.post);
     let data = post.message.split(":");
     this.createlist.body = data[1];
     return;	
}
async assignLabels(msg){
	let post = JSON.parse(msg.data.post);
	let data = post.message.split(":");
	var mainmsg =""
	for(var i=1;i<data.length;i++){
		if(i!=data.length-1){
		mainmsg = mainmsg+data[i];
		}
		else{
			mainmsg = mainmsg+data[i];
		}
	}
	var labels = []
	if(mainmsg!=""){
	let templabels = mainmsg.split(',');
	for(var i=0;i<templabels.length;i++){
		labels.push(templabels[i].trim());
	}
	}
	this.createlist.labels = labels;
	this.createlist.labels.push(this.issuelabel);

	return ;
}
async assignMilestone(msg){
     	let post = JSON.parse(msg.data.post);
        let data = post.message.split(":");
        this.milestone = data[1].trim();

}

}
// see about the empty labels


module.exports = Case3;
// exports.createAPI = createAPI;
// exports.createIssue = createIssue;
// exports.getAttributes = getAttributes;
