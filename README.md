# Book e-commerce
The software system being produced is called Book E-Commerce System. It is application that allows customers to buy books online. This system is designed to "provide automation support" to the manager for the process of reordering new books and notifying users about their purchases and new promotions via personal email. 

## technologies
In this MERN stack application the **frontend** is developed in HTML5, CSS3 and React.js Material UI library. **backend** is created in Express and Node.js. I have used **nodemailer** to send emails.  
**Data** is stored in MongoDB Atlas.

## description and features
The Book E-Commerce System will provide a number of functions. It will: 
- Allow any customer to become a member. 
- Allow customers and managers to log in and out of the system.
- Maintain data associated with the inventory (a collection of books)  
- Maintain records for many customers 
- Shopping cart Anyone is able to add one or more books to the shopping cart.  
- Checkout 
- Notify manager when books need to be reordered via email.
- Notify users on successfull purchases via email.
- Notify users about new promotions via email.
- Allow manager to update stock quantities. 
- Allow manager to create promotions .A promotion is a percentage discount that can be applied to an entire order.   
- When promotion is created it will be automaticly sent to all users.


## starting and using the application

#### backend

After cloning repository and opening it, in terminal type command `cd server` and add your own .env file with following variables: 
- **PORT** use 5000,  
- **MONGO_URI** if not provided local database will be used 
- **JWT_SECRET** 
- **ADMIN_EMAIL** this is the email on which you as admin will recieve restock notifications. Use your own mail.
- After that run `npm install` to install all the dependencies. This application requires data to be seeded before initial run. For that you should type `npm run seed` command while still inside server folder. After completing all these steps run `npm start` script. 

That runs the server part of application in the development mode on http://localhost:5000.

#### frontend

After you are done with backend part of application in terminal type command `cd client` and run `npm install` script to install all the dependencies. After successfull instalataion run `npm start`. 

That runs the frontend part of application in the development mode.

Open http://localhost:3000 to view it in the browser. Homepage will be open on which you can add items to cart but for everything else you will need to be logged in as user or admin. You can create your own user accounts and you should **use your own email** to make sure you recieve all notifications. To login as admin please use following credentials: 

- **username**: admin
- **password**: adminadmin




