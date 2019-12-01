# Agile planning with Github Issues.  
The Bot helps identify potential assignees for any new issue being created. To do this the bot takes into consideration
the performance of each Team member and estimates based on their current workload if they would be able to complete the issue
before its milestone.

Each issue is assigned a label ( easy/medium/hard ). If an issue does not have this label then it is assumed to be an easy issue by default.
Weights for the perceived difficulty levels:  
Easy Issue-> 25  
Medium Issue-> 50  
Hard Issue-> 80  

The performance metric of each user is estimated by taking into account the issues closed by him in the last 30 days. Performance metric of each
user is the sum of weight of issues closed by him in the past 30 days divided by 30.

The workload metric of each user is the sum of, weight of each open issue already assigned to the user divided with the days left before the milestone of that issue.
This workload metric also takes into consideration the weight of new issue being created. 

Also while considering the weights, if the issue has an inprogress label then it is assumed that atleast half of the issue is completed and if the issue has a rejected label then the issue weight is 
set to zero instead of the assigned/default weight.

If performance metric is greater than workload metric then the user is added to the recomended users list. This is an indication that the user would
most probably able to close the issue before the milestone due date.   

Assumptions:  
If the milestone does not have a due date it is assumed to be 14 days by default  
If the user does not have any closed issue in the last 30 days then it is assumed he has a performance metric of 2.66 [ the minimum for each user ].  
If an issue does not have this label then it is assumed to be an easy issue by default
