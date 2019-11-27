const Client = require('mattermost-client');
const _ = require("underscore");
// see about this !!!
const github = require("./github.js");
const case1 = require("./case1.js");
const case2 = require("./case2.js")
const Case3  = require("./case3.js");

const nock = require("nock");
// hardcoded
let host = process.env.MMHOST;
let group = process.env.MMGROUP;
let bot_name = process.env.MMBOTNAME;
let client = new Client(host, group, {});
let repo = process.env.MMREPO;
let botEmail = process.env.MMBOTMAIL;
// Handle all of them with a config file or process.env
//const data = require("./mock.json");
let case3 = null;
async function main()
{
    console.log(process.env.BOTTOKEN);
    let request = await client.tokenLogin(process.env.BOTTOKEN);
    setInterval(case2.staleIssuesBot,15000,client);
    client.on('message', function(msg)
    {
             if (hears(msg)){
              msg_parse(msg);
          }

    });
}

function msg_parse (msg)
{
    if( msg.data.post )
    {

        let post = JSON.parse(msg.data.post);
        let data = post.message.toLowerCase().split(" ");
        console.log(data);
        if( (data.includes("hard") || data.includes("medium") || data.includes("easy")) && (data.includes("have") ||data.includes("create") || data.includes("new")) && data.includes("issue"))
         {

            case3 = new Case3(client);
            return case3.createIssue(msg);
            //console.log("enter final")
         }
        else if (post.message.includes("Attributes")) // change this to form
        {
            if(case3!=null){
            return case3.getAttributes(msg);
          }
        }
        else if (data.includes("assign") && data.includes("issue"))
        {
            if (case3!=null){
            return case3.createAPI(msg);
            case3=null;
          }
        }
        else if (data.includes("reassign"))
        {
          return case2.staleIssuesUser(msg,client)
        }
        else if((data.includes("list") ||data.includes("all")) && (data.includes("display") ||data.includes("show")) && data.includes("issues"))
        {
            return case1.getPriority(msg,client);
        }
        else if(data.includes("show")||data.includes("display") && (data.includes("priority")))
        {
           return case1.updatePrio(msg,client);
        }
        //add shreyas fuction for changing priority
        else
        {
          client.postMessage("Sorry! I didn't get that.",msg.broadcast.channel_id);
          //print to mattermost channel that the input is wrong
        }
        //if none of the functions are called request user to give proper input
    }


}


function hears(msg, text)
{
	console.log(msg.data.sender_name, bot_name);
  if( msg.data.sender_name.includes(bot_name)) return false;

  if( msg.data.post )
  {

      let post = JSON.parse(msg.data.post);
      console.log(post.message)
      if( post.message.length >= 0) //check this
      {
          return true;
      }
  }
  return false;
}


////////////
(async () =>
{

    await main();

})()
