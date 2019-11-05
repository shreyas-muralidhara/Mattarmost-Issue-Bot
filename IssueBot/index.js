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

async function main()
{
    console.log(process.env.BOTTOKEN);
    let request = await client.tokenLogin(process.env.BOTTOKEN);
    setInterval(case2.staleIssuesBot,60000,client);
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
        if( (data.includes("hard") || data.includes("medium") || data.includes("easy")) && (data.includes("have") ||data.includes("create") || data.includes("new")) && data.includes("issue"))
         {   
          
            return case3.createIssue(msg,client);
            //console.log("enter final")
         }
        else if (data.includes("attributes") || data.includes("issueattributes"))
        {
            return case3.getAttributes(msg,client);
        }
        else if (data.includes("assign") && data.includes("issue"))
        {
            return case3.createAPI(msg,client);        
        }
        else if (data.includes("reassign"))
        {
          return case2.staleIssuesUser(msg,client)
        }
        else if((data.includes("list") ||data.includes("all")) && (data.includes("display") ||data.includes("show")) && data.includes("issues"))
        {
            return getPriority(msg);         
        }
        else if(data.includes("show")||data.includes("display") && (data.includes("priority")))
        {
           return updatePrio(msg,client);  
        }
        //add shreyas fuction for changing priority
        else
        {
          client.postMessage("Please enter the correct data",msg.broadcast.channel_id)
          //print to mattermost channel that the input is wrong 
        }
        //if none of the functions are called request user to give proper input
    }
    
    
}


function hears(msg, text)
{
  console.log("enterd") 
  if( msg.data.sender_name == bot_name) return false;
  if( msg.data.post )
  { 
      console.log("hwe")
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