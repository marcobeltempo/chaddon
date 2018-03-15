const db = require("../config/db.js");


/*
  var usernameCheck =
      "SELECT name FROM tbl_verified_user WHERE name='" + data + "'";
    db.query(usernameCheck, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.rowCount > 0) {
*/




exports.addUser = function(username_, password_,cb) { 
    process.nextTick(function() {

    console.log("Adding new user");

   var addUserQuery = "INSERT INTO tempUser (username,password) VALUES ('" + username_ +"','" +password_ +"')";
   db.query(addUserQuery, (err, result) => {
    if (err) {
      console.log("BIG ERROR" +err);
    }  else if(result) { 
        console.log("New User Inserted");
    } else {
        console.log("No user inserted ");
    }
});
});
}

exports.userExist = function(username_, cb) {
    process.nextTick(function() {

    console.info("USER EXIST CHECK");

  var userExistQuery = "SELECT username FROM tempUser WHERE username ='" + username_ + "'";
  
  db.query(userExistQuery, (err, result) => {
    if (err) {
      console.log(err);
    } else if(result) { 
        console.info("Returning true");
        return true;
    } else {
        return false;
    }
    });

    console.info("Returning false");


    return false
    });
}

exports.setToken =  function(username, password) { 
    var updateUserQuery = "UPDATE tempUser SET password ='" + password +"' WHERE username='" + username + "'"; 
    db.query(updateUserQuery, (err, result) => {
        if (err) {
          console.log(err);
        } else if(result) { 
            console.log("user password updated");
        }
        });

  
}


exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    var findUserByIdQuery = "SELECT * FROM tempUser WHERE id=" +id;
    db.query(findUserByIdQuery, (err, result) => {

        if (err) {
          console.log(err);
        } else if(result) { 
            console.info("Result " + result.rows[0]);
            try {
            var userObj = {id: result.rows[0].id, username: result.rows[0].username, password: result.rows[0].password }
            
            cb(null, userObj);
            }
            catch(err) {
                cb(new Error('User ' + id + ' does not exist'));

            }
        } else {
            cb(new Error('User ' + id + ' does not exist'));

        }
    });   
  });
}

exports.findByUsername = function(username_, cb) {
  
    process.nextTick(function() {

    var findUsername = "SELECT * FROM tempUser WHERE username='"  + username_ +  "'";

    db.query(findUsername, (err, result) => {

        if (err) {
          console.log(err);
        } else if(result.rowCount == 1) {
            var userObj = {id: result.rows[0].id, username: result.rows[0].username, password: result.rows[0].password }
            return cb(null, userObj);
        } else {
            console.info("Username not found");
            addUser();
            return cb(null, null);

        }
    });
  });
}
