# Priority ordering of Github issues based on milestones and labels.

Major challenge in issue management is prioritizing the issue and tracking the progress for those that are being worked on. Issue management 
supported by github assigns customized labels. But keeping track of issues based on multiple labels is not an easy task, once issue grows 
beyond certain count. 

Issue bot, provides a solution for issue tracking and management. Bot categorizes the issue based on 4 issue attributes - Milestone, Priority, 
Status and Issue Type. It calculates a priority score for each item, displays the score accodingly. Weights assigned for attributes are:
* Milestone - 35%
* Priority - 35%
* Status - 15%
* Issue Type - 15%

### Priority:
All issues are categorized based on priority as *Priority: High* , *Priority:Normal*, *Priority:Low*. Labels are assigned accordingly on github.
Weights are assigned for each status, this will be used to calcualte the overall score.
* Priority:High - 100%
* Priority:Normal - 70%
* Priority:Low - 30%
* Priority:Low (default) - 30%  

**Assumption**: When priority label is not assigned while creating the issue, we assume that to be **Low** priority by default. Bot indicates this 
using the default tag.  
Priorities assigned will be either of above 3 cases.

### Status:
During the life cycle managemnt of the issues, it passes through various status, befre it is finally resolved. Bot keeps a track of progress
for ongoing issues. It is later referred to decide work effort required to resolve them within milestone deadline. Bot uses a separate label 
to track status.

Initially the issue will be in *created*, later on confirming that after analysis it is moved to *confirmed* else *rejected*. Incase there is 
no sufficient inforation for working on the issue, then it is moved to *Incomplete* state. On confirmation of issue, assignee shold start 
resolving the issue, hence moved to *In-progress* state. Once the fix is complete move the issue to *Fix committed* state, for System and accpetance 
testing. If the tests are complete move it to *resolved* status. If the fix cannot be delivered in assigned milestone, the issue is *deferred*
to next sprint. Weights ofr issue status, based on work required:
* Status: Created - 100%
* Status: Confirmed - 80%
* Status: Rejected - 0%
* Status: In-progress - 60%
* Status: Incomplete - 100%
* Status: Committed - 25%
* Status: Deferred - 100%
* Status: Resolved - 0%

**Assumption**: When status is not assigned while creating the issue, we assume that to be **Created** status by default. Bot indicates this 
using the default tag.
Status for any issue should be from the above list.

### Milestone:
Milestones in agile are considerd to be 1 - 2 weeks long. Bot estimates the current status of issue and estimates the effort required to 
complete the task. Bot considers the creation date as reference, checks the status of issue for progress and performs a feasiblity check 
for milestone. So if the issue has 10 days between the creation date and milestone deadline, then bot expects 10% daily progress. If that 
is not achieved, then it automatically promotes the issue by displaying higher priority score.  
Let us consider scenario:   
![image](https://media.github.ncsu.edu/user/14762/files/893a4480-145e-11ea-9bdb-90a914d60ee0)  
Issue #49 with Normal priority has an earlier milestone than #47 and #53. Inspite of higher priorities for #47 and #53, bot performs 
feasibilty check for #49 and finds that it has had no progress in its status. Hence assigns a higher priority score, making sure that 
it is resolved before milestone.

**Assumption**: All issue on github are assigned a milestone when they are created. In case milestone is not assigned or deadline for 
milestone is unassigned, then we assume the sprint to be 2 weeks display the milestone Due - 2 weeks from current date. Bot marks this 
as milestone date as **Unassigned** or **default** while listing priorities. 

### Issue Type:
Issue can be any of the type - idea, bug, task, feature, support or invalid. We assign weights for Type based on value specified during 
creation of issue. Bot creates a label on github with **Type** as prefix. Weights of each issue type are:
* Type: Bug - 100%
* Type: Support - 80%
* Type: Task - 70%
* Type: Feature - 50%
* Type: Invalid - 0%
* Type: Idea - 30%

**Assumption**: Issue type assigned should be one among above listed types. By default issue type is assumed as an idea when type is not 
assigned.


