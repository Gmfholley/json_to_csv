var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var DATA = path.join(__dirname, 'data.json');
var GROUPS =  path.join(__dirname, 'groups.csv');
var USER =  path.join(__dirname, 'user.csv');
var DOMAIN = path.join(__dirname, 'domain.csv');
var FAVORITES =  path.join(__dirname, 'favorites.csv');
var WATCHES =  path.join(__dirname, 'watches.csv');


  function append(fileName, fileString) {
    fs.appendFile(fileName, fileString, function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  }

  function groupProps() {
    return ["name","created","updated"];
  }
  function domainProps() {
    return ["name", "deletedWTL", "enforceFileLocks","forceTwoPhaseAuth","hideUnreadableFolders","whiteLabel","supportEmail","created","updated"];
  }
  function userProps() {
    return ["email", "enabled","passwordExpired","firstname","lastname","lastLogin","created","updated"];
  }
  function favoritesProps() {
    return ["user","duid","name","subfoldersInherit","created","udpated"];
  }
  function watchesProps() {
    return ["user","duid","name","subfoldersInherit","created","udpated"];
  }

  function stringPropValues(object, props) {
    var prop;
    var values = "";
    props.forEach(function (prop) {
        if (object.hasOwnProperty(prop)) {
            values = values + String(object[prop]) + ",";
        }
    });
    return values + "\r\n";
  }

fs.readFile(DATA, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var groups = JSON.parse(data);

     groups.forEach(function (group){
       
        append(GROUPS, stringPropValues(group, groupProps()));

        append(DOMAIN, group.name + "," + stringPropValues(group.domain, domainProps()));

        group.users.forEach(function (user) {
          append(USER, group.name + "," + stringPropValues(user, userProps()));

          user.favorites.forEach(function (favorite) {
            favoriteString = group.name + "," + user.name + "," + stringPropValues(favorite, favoritesProps());
            append(FAVORITES, favoriteString);
          });

          user.watches.forEach(function (watch) {
            watchString = group.name + "," + user.name + "," + stringPropValues(watch, watchesProps());
            append(WATCHES, watchString);
          });

        });








     });







    });