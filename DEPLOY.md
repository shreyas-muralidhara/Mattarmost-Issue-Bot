# Milestone: DEPLOYMENT

## Deployment 
Run the following Ansible playbook [deploysetup.yml](https://github.ncsu.edu/csc510-fall2019/CSC510-11/blob/master/Deployment%20Scripts/deploySetup.yml) to deploy the bot on a VM with Ubuntu OS either in local machine or Public Cloud. 
This playbook is responsible for the tasks related to setting up Issuebot. This installs all the required modules, clones the github respository and runs the bot.  
The playbook also runs a shell script [environment.sh](https://github.ncsu.edu/csc510-fall2019/CSC510-11/blob/master/Deployment%20Scripts/environment.sh) which is responsible for setting the environment variables in the deployed environment.     
The screencast for the deployment can be found below:  
https://drive.google.com/open?id=1MFnmQ2q7TF-0MYC0t-JP3U7-TFDmqRb2  

The user should add his github token in the [gitToken.yml](https://github.ncsu.edu/csc510-fall2019/CSC510-11/blob/master/Deployment%20Scripts/gitToken.yml) before running the ansible playbook.  
Before running the playbook from a remote host, an ssh key pair has to be created and the public key needs to be added to the Intstance.  
The playbook can be run by the following command: sudo ansible-playbook deploySetup.yml 

## Acceptance Test 
 To initiate conversation with issuebot
1. Log-in to Mattermost (http://34.66.158.171:8065)
2. Enter "sghanta" as the username with "Issuebot@11" as the password for logging in.
3. After sucessfully logging-in navigate to issuebot channel and execute the test cases given in the acceptance test plan below.

We have added the instructor and TAs as collaborators to our "Process-Milestone" repo. This is currently linked to the mattermost account and any operations performed by the user will reflect in changes in this Repository.   

### UseCase1 - Priority ordering of issues based on labels and milestone
1. Issue bot provides priority for all open issues. It handles the edge case - missing milestone, issue attribute labels by cosidering default values for deciding priority.  
  `Input Request: display priority for all open issues`  
  ```
   Expected Response:   
    To update issue attributes, request format - Update <attribute> for <issue ID/title> to <attribute value> 
    Here are the issues: ... (followed by list of issues)
  ```
  ![image](https://media.github.ncsu.edu/user/14762/files/eb406e80-13b8-11ea-9ae0-21b9ceea4184)
  
  
2. Accept the request to change priority, during life cycle of issue. Request uses attribute - **priority** in format of specified in step1.  
   `Input Request: Update priority for 40 to Normal`  
   `Expected Response: Priority is updated successfully.`  
     
  ![image](https://media.github.ncsu.edu/user/14762/files/7bcb7e80-13ba-11ea-9c7b-9ca00fbe535d)
   
3. Accept the request to change milestone, which allows in updating a sprint milestone. Request uses attribute - **milestone** in format specified in step1.  
   `Input Request: Update milestone for 22 to Sprint 2 - test`  
   `Expected Response: Milestone is updated successfully.`  
     
  ![image](https://media.github.ncsu.edu/user/14762/files/2e87f500-142c-11ea-988f-e2c2359cf2c9)
  
4. Accept the request to change status, as the issue progress during the life cycle. Request uses attribute - **status** in format specified in step1.
   `Input Request: Update status for 51 to In-progress`  
   `Expected Response: Status is updated successfully.`
    
 ![image](https://media.github.ncsu.edu/user/14762/files/7c9df800-142e-11ea-88d1-eb1d7b96b81d)

5. Accept the request to change Issue type, from idea to feature. Request uses attribute - **Issue type** in the format specified in step1.
   `Input Request: Update issue type for 50 to feature`  
   `Expected Response: Issue Type is updated successfully.`
    
 ![image](https://media.github.ncsu.edu/user/14762/files/b02d5200-142f-11ea-9986-51056537a3cd)

6. Display list of all open issues and verify the update to issue attributes performed in step2, step3, step4 and step5. bot will recompute thepriority score for updated issue attributes.  
  `Input Request: display priority for all open issues`  
  ```
   Expected Response:   
    To update issue attributes, request format - Update <attribute> for <issue ID/title> to <attribute value> 
    Here are the issues: ... (followed by list of issues)
  ```  
  Priority of #40 should be changed from Low to Normal.  The priority score would be updated accordingly.  
  Milestone of #22 should be changed from Sprint 2 to Sprint 2 - test. The priority score would be updated accordingly.  
  Stataus of #51 should be changed from created to In-progress. The priority score would be updated accordingly.   
  Issue type for #50 should be changed from Idea to Feature. The priority score would be updated accordingly.  
  ![image](https://media.github.ncsu.edu/user/14762/files/bb35b180-1432-11ea-9dcc-e7fc47e3a674)


### UseCase2 
 1) The bot will display the list of stale issues to issue owners once every 24 hours.  
  `Input Request: < no input >`  
  `Expected Response:`     
  ![Use case2](https://media.github.ncsu.edu/user/11865/files/91297a00-1128-11ea-896e-fe0cb5583c71)    

 2) Now the user can reassign the issue to another assignee.  
   Request Format: Reassign < issue id > to < username >   
  `Input Request: Reassign 37 to sghanta`  
  `Expected Response: `  
  Sample Output: Assignee has been successfully changed  
  ![usecase2 1](https://media.github.ncsu.edu/user/11865/files/8c64c600-1128-11ea-95f2-3c6375643579)

  We have also handled edge cases during this Interaction:  
  If the issue owner tries to reassign the issue to an assignee who does not exist  
   ![usecase2 2](https://media.github.ncsu.edu/user/11865/files/91297a00-1128-11ea-904c-9973cff624b6)  
  If the issue owner tries to reassign an invalid issue id
    ![snip_new](https://media.github.ncsu.edu/user/10687/files/4c188700-144b-11ea-9a41-3dbff03d6792)  
  The [functionality document](https://github.ncsu.edu/csc510-fall2019/CSC510-11/blob/master/UseCase2_functionality.md) for this UseCase has a detailed explaination for the backend logic implemented. 
  

### UseCase3
1) The user can ask the bot to recomended assignees for a new issue  
  `Request Format: Recommend assignees who can work on < difficulty > issue`  
  `Input Request: Recommend assignees who can work on easy issue`  
  Expected Response:  
  ![snip](https://media.github.ncsu.edu/user/10687/files/55542480-1448-11ea-9321-63c0761ed798)

2) User will enter issue attributes and bot will display list of users  
  Request Format: title: <Title of the Issue>  
                  body: < Body of the Issue >  
                  labels: <labels seperated by comma eg: label1, label2, label3>  
                  milestone: < milestone name >  
  `Expected Response:` 
 
  ![case3 2](https://media.github.ncsu.edu/user/11865/files/f74f0200-12cc-11ea-9776-eb9ddb4a2e9b) 

3) User can assign this issue to his team member  
  Request Format: assign issue to < username >  
  `Input Request: assign issue to schippa `  
  `Expected Response:`   
  ![case3 3](https://media.github.ncsu.edu/user/11865/files/5cefbe00-12ce-11ea-9bad-6fed3441b8cc)

We have also handled alternate flow:  
Issue can be created even if it does not have label and body  
![case3 4](https://media.github.ncsu.edu/user/11865/files/48f88c00-12cf-11ea-92d2-ccb3d5841617)  

The [functionality document](https://github.ncsu.edu/csc510-fall2019/CSC510-11/blob/master/UseCase3_functionality.md) for this UseCase has a detailed explaination for the backend logic implemented.  

# Exploratory Testing and Code Inspection
The implementation of all use-cases in IssueBot can be inspected as below:

1.	[index.js](https://github.ncsu.edu/csc510-fall2019/CSC510-11/blob/master/IssueBot/index.js)  
index.js is the core module of the IssueBot. It helps facilitate communication among the other components of the bot. It imports other use case modules.

2.	[github.js](https://github.ncsu.edu/csc510-fall2019/CSC510-11/blob/master/IssueBot/github.js)  
github.js has all the functions used for making git API calls. 

3.	[case1.js](https://github.ncsu.edu/csc510-fall2019/CSC510-11/blob/master/IssueBot/case1.js)  
It contains the logic for Use Case 1.

4.	[case2.js](https://github.ncsu.edu/csc510-fall2019/CSC510-11/blob/master/IssueBot/case2.js)  
It contains the logic for Use Case 2.

5.	[case3.js](https://github.ncsu.edu/csc510-fall2019/CSC510-11/blob/master/IssueBot/case3.js)  
It contains the logic for Use Case 3.

# Bonus: Continuous Integration (CI) Server

We created a jenkins server that runs a build job for our bot, including running our integration tests. CI is run on a hosted VM. Our CI works based on a build running from a triggered commit, and also shows build logs of integration tests. We are using poll SCM from Jenkins that polls from our github repo every 2mins for an update. It creates a build on update and lets us know whether the build was a success or failure.

Steps to login to the Jenkins Server:  
1. Enter URL http://34.69.92.186:8080 in the browser.
2. Enter username as admin and password as admin

The link to screencast for Jenkins can be found below:
https://drive.google.com/file/d/1JmSN1qUYNYDEbk4f10J1BMQ4uor4M5R5/view

