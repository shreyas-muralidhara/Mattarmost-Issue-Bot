# Milestone: DEPLOYMENT

## Deployment 
Run the following Ansible playbook either in a VM running on Ubuntu. 
This playbook is responsible for the tasks related to setting up Scibot. This installs all the required modules and packages to run the bot, clones the github respository and runs the bot

## Acceptance Test 
 To initiate conversation with scibot
1. Log-in to Mattermost (http://localhost:8085)
2. #?? Enter "seproject17@gmail.com" as the mail id with "SEProject2017" as the password for logging in.
3. #?? If you are logging in as admin please use "seprojecta17@gmail.com" as mail id with "seprojecta2017" as the password.
3. After sucessfully logging-in navigate to issuebot channel and execute the test cases given in the acceptance test plan below.

### UseCase1           



### UseCase2 
 1) The bot will display the list of stale issue once everyday (morning) but to ease testing, we have modified the bot to display stale issue list once every 15 mins.  
  Sample Input: -  
  Sample Output:   
  ![Use case2](https://media.github.ncsu.edu/user/11865/files/91297a00-1128-11ea-896e-fe0cb5583c71)    

 2) Now the user can reassign the issue to another assignee.  
  Trigger Words: Reassign  
  Sample Input: Reassign 37 to sghanta  
  Sample Output: Assignee has been successfully changed  
  ![usecase2 1](https://media.github.ncsu.edu/user/11865/files/8c64c600-1128-11ea-95f2-3c6375643579)

  We have also handled edge cases during this Interaction:  
  If the issue owner tries to reassign the issue to an assignee who does not exist  
   ![usecase2 2](https://media.github.ncsu.edu/user/11865/files/91297a00-1128-11ea-904c-9973cff624b6)  
  If the issue owner tries to reassign an invalid issue id  
   

### UseCase3
1) The bot will displau the list of   


## Assumptions  
Every issue should have a single assignee.  
Github username and mattermost username should be same.  


# Exploratory Testing and Code Inspection

# Bonus: Continuous Integration (CI) Server

We created a jenkins server and build job that runs a build job for our bot, including running our integration tests.

CI is ran on a hosted VM.

Our CI works based on a build running from a triggered commit, and also shows build logs of integration tests.

