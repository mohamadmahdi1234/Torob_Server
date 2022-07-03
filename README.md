# Torob_Clone_Server
Internet Engineering final project server side


## pls notice
you should get .env file from us and you should download or clone last_send branch not master
Then , run the following command :

## Table Of Contents
* [Introduction](#introduction)
* [Technologies](#technologies)
* [Setup](#setup)
* [Extra](#extra)

## Introduction
This project is server side clone for marketing service site named ([torob)](https://torob.com/) <br />
This project is done by using express.js <br />
This application is for server side.Visit client side application in [link](https://github.com/soroushYousef/Torob-Clone) <br />
You can test the server side by requsting with approperiate information. This can be done by Postman or any requsting apps. <br />

- #### What does this server side application do?
This application was made for handling requests that has been sent by client side. <br />
This application has amazing features such as OTP verifying. <br />
The application use DBMS so the data is persistant!. <br />
The database that is used in this application is MongoDb. It can be used in both atlas cluster and compass (local) mode. <br />
This application is bulit for handeling client side requests. It has every feature that the client side does. It can be useful in the case of building a new client side! <br />
- #### Why does we need this application ?
Nowdays, most modern websites have 2 sides, client side and server side. Most developers knows server side as backend. <br />
For handeling requests and providing information for client side , we need to develope back-end applications.<br />
There are many frameworks that can be used to done this. In order to its simplicity and speed, we use exress.js in this app. <br />
- #### Why DBMS ? and also Why MongoDB ?
In real word, we need to store the data permanently, so wee need to use DBMS such as MongoDB. <br />
MongoDB is one of the best DBMS that can be used for storing data. It is free and also very easy and enjoyable to use ! <br />
It does not have the diffuclties and problems that relational databases such as mySQL does. So it is suggested to use MongoDB. <br />
- #### Some challanges that we had faced over developing this app
  1. Connecting to database using Atlas Clustr (because of dreaming to have nuclear weapon! :) )
  2. Test it Using Postman
  3. Implemination of OTP service

## Technologies
This project is bulit using below:
- Express.js version 4.18.1
- Nodemon version 2.0.18

## Setup
To run this project, you need to install it locally using npm <br />
First , you need to install node.js from this [link](https://nodejs.org/en/) <br />
Then , clone the code and open it with any editor:

## pls notice
you should get .env file from us and you should download or clone last_send branch not master
Then , run the following command :

```
cd ../Torob-Server-Master
npm install
npm run install-dependecis
npm start
```
the first command will change directory to the project. <br />
the second command will install all dependencies for the application. <br /> 
the second command will run the programm.

## Extra
This app will run on port 3001. If you have other programms that run on this port , You can manuallu change it from code.


