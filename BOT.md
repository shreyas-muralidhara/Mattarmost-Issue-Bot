# BOT Milestone 

In this milestone we are developing our BOT based on the existing design proposal. We have made the following changes to our use cases based on the feedback given by the professor:  
1) UseCase1 has been updated
2) UseCase3 has been changed

Feedback given by professor Parnin:  
1) UseCase1-Prioritizing Issues should be based on ranking and momentum instead of sentiment. Include milestone due and Issue creation time as attributes while prioritizing issues.  
2) UseCase3-Come up with a better idea and refine that for BOT milestone.  

### Use Case Refinement
This is the revised design after feedback given by professor.

### Problem Statement:
Github is the most popular version control used in Software development lifecycle management.
Issue tracking and management is the most common feature, which is used by software engineers on github platform.
Software Engineers have to perform daily tasks of tracking and maintaining issues, by subscribing to emails and web notifications related to their work repositories.
The implementation of the issue bots should overcome these mundane tasks for the users in issue management lifecycle.
Users interact with the bot in simple phrases, where the user directs specific task to the bot.
Bot triggers the required commands at the backend. This avoids the user to periodically visit github for the follow up of each notification.
The user should have the independence of letting the bot know on what notification he wants to receive. 

### Bot Description:
The Issue Bot is an easy to use bot that helps users in issue maintenance tasks such as:  
* **Priority ordering of Issues based on milestone and labels.**   
  Issues on github are handled by assigning multiple labels. But when there are many issues, then collaborator needs to figure out which one takes the priority. Manually processing issues based on labels is easier for a short list. This is not the case in most repositories that are open to community of developers. This is where issue bot comes to the rescue by prioritizing the issues and tracking them periodically.  
  Bot takes into consideration the time of creation,label attributes- type, priority and status. Then generates a priority rank for this set of attributes. It also allows frequent update of attributes, as issue progresses across various phrases of resolution.
* **Escalate stale issues to other team members.**  
  The Bot will notify the owner of the issue about stale issues by sending a direct message . The owner of the issue can then reassign the stale issue to some other team members.
* **Agile planning with Github Issues.**  
  Based on an individual's skill and experience, each team member can resolve the issues accordingly in a sprint. Agile manager needs to estimate the effort required for completion of issue before sprint. Our issue bot can abate the task of Agile manager and help in making an informed decision, by displaying the existing workload for each member.           
  At backend, Bot assigns level of difficulty-hard, medium, easy. It then calculates **performance metric** for each team member, based on the weighted average of issues completed in past 2 sprints. Additionally, bot computes **workload metric** by member based on his weight of both existing incomplete issues and the new issue. Bot displays the potential team members who can work on issue, only if their performance metric is greater than their existing workload metric.

Bridging the gap between github and mattermost would make project management more efficient. Having these features in our bot helps enhance coordination within the team as a user can easily perform certain tasks from mattermost without having to use the git page and also it helps the developers avoid keeping track of the issues. 

Our Issue Bot is a response to events bot. Our bot falls into the category of chat- Dev Bot since, it acts as a mediator between the people  by sending notifications.

### BOT Implementation  
While implementing the bot we have two primary tasks:
<put screenshot>
### Bot Platform:  
IssueBot is a Mattermost bot which can be deployed to a local or a central server that can actively connect to Mattermost API to carry out tasks. 

### Bot Integration:    
IssueBot has been integrated with Mattermost using [Mattermost-client API](https://www.npmjs.com/package/mattermost-client).



### Use Cases
```
USECASE 1: Priority ordering of Issues based on milestone and labels.
1. Pre-conditions:
   The bot needs to be subscribed to the repository. If it is a Private repo the user should be a collaborator/owner of the Repository.
   For all existing open issues, the attribute labels- issuetype, issuepriority and issuestatus needs to be specified.
2. Main Flow: 
   When user requests for open issues, the bot displays the issues in prioritised order based on the label attributes and also allows the user to change the label attributes. 
3. Subflows:
   [S1]- The user would request open issues in the repository.
   [S2]- The bot will get the issues and determine its sentimental score based on the label attributes.  
   [S3]- The bot then displays the issues based on the priority. If the labels are missing, it assigns a default priority and displays it at the end of the list.
   [S4]- The user can request to update the attributes of a specific issue. 
4. Alternative Flow: 
   [E1]- If the labels for an issue are missing then sentimental score cannot be generated.
   ```
 ```  
USECASE 2: Escalate stale issues to other team members.
1. Pre-conditions:
   The bot needs to have the access to the repository. There must be some issues existing in the repository. 
2. Main Flow:
    The Bot will notify the owner of the issue about stale issues by sending a direct message . The owner of the issue can then reassign the stale issue to some other team members.
3. Subflows:
   [S1] Bot will notify the owner of the stale issues.  
   [S2] If some member has unsubscribed from the issue, he will not be notified.  
   [S3] The author can then reassign the stale issue to some other team members.  
4. Alternative Flows:
   [E1] The user will receive alerts only if there are stale issues.
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
### MOCKING  
Since the focus on our milestone is platform integration and bot interaction, we do not have a working service implementation. We have mocked services and data to support service integration.  A proper mocking infrastructure has allowed us to swap real and testing information in a single place, instead of hard-coded throughout the code base.

### SELENIUM TESTING  
We have used Selenium to verify that our bot is returning the correct response based on the input message. We have created a selenium test to demonstrate each use case. We have implemented at least one "happy path" and one "alternative" path for each use case. All the testcases are present in the folder Selenium Test.  
  
  
USECASE1:Priority ordering of Issues based on milestone and labels  
![UseCase1](https://user-images.githubusercontent.com/39837416/100526873-3a230e80-319b-11eb-8244-aae717550b8b.gif)  

USECASE2:Escalate stale issues to other team members  
![UseCase2](https://user-images.githubusercontent.com/39837416/100526888-6179db80-319b-11eb-968a-9f74f904c216.gif)  

USECASE3:Agile planning with Github Issues  
![UseCase3](https://user-images.githubusercontent.com/39837416/100526894-70608e00-319b-11eb-8d87-d6e996bdf434.gif)  

### SCREENCAST
[USECASE1](https://drive.google.com/file/d/1ZKNMRcHRiIrCATpUvkQmUzyxqFBMIG4Q/view?usp=sharing)-**Priority ordering of Issues based on milestone and labels.**  
[USECASE2](https://drive.google.com/file/d/1Cpt1mgy7RHx1V6ArFGiblaMCpq8iM_kr/view?usp=sharing)-**Escalate stale issues to other team members.**  
[USECASE3](https://drive.google.com/file/d/1aO1t9B61LzqFf5v_Aiq6-WFRbvTjjTJl/view?usp=sharing)-**Agile planning with Github Issues.**   


