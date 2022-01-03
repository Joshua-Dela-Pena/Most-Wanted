"use strict"

//global variables: searchData keeps track of dynamic searches, allData is static global variable that carries all data
let searchData = [];
let allData = [];

//search functions.
/////////////////////////////////////////////////////////////////
//#region
//function to search by person name
function searchByName(people){
  //clears out old form for trait search
  if(document.forms['traitSearch']['trait'].value != ''){
    document.forms['traitSearch']['trait'].value = '';
  };

  let firstName = document.forms['nameSearch']['firstName'].value;
  let lastName = document.forms['nameSearch']['lastName'].value;

  if(nameValid(firstName) != true || nameValid(lastName) != true){
    alert('Please enter valid first and last name starting with capital letters.  Data displayed below may not be accurate due to incorrect entry of search data. For example see instructions at top of page.');
  };

  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.firstName === firstName && potentialMatch.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  });
  
  displayAllData(foundPerson, people);
  searchData = foundPerson;
  allData = people;
}

//function to search by trait(s)
function searchByTraits(people){
  //clears out old form for name search
  if(document.forms['nameSearch']['firstName'].value != ''){
    document.forms['nameSearch']['firstName'].value = '';
    document.forms['nameSearch']['lastName'].value = '';
  }

  let searchCriteria = document.forms['traitSearch']['trait'].value

  if(traitValidate(searchCriteria) != true){
    alert('Please enter valid trait search criteria. Data displayed below may not be accurate due to incorrect entry of search data. For example see instructions at top of page.')
  }

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
  searchData = searchPool;
  allData = people;
}

//individual search by trait functions
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

//#endregion

//Display functions.
/////////////////////////////////////////////////////////////////
//#region 

// displays table with matching people
function displayAllData(selectedPeople){
  let peopleTable = document.getElementById('matchedPeopleInfo');
  if (peopleTable.innerHTML != "") {
    clearTable();
  }

  for(let i=0;i<selectedPeople.length;i++){
    let familyString = i + "family";
    let descendantString = i + "descendants";

    peopleTable.innerHTML += `<tr>
    <td class="center-text">${i}</td>
    <td class="center-text">${selectedPeople[i].firstName}</td>
    <td class="center-text">${selectedPeople[i].lastName}</td>
    <td class="center-text">${selectedPeople[i].gender}</td>
    <td class="center-text">${selectedPeople[i].dob}</td>
    <td class="center-text">${selectedPeople[i].height}</td>
    <td class="center-text">${selectedPeople[i].weight}</td>
    <td class="center-text">${selectedPeople[i].eyeColor}</td>
    <td class="center-text">${selectedPeople[i].occupation}</td>
    <td class="center-text"><button id=${familyString}>Display Family</button></td>
    <td class="center-text"><button id=${descendantString}>Display Descendants</button></td>
    </tr>`
  }
  
}

//adds event listeners for each display family and display descendants button
document.body.addEventListener('click',(element) => {
  console.log(element.target.id);
  if(element.target.id.includes('family')){
    let familyIndex = element.target.id.charAt(0);
    displayFamily(searchData[familyIndex], allData)
  }

  else if(element.target.id.includes('descendants')){
    let descendantsIndex = element.target.id.charAt(0);
    displayDescendants(searchData[descendantsIndex], allData)
  }
})

//clears table
function clearTable(){
  let peopleTable = document.getElementById('matchedPeopleInfo');
  peopleTable.innerHTML = ''
}

//display functions for family and descendants
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

//#endregion

//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input){
  return true; // default validation only
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