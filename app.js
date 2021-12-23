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
      searchResults = searchByTraits(people);
      if(searchResults.length > 1){
        displayPeople(searchResults, people);
        break;
      }
      else{
        mainMenu(searchResults, people); // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
        break;
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
      displayDescendants(person, people)
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

function searchByTraits(people){
  let searchCriteria = promptFor("Please type in search criteria without spaces then value. \nSeparate multiple criteria by a semicolon (no spaces around semicolon). \nCan also select 'restart' or 'quit'.\n(example one criteria - eyecolor brown)\n(example multiple criteria - eyecolor brown;gender female)", autoValid);
  searchCriteria = searchCriteria.split(';');

  let searchPool = people;

  for(let i=0; i<searchCriteria.length; i++){
    let individualSearchCriteria = searchCriteria[i].split(' ');
    let searchTrait = individualSearchCriteria[0];
    let searchValue = individualSearchCriteria[1];

    switch(searchTrait){
      case "gender":
        let potentialMatchesGender = searchByGender(searchValue, searchPool);
        searchPool = potentialMatchesGender;
        break;
      case "height":
        let potentialMatchesHeight = searchByHeight(searchValue, searchPool);
        searchPool = potentialMatchesHeight;
        break;
      case "weight":
        let potentialMatchesWeight = searchByWeight(searchValue, searchPool);
        searchPool = potentialMatchesWeight;
        break;
      case "eyecolor":
        let potentialMatchesEyeColor = searchByEyeColor(searchValue, searchPool);
        searchPool = potentialMatchesEyeColor;
        break;
      default:
        continue;
    }
  }
  
  return searchPool;
}

function searchByGender(gender, people){
  let potentialMatches = people.filter(function(potentialMatch){
    if(potentialMatch.gender == gender){
      return true;
    }
    else{
      return false;
    }
  })
  return potentialMatches;
}

function searchByHeight(height, people){
  let potentialMatches = people.filter(function(potentialMatch){
    if(potentialMatch.height == height){
      return true;
    }
    else{
      return false;
    }
  })
  return potentialMatches;
}

function searchByWeight(weight, people){
  let potentialMatches = people.filter(function(potentialMatch){
    if(potentialMatch.weight == weight){
      return true;
    }
    else{
      return false;
    }
  })
  return potentialMatches;
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
  return potentialMatches;
}

function searchBySpouse(person, people){
  if (person[0].currentSpouse == null){
    alert('Currently not married.') 
      }
  else if (person[0].currentSpouse != null){
    let findSpouse = people.filter(function(potentialMatch){
      if(potentialMatch.id == person[0].currentSpouse){
        return true;
      }
      else{
        return false;
      }
    })
    return findSpouse
  }
}

function searchDescendantOf(person, people){
  if (person[0].parents == []){
    return 'No parents in system'
  }
  else if(person[0].parents != []){
    let findParents = people.filter(function(potentialMatch){
      if (person[0].parents.includes(potentialMatch.id)){
        return true;
      }
      else{
        return false;
      }
    })
    return findParents
  }
}

function searchDescendantsRecursion(person, people, generation=null){
  let generations = people.filter(function(potentialMatch){
    if (potentialMatch.parents.includes(person.id)){
      return true;
    }
    else{
      return false;
    }
  })
  
  let allGenerations;
  if(generation == null && generations.length > 0){
    allGenerations = generations
  }
  else if (generation != null && generations.length == 0){
    allGenerations = generation
  }
  else if(generation!= null && generations.length >0){
    allGenerations = generations.concat(generation)
  }

  for(let i=0; i<generations.length; i++){
    allGenerations = searchDescendantsRecursion(generations[i], people, allGenerations);

  }

  return allGenerations
    }
  

function searchForSiblings(person, people){
  let searchedPerson = person[0]
  let parents = searchDescendantOf(person, people)
  let siblings;
  if (parents.length > 0){
  if (parents.length === 2){
    let parent1 = parents[0];
    let parent2 = parents[1];
    siblings = people.filter(function(potentialMatch){
      if ((potentialMatch.parents.includes(parent1.id) || potentialMatch.parents.includes(parent2.id)) && searchedPerson.id != potentialMatch.id){
        return true
      }
      else {
        return false
      }
    })
  }
  if (parents.length === 1){
    let parent1 = parents[0];
    siblings = people.filter(function(potentialMatch){
      if ((potentialMatch.parents.includes(parent1.id) && searchedPerson.id != potentialMatch.id)){
        return true
      }
      else {
        return false
      }
    })
  }
  if (searchedPerson.length > 0){
    siblings = people.filter(function(potentialMatch){
      if (potentialMatch.parents.includes(parents.id) == searchedPerson.parents){
        return siblings 
          }
      else {
        return false
    }
  })
  }
  if (siblings.length >= 1){
    return siblings 
  }
  else {
    return siblings = 'No Siblings'
  }
}
else {
  return siblings = 'No Siblings'
}
}
//TODO: add other trait filter functions here.



//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
function displayPeople(potentialMatches, people){
  let potentialMatchesList = potentialMatches.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n");

  let continueApp = confirm(`The search returned multiple matches. Here are the potential matches:\n${potentialMatchesList}\n\nSelect 'OK' to start new search or 'Cancel' to exit app.`);
  
  if (continueApp == true){
    app(people); //restarts app
  }
  else{
    return; //stop execution
  }
}

function displayDescendants(person, people){
 let childrenMatches = searchDescendantsRecursion(person[0], people);
 let childrenMatchesString = childrenMatches.map(function(person){
   return 'Descendants: ' + person.firstName + ' ' + person.lastName
 })
    alert(childrenMatchesString)
}
  

function displayFamily(person, people){
  let showSpouseString = ' '
  let showSpouse = searchBySpouse(person, people);
  if(showSpouse != undefined){
    showSpouseString = showSpouse.map(function(person){
    return 'Spouse: ' + person.firstName + ' ' + person.lastName;
  }).join("\n")}
  else{
    ;
  }
  let isDescendant = searchDescendantOf(person, people);
  let isDescendantString = isDescendant.map(function(person){
    return 'Parent: ' + person.firstName + ' ' + person.lastName
  }).join("\n");

  let isASibling = searchForSiblings(person, people);
  if(isASibling == 'No Siblings'){
    alert('No siblings')
  }
  else if(isASibling.length > 0){
    let isASiblingString = giveName(isASibling)
  let family = `${showSpouseString}\n${isDescendantString}\n${isASiblingString}`
  alert(family)
  }

  

}  
function giveName(names) {

  let namesCompleted = (names.map(function(names){
    return 'Sibling(s): ' + names.firstName + " " + names.lastName;
  }).join('\n'))
return namesCompleted 
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