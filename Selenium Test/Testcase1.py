from  selenium import webdriver
from  selenium.common.exceptions import TimeoutException
import time
import os

def UseCase1(Flow):
        time.sleep(2)
        ###
        bottomText = browser.find_element_by_id("post_textbox")
        bottomText.send_keys("display list of open issues")
        bottomText.submit()
        time.sleep(1)
        lastfield=[]
        lastfield = browser.find_elements_by_class_name("post-message__text")
        if "issues" in  (lastfield[len(lastfield)-1].text):
            print ("Successfully displaying issues")
        else:
            print("Error while displaying issues")
            exit(0)

        time.sleep(1)
        bottomText = browser.find_element_by_id("post_textbox")
        if (Flow==1):
            bottomText.send_keys("update the priority for Shreyas2")
        else:
            bottomText.send_keys("update the priority for selenium test")
        bottomText.submit()
        time.sleep(1)
        lastfield=[]
        lastfield = browser.find_elements_by_class_name("post-message__text")
        if (Flow==1):
            if "labels" in  (lastfield[len(lastfield)-1].text):
                print ("Successfully displayed list of issue attributes")
            else:
                print("Error while displaying attributes")
                exit(0)
        else:
            if "does not exist" in  (lastfield[len(lastfield)-1].text):
                print ("Issue title does not exist")
            else:
                print("Error while assigning the title")
                exit(0)
        if (Flow==1):
            time.sleep(1)
            bottomText = browser.find_element_by_id("post_textbox")
            bottomText.send_keys("change issue priority Normal to High")
            bottomText.submit()
            time.sleep(1)
            lastfield=[]
            lastfield = browser.find_elements_by_class_name("post-message__text")
            if "updated" in  (lastfield[len(lastfield)-1].text):
                print ("Successfully updated the labels")
            else:
                print("Error while updating the labels")
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
UseCase1(Flow)

Flow=0
UseCase1(Flow)

