"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      mainMenu(searchResults, people); // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
      break;
    case 'no':
      let searchType = promptFor("Would you like to search by one trait or multiple? Enter 'one' or 'multiple'", autoValid);
      if (searchType == 'one'){
        searchResults = searchByTrait(people);
        if(searchResults.length > 1){
          displayPeople(searchResults);
          break;
        }
        else{
          mainMenu(searchResults, people); // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
          break;
        }
        // TODO: search by traits
      }
      else if(searchType == 'multiple'){
        searchResults = searchByTraits(people);
        if(searchResults.length > 1){
          displayPeople(searchResults);
          break;
        }
        else{
          mainMenu(searchResults, people); // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
          break;
        }
      }
    default:
      app(people); // restart app
      break;
  }

}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }


  let displayOption = promptFor("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", autoValid);

  switch(displayOption){
    case "info":
      displayPerson(person)
    // TODO: get person's info
      break;
    case "family":
      displayFamily(person, people)
    // TODO: get person's family
    break;
    case "descendants":
    // TODO: get person's descendants
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

//nearly finished function used to search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people){
  let firstName = promptFor("What is the person's first name?", autoValid);
  let lastName = promptFor("What is the person's last name?", autoValid);

  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.firstName === firstName && potentialMatch.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.
  return foundPerson;
}

//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.
function searchByTrait(people){
  let searchCriteria = promptFor("Please type in search criteria without spaces to search by then value or 'restart' or 'quit' (example - eyecolor brown)", autoValid);
  searchCriteria = searchCriteria.split(' ');
  let searchTrait = searchCriteria[0]
  let searchValue = searchCriteria[1]

  switch(searchTrait){
    case "gender":
      let findGender = searchByGender(searchValue, people);
      return findGender;
    case "height":
      let findHeight = searchByHeight(searchValue, people);
      return findHeight;
    case "weight":
      let findWeight = searchByWeight(searchValue, people);
      return findWeight;
    case "eyecolor":
      let potentialMatches = searchByEyeColor(searchValue, people);
      return potentialMatches;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function searchByTraits(people){
  let searchCriteria = promptFor("Please type in search criteria without spaces to search by then value. Separate criteria by a semicolon (no spaces around semicolon). Can also select 'restart' or 'quit' (example - eyecolor brown;gender female)", autoValid);
  searchCriteria = searchCriteria.split(';');

  let searchPool = people;

  for(let i=0; i<searchCriteria.length; i++){
    let individualSearchCriteria = searchCriteria[i].split(' ');
    let searchTrait = individualSearchCriteria[0];
    let searchValue = individualSearchCriteria[1];

    switch(searchTrait){
      case "gender":
        let findGender = searchByGender(searchValue, searchPool);
        searchPool = findGender;
        break;
      case "height":
        let findHeight = searchByHeight(searchValue, searchPool);
        searchPool = findHeight;
        break;
      case "weight":
        let findWeight = searchByWeight(searchValue, searchPool);
        searchPool = findWeight;
        break;
      case "eyecolor":
        let potentialMatches = searchByEyeColor(searchValue, searchPool);
        searchPool = potentialMatches;
        break;
      default:
        continue;
    }
  }
  
  return searchPool;
}

function searchByGender(gender, people){
  let findGender = people.filter(function(potentialMatch){
    if(potentialMatch.gender == gender){
      return true;
    }
    else{
      return false;
    }
  })
  return findGender
}

function searchByHeight(height, people){
  let findHeight = people.filter(function(potentialMatch){
    if(potentialMatch.height == height){
      return true;
    }
    else{
      return false;
    }
  })
  return findHeight
}

function searchByWeight(weight, people){
  let findWeight = people.filter(function(potentialMatch){
    if(potentialMatch.weight == weight){
      return true;
    }
    else{
      return false;
    }
  })
  return findWeight
}

function searchByEyeColor(eyeColor, people){
  let potentialMatches = people.filter(function(potentialMatch){
    if(potentialMatch.eyeColor == eyeColor){
      return true;
    }
    else{
      return false;
    }
  })
  return potentialMatches
}

function searchBySpouse(person, people){
  if (person[0].currentSpouse == null)
    return 'Currently not married.'
  else if (person[0].currentSpouse != null){
    let findSpouse = people.filter(person[0].currentSpouse = people.id)
    return findSpouse
  }
}
//TODO: add other trait filter functions here.



//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayFamily(person, people){
  let showSpouse = searchBySpouse(person, people)
  return showSpouse
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person[0].firstName + "\n";
  personInfo += "Last Name: " + person[0].lastName + "\n";
  personInfo += "Gender: " + person[0].gender + "\n";
  personInfo += "DOB: " + person[0].dob + "\n";
  personInfo += "Height: " + person[0].height + "\n";
  personInfo += "Weight: " + person[0].weight + "\n";
  personInfo += "Eye Color: " + person[0].eyeColor + "\n";
  personInfo += "Occupation: " + person[0].occupation + "\n";
  // TODO: finish getting the rest of the information to display.
  alert(personInfo);
}

//#endregion



//Validation functions.
//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid){
  let isValid;
  do{
    var response = prompt(question).trim();
    isValid = valid(response);
  } while(response === ""  ||  isValid === false)
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input){
  if(input.toLowerCase() == "yes" || input.toLowerCase() == "no"){
    return true;
  }
  else{
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input){
  return true; // default validation only
}

//Unfinished validation function you can use for any of your custom validation callbacks.
//can be used for things like eye color validation for example.
function customValidation(input){
  if(input == 'female'){
    return true;
  }
  else if(input == 'brown' || input == 'blue'){
    return true;
  }
}

//#endregion