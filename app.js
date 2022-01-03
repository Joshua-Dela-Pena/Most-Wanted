"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people){
  let searchType = document.forms['startSearch']['searchType']
  // promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType.value){
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


  let displayOption = promptFor("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", mainMenuValidation).toLowerCase();

  switch(displayOption){
    case "info":
      displayPerson(person, people)
      break;
    case "family":
      displayFamily(person, people)
    break;
    case "descendants":
      displayDescendants(person, people)
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
  //clears out old form
  if(document.forms['traitSearch']['trait'].value != ''){
    document.forms['traitSearch']['trait'].value = '';
  }

  let firstName = document.forms['nameSearch']['firstName'].value
  //promptFor("What is the person's first name?", nameValid);
  let lastName = document.forms['nameSearch']['lastName'].value
  //promptFor("What is the person's last name?", nameValid);

  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.firstName === firstName && potentialMatch.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  
  displayAllData(foundPerson, people);
  // preventReload();
  //return foundPerson;
}

function searchByTraits(people){
  //clears out old form
  if(document.forms['nameSearch']['firstName'].value != ''){
    document.forms['nameSearch']['firstName'].value = '';
    document.forms['nameSearch']['lastName'].value = '';
  }

  let searchCriteria = document.forms['traitSearch']['trait'].value
  // promptFor("Please type in search criteria without spaces then value. \n'Separate multiple criteria by a semicolon (no spaces around semicolon). \nCan also select 'restart' or 'quit'.\n(example one criteria - eyecolor brown)\n(example multiple criteria - eyecolor brown;gender female)", traitValidate).toLowerCase();
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
  
  displayAllData(searchPool, people);
  //return searchPool;
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
  if (person.currentSpouse == null){
    return null;
      }
  else if (person.currentSpouse != null){
    let findSpouse = people.filter(function(potentialMatch){
      if(potentialMatch.id == person.currentSpouse){
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
  if (person.parents.length == 0){
    return null;
  }
  else if(person.parents.length > 0){
    let findParents = people.filter(function(potentialMatch){
      if (person.parents.includes(potentialMatch.id)){
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
  let searchedPerson = person
  let parents = person.parents
  let siblings;
  if (parents.length > 0){
  if (parents.length === 2){
    let parent1 = parents[0];
    let parent2 = parents[1];
    siblings = people.filter(function(potentialMatch){
      if ((potentialMatch.parents.includes(parent1) || potentialMatch.parents.includes(parent2)) && searchedPerson.id != potentialMatch.id){
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
      if ((potentialMatch.parents.includes(parent1) && searchedPerson.id != potentialMatch.id)){
        return true
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
function displayAllData(selectedPeople, people){
  let peopleTable = document.getElementById('matchedPeopleInfo');
  if (peopleTable.innerHTML != "") {
    clearTable();
  }

  for(let i=0;i<selectedPeople.length;i++){
    let familyString = "family" + i;

    peopleTable.innerHTML += `<tr>
    <td>${selectedPeople[i].firstName}</td>
    <td>${selectedPeople[i].lastName}</td>
    <td>${selectedPeople[i].gender}</td>
    <td>${selectedPeople[i].dob}</td>
    <td>${selectedPeople[i].height}</td>
    <td>${selectedPeople[i].weight}</td>
    <td>${selectedPeople[i].eyeColor}</td>
    <td>${selectedPeople[i].occupation}</td>
    <td><button id="family">Display Family</button></td>
    <td><button id="descendants">Display Descendants</button></td>
    </tr>`

    document.getElementById("family").onclick = function () {displayFamily(selectedPeople[i], people)};
    document.getElementById("descendants").onclick = function () {displayDescendants(selectedPeople[i], people)};

   // displayFamily(selectedPeople[i], people);

 
  }
}

function clearTable(){
  let peopleTable = document.getElementById('matchedPeopleInfo');
  peopleTable.innerHTML = '<tr> <td></td><td></td> <tr>'
}


// function displayPeople(potentialMatches, people){
//   let potentialMatchesList = potentialMatches.map(function(person){
//     return person.firstName + " " + person.lastName;
//   }).join("\n");

//   let continueApp = confirm(`The search returned multiple matches. Here are the potential matches:\n${potentialMatchesList}\n\nSelect 'OK' to start new search or 'Cancel' to exit app.`);
  
//   if (continueApp == true){
//     app(people); //restarts app
//   }
//   else{
//     return; //stop execution
//   }
// }

function displayDescendants(person, people){
 let descendants = searchDescendantsRecursion(person, people);
 let showDescendantsString = '';
 if(descendants == undefined){
    showDescendantsString = 'No descendants in system.'
 }
 else if(descendants.length >0){
   descendants = getName(descendants);
   showDescendantsString = '\n' + descendants +'\n';
 }
  
 alert(`Descendants of ${person.firstName} ${person.lastName}:\n${showDescendantsString}`);

}
  

function displayFamily(person, people){
  let family = '';
  let spouse = searchBySpouse(person, people);
  if(spouse != null){
    spouse = getName(spouse);
    let showSpouseString = 'Spouse:\n' + spouse + '\n';
    family += showSpouseString + '\n';
  }
  else{
    family += 'No spouse in system.\n'
  }

  let parents = searchDescendantOf(person, people);
  if (parents != null){
    parents = getName(parents);
    let showParentsString = 'Parents:\n' + parents + '\n';
    family += showParentsString + '\n';
  }
  else{
    family += 'No parents in system.\n'
  }

  let siblings = searchForSiblings(person, people);
  if(siblings != 'No Siblings'){
    siblings = getName(siblings);
    let showSiblingsString = 'Siblings:\n' + siblings + '\n';
    family += showSiblingsString + '\n';
  }
  else{
    family += 'No siblings in system.'
  }

  let alertFamily = `${person.firstName} ${person.lastName} Family:\n\n${family}`;
  alert(alertFamily);
  }

 
function getName(names) {
  let namesCompleted = (names.map(function(name){
    return name.firstName + " " + name.lastName;
  }).join('\n'))
return namesCompleted 
}

function displayPerson(person, people){
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
  let continueApp = confirm(`${personInfo}\n\nSelect 'OK' to go back to person or 'Cancel' to start a new search.`);
  if (continueApp == true){
    mainMenu(person, people); //stop execution
  }
  else{
    app(people); //restarts app
  }
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
function mainMenuValidation(input){
  if(input.toLowerCase() == 'info' || input.toLowerCase() == 'family' || input.toLowerCase() == 'descendants' || input.toLowerCase() == 'restart' || input.toLowerCase() == 'quit'){
    return true;
  }
  else {
    return false;
  }
}

function nameValid(input){
  if(input.charAt(0) == input.charAt(0).toUpperCase()){
    return true;
  }
  else{
    return false;
  }
}

function traitValidate(input){
  if(input.includes(' ;') || input.includes('; ') ){
    return false;
  }

  else if(input.toLowerCase() == 'restart' || input.toLowerCase() == 'quit'){
    return true;
  }

  else{
    input = input.split(';');
    for(let i=0; i<input.length; i++){
      if(input[i].includes('eyecolor ') || input[i].includes('height ') || input[i].includes('weight ') || input[i].includes('gender ')){
         if(input[i].includes('eyecolor ')){
           if(input[i].includes('brown') || input[i].includes('black') || input[i].includes('hazel') || input[i].includes('blue') || input[i].includes('green')){
             continue;
           }
           else{
             return false;
           }
         }
         else if(input[i].includes('gender ')){
           if(input[i].includes('male') || input[i].includes('female')){
             continue;
           }
           else{
             return false;
           }
         }
         else if(input[i].includes('height ')){
           let height = input[i].match(/(\d+)/);
           if(50 < height && height <80){
             continue;
           }
           else{
             return false;
           }
         }
         else if(input[i].includes('weight ')){
          let weight = input[i].match(/(\d+)/);
          if(60 < weight && weight <500){
            continue;
          }
          else{
            return false;
          }
        }
      }

      else{
        return false;
    }
    }
    return true;
    }
  }


//#endregion