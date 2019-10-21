# BOT Milestone 

In this milestone we are developing our BOT based on the existing design proposal. We have made the following changes to our use cases based on the feedback given by the professor:  
1) UseCase1 has been updated
2) UseCase3 has been changed

eedback given by professor:
Use case 1 needs support for creating template for board and card prototypes(like color).
Better integration functionality of use case 1 and 2.
Reduce scope of non-essential management tasks in guidelines.
This is the revised design after feedback given by professor.

## Problem Statement:
Github is the most popular version control used in Software development lifecycle management.
Issue tracking and management is the most common feature, which is used by software engineers on github platform.
Software Engineers have to perform daily tasks of tracking and maintaining issues, by subscribing to emails and web notifications related to their work repositories.
The implementation of the issue bots should overcome these mundane tasks for the users in issue management lifecycle.
Users interact with the bot in simple phrases, where the user directs specific task to the bot.
Bot triggers the required commands at the backend. This avoids the user to periodically visit github for the follow up of each notification.
The user should have the independence of letting the bot know on what notification he wants to receive. 

## Bot Description:
The Issue Bot is an easy to use bot that helps users in issue maintenance tasks such as:  
* **Priority ordering of Issues based on a ranking and momentum.**   
  Issues on github are handled by assigning multiple labels. But when there are many issues, then collaborator needs to figure out which one takes the priority. Manually processing issues based on labels is easier for a short list. This is not the case in most repositories that are open to community of developers. This is where issue bot comes to the rescue by prioritizing the issues and tracking them periodically.  
  Bot takes into consideration the time of creation,label attributes- type, priority and status. Then generates a priority rank for this set of attributes. It also allows frequent update of attributes, as issue progresses across various phrases of resolution.
* **Escalate stale issues to other team members.**  
  The Bot will notify the author and collaborators of the repo of any stale issues by sending a direct message to them. The owner of the   issue can then reassign the stale issue to some other team members.
* **Agile planning with Github Issues.**  
  Based on an individual's skill and experience, each team member can resolve the issues accordingly in a sprint. Agile manager needs to estimate the effort required for completion of issue before sprint. Our issue bot can abate the task of Agile manager and help in making an informed decision, by displaying the existing workload for each member.           
  At backend, Bot assigns level of difficulty-hard, medium, easy. It then calculates **performance metric** for each team member, based on the weighted average of issues completed in past 2 sprints. Additionally, bot computes **workload metric** by member based on his weight of both existing incomplete issues and the new issue. Bot displays the potential team members who can work on issue, only if their performance metric is greater than their existing workload metric.

Bridging the gap between github and mattermost would make project management more efficient. Having these features in our bot helps enhance coordination within the team as a user can easily perform certain tasks from mattermost without having to use the git page and also it helps the developers avoid keeping track of the issues. 

Our Issue Bot is a response to events bot. Our bot falls into the category of chat- Dev Bot since, it acts as a mediator between the people  by sending notifications.

## BOT Implementation  
While implementing the bot we have two primary tasks:  
### Bot Platform:  
IssueBot is a Mattermost bot which can be deployed to a local or a central server that can actively connect to Mattermost API to carry out tasks.

### Bot Integration:    
IssueBot has been integrated with Mattermost using Mattermost-client API.



## Use Cases
```
USECASE 1: Priority ordering of Issues based on a sentimental score.
1. Pre-conditions:
   The bot needs to be subscribed to the repository. If it is a Private repo the user should be a collaborator/owner of the Repository.
   For all existing open issues, the attribute labels- issuetype, issuepriority and issuestatus needs to be specified.
2. Main Flow: 
   When user requests for open issues, the bot displays the issues in prioritised order based on the label attribute sentimental score and also allows the user to change the label attributes. 
3. Subflows:
   [S1]- The user would request open issues in the repository.
   [S2]- The bot will get the issues and determine its sentimental score based on the label attributes.  
   [S3]- The bot then displays the issues based on the priority. If the labels are missing, it assigns a default priority and displays it at the end of the list.
   [S4]- The user can request to update the attributes of a specific issue. 
4. Alternative Flow: 
   [E1]- If the labels for an issue are missing then sentimental score cannot be generated.
   ```
 ```  
USECASE 2: Stale issues alerts to all team members.
1. Pre-conditions:
   The bot needs to have the access to the repository. There must be some issues existing in the repository. 
2. Main Flow:
   Bot will notify the author and collaborators of the repo of any stale issues by sending a direct message to them. If the member has      unsubscribed from the issue, he will not be notified. The owner of the issue can then reassign the stale issue to some other team        members.
3. Subflows:
   [S1] Bot will notify the author and the collaborators of the repo of any stale issues.  
   [S2] If some member has unsubscribed from the issue, he will not be notified.  
   [S3] The author can then reassign the stale issue to some other team members.  
4. Alternative Flows:
   [E1] All the collaborators except for the owner of the issue have unsubscribed from the issue.
 ``` 

```
USECASE 3: Agile planning with Github Issues.
1. Pre-conditions: 
   The bot needs to be subscribed to the repository. If it is a Private repo the user should be a collaborator/owner of the Repository.
2. Main Flow: 
   Whenever a new issue is created, the bot assigns a tag to the issue viz. easy, medium and difficult. The bot then calculates performance metric for each team member, based on the weighted average of issues completed in past 2 sprints. Then it computes workload metric per team member based on his weight of both existing incomplete issues and the new issue. The bot will then display the potential team members who can work on the issue, only if their performance metric is greater than existing workload metric.
3. Subflows: 
   [S1]- When a new issue is created, the bot assigns a tag to the issue viz. easy, medium and difficult. 
   [S2]- The bot then calculates performance metric for each team member, based on the weighted average of issues completed in past 2 sprints. 
   [S3]- Then it computes workload metric per team member based on his weight of both existing incomplete issues and the new issue.
   [S4]- The bot will then display the potential team members who can work on the issue, only if their performance metric is greater than existing workload.
4. Alternative Flow: 
   [E1]- If the labels for an issue are missing then agile planning cannot be done.
```



