# isit320-quickLiquor
ISIT320 Advanced Web Application Development Course Project - 5 Guys | Quick Liquor




IMPORTANT: To build this project you must temporarily hardcode the user name and password in fn.php. This is clearly not ideal and will be fixed, the project is still set up to use the config file in the pages directory but at the time I'm writing this I think one of the MySQL version updates caused the PDO connection string to throw an access error. The machine I originally wrote this on works using the config file but every other new installation has produced this error. Until I find out why, hardcoding the user name and password for testing should suffice. In fn.php, the line : $this->pdo = new PDO($conStr, $user, $pass); needs to be replaced with $this->pdo = new PDO($conStr, your user name, your mysql user password);

  
  
  
  

If you want to build this:put your db credentials in pages/config. sql/db.txt should put the initial database togethor with values, views and procs.

Something to note about the database: The db uses the product names as the primary key. The reason doing this makes sense for this project is because per Washington State law, only one distributer can be licensed to sell each alcoholic product. For example, Grey Goose vodka can only be purchased from Southern and similarly, Jack Daniels can only be purchased from Youngs. Southern cannot distribute Jack Daniels as Youngs cannot distribute Grey Goose.

fn.php handles all database operations on each page based on the function that gets triggered the "purpose" object's value from app.js. app.js uses AJAX to send the value of "purpose" to fn.php. At the bottom of fn.php, there are conditional if/then statements that triggers whatever function is associated with the value of "purpose". For example, if the user clicks on the distributer on the right of the home count page to display that distributor's order, the value of "purpose" in app.js is set and posts that value to fn.php. fn.php then runs through those conditional statements and fires off the function that matches that purpose number. This is how the majority of the code works, a js function is ran which triggers its matching php function witch triggers its matching sql view then is displayed on whatever html page holds the event listener.
