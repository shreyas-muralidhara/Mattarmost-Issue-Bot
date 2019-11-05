const github = require("./github.js");
const nock = require("nock");
const data = require("./mock.json");

let repo = process.env.MMREPO;
let bot_name = process.env.MMBOTNAME;

async function getPriority(msg,client)
{

    let issue = await github.getIssuesSince("sghanta",repo);

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
      console.log("issue [",i,"] = ", issue[i]);
      //Consider only open issues for Priority ordering
      if(issue[i].state == "open" && issue[i].hasOwnProperty('pull_request') == false)
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
    message += "Issue ID\t\tIssue title\t\tassignee\t\tPriority\n"
    for (var i=0;i<prio_score.length;i++){

      for(var j=0; j<prio_score.length; j++)
           message += prio_score[i][j] + "\t\t";
      message += "\n"
    }
    client.postMessage(message,msg.broadcast.channel_id);
}

async function updatePrio(msg,client)
{

  let issue = await github.getIssuesSince("sghanta",repo);
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
      print += "Issue title does not exist"
  else
      print += "These are the labels currently set for the issues:\n" + labels +"\n\nProvide the labels in following format\" change issue <attribute> <new label> <old label>\"";

  client.postMessage(print,msg.broadcast.channel_id);
}

exports.getPriority = getPriority;
exports.updatePrio = updatePrio;
