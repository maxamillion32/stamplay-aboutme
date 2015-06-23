stamplay-aboutme
===================

**This project is built on the [Stamplay](https://stamplay.com) platform and [BackboneJS](http://backbonejs.org) to show how to build your own [About.me](http://about.me) in super short time.**

You can test it anytime simply creating a new project on Stamplay and uploading all the frontend assets with our client or our browser based code editor. 

Feel free to implement more cool features (see the last paragraph for ideas), contribute to this repo or clone it to use it by your own scopes. For any question drop an email to [support@stamplay.com](mailto:support@stamplay.com)

-----------------------
## About.me clone

This is a demo of what you can achieve with [Stamplay](https://stamplay.com).

It's somewhat a clone of [About.me](http://about.me). [View demo](https://aboutme.stamplayapp.com/)

Currently, in order to show how to leverage Stamplay APIs and keep it simple we used [BackboneJS](http://backbonejs.org) to implement the client side logic. The clone with let our users to:

* Login with Facebook
* Configure the personal page
* Compliment pages of other users
* Let visitors of connect with the owner of the about.me page via email

Best of all, we used BackboneJS and Grunt to compile the assets. Prepare to be amazed.

-----------------------
# Anatomy

HNclone is built around the following apis (components) of Stamplay

* [Users](https://stamplay.com/docs/rest-api#user)
* [Custom Objects](https://stamplay.com/docs/rest-api#custom-object-api)
* [Email](https://stamplay.com/docs/rest-api#email)

## Requirements

Go to [your account](http://editor.stamplay.com/apps) and create a new app.

Other required services :

* A [Facebook App](http://developers.facebook.com/apps) to setup Facebook Login auth


## Configuring the components

After creating a new app on [Stamplay](https://editor.stamplay.com) let's start by picking the component we want to use in our app that are: **User**, **Email**, **Custom Objects**.

Lets see one-by-one how they are configured:

### User
The app leverages Facebook Login to provide an easy login to its users. In order to activate yours you need to get an APPID and APPSecret on [Facebook Developer's portal](http://developers.facebook.com/apps), create an app and add Stamplay.com as authorized domain as you can see in the pic below. 

![Facebook app settings](https://blog.stamplay.com/wp-content/uploads/2014/07/Schermata-2014-07-22-alle-17.43.24.png "Facebook app settings")

Now you have the data to configure Facebook Login on your app's user module. Go back on Stamplay, select the user component, add Facebook as signup service and then cut and paste the App ID and App Secret and click save.

### Custom Object

#### aboutpage

For our About.me clone we use this module to represent the **AboutPage** that users can create and then share. The **AboutPage** object will contain all the informations so here we need to model those as attributes:

* Name: `bg`, Type: `file`, The background image of the page
* Name: `biopic`, Type: `file`, The avatar image of the page
* Name: `name`, Type: `string`, The title of the page
* Name: `headline`, Type: `string`, User's favorite quote
* Name: `biography`, Type: `string`, Text describing user's bio
* Name: `locations`, Type: `array_string`, A list of user's locations
* Name: `bg_color1`, Type: `string`, The first RGB color for the layout
* Name: `bg_color2`, Type: `string`, The second RGB color for the layout
* Name: `header_color`, Type: `string`, The header RGB color for the layout
* Name: `interests`, Type: `array_string`, A list of user's interests
* Name: `hobbies`, Type: `array_string`, A list of user's hobbies
* Name: `education`, Type: `array_string`, A list of user's educatin activities
* Name: `user`, Type: `user relation`, The reference to the owner of this page
* Name: `birthplace`, Type: `string`, The birthplace
* Name: `email`, Type: `string`, The email on which our user can be reached out 
* Name: `profileId`, Type: `string`, The id of the profile, unique value

After setting up this Stamplay will instantly expose Restful APIs for our newly created AboutPage resource on the following endpoint `https://APPID.stamplayapp.com/api/cobject/v0/aboutpage`

### contactform

To represent a form we are going to create a ```contactform``` object so that visitors will be able to write to the owner of the page without knowing the email address.

* Name: `email`, Type: `string`, The sender's email address
* Name: `name`, Type: `string`, The sender's email name
* Name: `message`, Type: `string`, The message
* Name: `to`, Type: `string`, User's favorite quote


![Form settings](https://blog.stamplay.com/wp-content/uploads/2014/08/Schermata-2014-08-04-alle-12.14.54.png)


### Email
This component doesn't need any setup, couldn't be easier than that ;)

-----------------------


## Creating the server side logic with Tasks

Now let's add the tasks that will define the server side of our app. For our app we want that:

### On contact form submit, send an email to the page owner 

Trigger : Form - On Submit

Action: Email - Send Email

**Form submit configuration**

	Form: contact form

**Send Email configuration**

	to: {{coinstance.to}} //The recipient address taken from the form entry 
	from: {{coinstance.email}} //Will be replaced with logged user's email
	name: {{coinstance.name}} //The sender's name taken from the form entry 
	Subject: "New contact from your AboutPage!"
	Body: {{coinstance.message}} //The sender's message taken from the form entry

### When a user creates his AboutPage, share on his Facebook Timeline

Trigger : Custom Object - On Create

Action: Facebook Post - Send Email


**Custom Object submit configuration**

	Form: contact aboutpage

**Facebook Post configuration**

	message: "Come to see my new About Page :)"
	picture: {{coinstance.bg}}
	link: https://APPID.stamplayapp.com/profile/?of={{coinstance.profileId}}
	name: {{coinstance.name}}
	caption: {{coinstance.headline}}
	description: See how easy has been to clone About.me with Stamplay

### When a user receive a compliment on his AboutPage, send him an email

Trigger : Custom Object - On Vote

Action: Email - Send Email

**Custom Object submit configuration**

	Form: contact aboutpage

**Send Email configuration**

	to: {{coinstance.email}} //The email field taken from the aboutpage resource
	from: {{user.email}} //Will be replaced with logged user's email
	name: "Stamplay About.me" 
	Subject: "{{user.displayName}} just voted your profile!"
	Body: {{user.displayName}} just voted your profile! 



_______________________________


## The frontend and BackboneJS


### Models
`User.js`: just an empty skeleton  to mirror the server side model since we do not need it to do any specific job.

`CObj.js`: this model reflects the **AboutPage** object we created with the editor. Has some setters for default attributes, the attribute `isNew` is setted after the first sign up.


### Views


##### /index
This is the home page of the service and it only uses a bit of Bootstrap and jQuery to check via the `getUserStatus` method if the user is logged and eventually redirect him to the edit page

##### /profile

use the User model while logged and user's about page custom object representation. Interactions in this view are handled by `edit/MainView.js`

##### /profile?id=profileId

this is rendered by the view `profile/MainView.js`, it loads the profile leveraging the `profileId` added in the query string like this `/profile?of=giulianoiacobelli`

This view is in charge for parsing the `profileid` to dynamically load the desired AboutPage. The Custom Object instance of the loaded profile is passed as a model to the view along with the logged user representation. 

Inside the `render()` function a method is triggered that initialize all UI effects. 
This View contains also the logic to submit the contact form and to compliment an AboutPage.


### Router

When router starts it checks if the user is logged and eventually stores it in `this.user`
The router's root is `/profile` and routes for this view are:
    
    ?*queryString
	'': editProfile

The former matches everything is written in the querystring to display the profile, the latter is used to edit the profile
	

### Building the frontend


Stamplay hosts the client side of applications with an open folder structure. For minifying the assets we used [Grunt](http://gruntjs.com).

To build the app you need to have NPM and Bower installed and then run those two commands:

	npm install && bower install
	grunt build


The minified js and css will be placed in the `dist` folder. 


-----------------------
# Cloning

First, clone this repository :

    git clone git@github.com:Stamplay/stamplay-aboutme.git
    
Or download it as a zip file
	
	https://github.com/Stamplay/stamplay-aboutme/archive/master.zip 

Then you need to upload the frontend files in your app by using the [CLI tool](https://github.com/Stamplay/stamplay-cli):

```js
cd your/path/to/stamplay-hackenews
stamplay init
/*
 * You will need to insert your appId and your API key
 */
stamplay deploy
```

-----------------------
# Next steps

Here are a few ideas for further improvement :

* Add the "users who complimented you" as About.me does
* _Your idea here… ?_

Again, for any questions drop an email to [giuliano.iacobelli@stamplay.com](mailto:giuliano.iacobelli@stamplay.com) :)

Ciao!
