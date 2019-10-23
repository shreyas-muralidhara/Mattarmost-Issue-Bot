from  selenium import webdriver
from  selenium.common.exceptions import TimeoutException
import time
import os

def UseCase3 (Flow):
    time.sleep(2)
    ###
    bottomText = browser.find_element_by_id("post_textbox")
    bottomText.send_keys("I have a easy issue")
    bottomText.submit()
    time.sleep(1)
    lastfield=[]
    lastfield = browser.find_elements_by_class_name("post-message__text")
    if "list" in  (lastfield[len(lastfield)-1].text):
        print ("Successfully asking user for issue attributes")
    else:
        print("Error while requesting user for issue attributes")
        exit(0)

    time.sleep(1)
    bottomText = browser.find_element_by_id("post_textbox")
    if Flow == 1:
        bottomText.send_keys("Attributes;Found a bug;I'm having a problem with this.;v1.0")
    else:
        bottomText.send_keys("Attributes;Found a bug;I'm having a problem with this.")
    bottomText.submit()
    time.sleep(1)
    lastfield=[]
    lastfield = browser.find_elements_by_class_name("post-message__text")
    if Flow==1:
        if "users" in  (lastfield[len(lastfield)-1].text):
            print ("Successfully displayed list of available users")
        else:
            print("Error while displaying user list")
            exit(0)
    else:
        if "Please" in  (lastfield[len(lastfield)-1].text):
            print ("List all the required attributes")
        else:
            print("Error while displaying user list")
            exit(0)
    if Flow==1:
        time.sleep(1)
        bottomText = browser.find_element_by_id("post_textbox")
        bottomText.send_keys("Assign issue to octocat")
        bottomText.submit()
        time.sleep(1)
        lastfield=[]
        lastfield = browser.find_elements_by_class_name("post-message__text")
        if "created" in  (lastfield[len(lastfield)-1].text):
            print ("Successfully assigned the issue")
        else:
            print("Error while assigning the issue")
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

#calling functions
Flow=1
UseCase3(Flow)
#AlternateFlow
Flow=0
UseCase3(Flow)
