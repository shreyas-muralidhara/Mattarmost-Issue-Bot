from  selenium import webdriver
from  selenium.common.exceptions import TimeoutException
import time
import os

def UseCase2(Flow):
    #if Flow==1:
    time.sleep(30)
    lastfield=[]
    lastfield = browser.find_elements_by_class_name("post-message__text")
    if "stale" in  (lastfield[len(lastfield)-1].text):
        print ("Successfully displayed the list")
    else:
        print("There are no stale issues")
        #exit(0)

    if Flow==1:
        time.sleep(2)
        ###
        bottomText = browser.find_element_by_id("post_textbox")
        bottomText.send_keys("Reassign IssueId 2371 to Jacob")
        bottomText.submit()
        time.sleep(1)
        lastfield=[]
        lastfield = browser.find_elements_by_class_name("post-message__text")
        if "reassigned" in  (lastfield[len(lastfield)-1].text):
            print ("Successfully reassigned issue")
        else:
            print("Error while reassigning issue")
            exit(0)

browser = webdriver.Chrome('/usr/bin/chromedriver')
browser.get("http://localhost:8065/se-team/messages/@testbot")
time.sleep(2)
username = browser.find_element_by_id("loginId")
password = browser.find_element_by_id("loginPassword")
submit   = browser.find_element_by_id("loginButton")

username.send_keys(os.environ['USEREMAIL'])
password.send_keys(os.environ['USERPASS'])
submit.submit()

Flow=1
UseCase2(Flow)

Flow=0
UseCase2(Flow)

