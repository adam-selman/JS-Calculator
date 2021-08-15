// Author: Adam Selman
// contact: adamselman212@gmail.com

var decimalUsed = false; // used to track if a deciaml has been used for the current number being inputted
var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]; // valid numbers
var symbols = ["+", "-", "*", "/"];  // array of all operators
var parenthesis = ["(", ")"];


let calcText = document.querySelectorAll(".calcText");
let calcTextMobile = document.querySelectorAll(".calcTextMobile");

let errorMessageBox = document.querySelectorAll(".errorMessageBox");
errorMessageBox = errorMessageBox[0];

let errorMessageBoxMobile = document.querySelectorAll(".errorMessageBoxMobile");
errorMessageBoxMobile = errorMessageBoxMobile[0];

let errorMessage = "";


const calcButtons = document.querySelectorAll(".calcButton");
const equalsButton = document.querySelectorAll(".equalsButton");  
const resetButton = document.querySelectorAll(".resetButton");

for (i = 0; i < equalsButton.length; i++)  // for every "equalsButton" classed element found
{
    equalsButton[i].addEventListener("click", calculateResult);
    resetButton[i].addEventListener("click", resetCalc);
}

for (i = 0; i < calcButtons.length; i++)
{  // adding event for number and operator uses
    let currentButton = calcButtons[i];

    currentButton.addEventListener("click", onButtonClick);
}

// ---------------------------------------------------------------------------------------------------------------
function onButtonClick(e)
{  // event for when a button is pressed

    resetErrorMessage(); // reset error message when a new button is pressed


    for(i = 0; i < calcText.length; i++)
    {
        let calcTextValue = calcText[i].innerText;
        // console.log(`previous calcTextValue: ${calcTextValue}`); // debug

        if (calcTextValue[0] === "="){  // resets calc for new calculation
            calcTextValue = "";
        }

        const newCharValue = e.target.value; // the character clicked

        // console.log("last char in string: " + calcTextValue.slice(-1)) // debug
        const newTextValue = calcTextValue + e.target.value;


        if (symbols.indexOf(newCharValue) !== -1) // if the current char is an operator
        {

            if(symbols.indexOf(calcTextValue.slice(-1)) !== -1) // if the last char is an operator already
            {
                errorMessage = "Cannot have two adjacent symbols";
                setErrorMessage(errorMessage);
                break;
            }

            else if (newCharValue === "-") // negative numbers can start with a "-"
            {
                setCalcTextValue(newTextValue);
                break;
            }

            else if (calcTextValue.slice(-1) === ")") // if last char is a bracket
            {
                setCalcTextValue(newTextValue);
                break;
            }

            else if(numbers.indexOf(calcTextValue.slice(-1)) === -1) // if the last char is not a number
            {
                errorMessage = "Symbols must follow a number";
                setErrorMessage(errorMessage);

                break;
            }

            decimalUsed = false; // new number is after an operator so can have another deciaml
        }


        else if (newCharValue === "(") // if the current char is a bracket
        {
            if(calcTextValue.slice(-1) === ")") // if the last char is a bracket already
            {
                console.log("Numbers needed between bracket pairs");
                break;
            }

            decimalUsed = false; // new number is after a bracket so new deciaml can be used
        }


        else if (newCharValue === ")")
        {
            if(numbers.indexOf(calcTextValue.slice(-1)) === -1) // if the last char is not a number
            {
                errorMessage = "Number or needed before closing bracket";
                setErrorMessage(errorMessage);
                break;
            }

            decimalUsed = false; // new number is after a bracket so new deciaml can be used
        }

        else if (newCharValue === ".") // if the new char is a decimal point
        {   
            if (decimalUsed)
            {
                errorMessage = "Cannot have more than 1 deciaml point per number";
                
                setErrorMessage(errorMessage);
                break;
            }

            else if (symbols.indexOf(calcText[0].innerText.slice(-1)) !== -1) // deciamal can't follow an operator
            {
                console.log(symbols.indexOf(calcText[0].innerText.slice(-1))); // if the character before last is an operator - debug
                console.log(calcText[0].innerText.slice(-1)); // debug 
                errorMessage = "Decimals can't follow operators";
            
                setErrorMessage(errorMessage);
                break;
            }

            else
            {
                decimalUsed = true;
            }
        }

        console.log(`"${e.target.value}" clicked`);  // debug
        
        setCalcTextValue(newTextValue);
        
    }
}

// ---------------------------------------------------------------------------------------------------------------
function resetCalc(e)  // resetting the calculator screen to blank
{
    for(i = 0; i < calcText.length; i++)
    {
        console.log(calcText[i].innerText);
        
        calcText[i].innerText = "";
        calcTextMobile[0].innerText = "";
        console.log('calcText reset');
    }
    console.clear(); // clean console for each calculation
}


function setErrorMessage(errorMessage)
{
    let errorMessageBox = document.querySelectorAll(".errorMessageBox");
    errorMessageBox = errorMessageBox[0];

    let errorMessageBoxMobile = document.querySelectorAll(".errorMessageBoxMobile");
    errorMessageBoxMobile = errorMessageBoxMobile[0];

    console.log(errorMessage);

    errorMessageBox.innerText = errorMessage;
    errorMessageBoxMobile.innerText = errorMessage; 
    
    return "Error Message Set";
}
function resetErrorMessage()
{
    let errorMessageBox = document.querySelectorAll(".errorMessageBox");
    errorMessageBox = errorMessageBox[0];

    let errorMessageBoxMobile = document.querySelectorAll(".errorMessageBoxMobile");
    errorMessageBoxMobile = errorMessageBoxMobile[0];

    errorMessageBox.innerText = "";
    errorMessageBoxMobile.innerText = ""; // resetting error message

    return "Error message boxes reset";
}

function setCalcTextValue(newTextValue)
{
    calcText[0].innerText = newTextValue;
    calcTextMobile[0].innerText = newTextValue;

    return "calcText value has been changed";
}

// ---------------------------------------------------------------------------------------------------------------
function parseCalcString(string)  // splits the calculation into individual components
{
    console.log(`Current calcText: ${string}`); // debug

    if (symbols.indexOf(string.slice(-1)) !== -1)  // if there is a trailing symbol remove it
    {
        string = string.slice(0,-1);
    }

    const strings = []; // storing sections of the calcuation
    let currentString = "";

    for (i=0; i < string.length; i++){ // loop through the whole string
        let currentChar = string[i]; 

        // console.log(`Current char ${currentChar}`); // debug


        if (symbols.indexOf(currentChar) !== -1) // if the current char is an operator
        { 
            console.log("Operator Found"); // debug   
            currentString = parseFloat(currentString);  // convert to number
            
            strings.push(currentString); // add the number before the operator to array
            // console.log(`${currentString} added to strings`); // debug
            

            strings.push(currentChar); // add operator to array after the number

            
            currentString = ""; // reset string
        }
        



        else if (parenthesis.indexOf(currentChar) !== -1) // if the current char is a bracket
        { 
            
            let currentBracket = "";
            let j = i + 1; // j continues from where i was until a closing bracket is found

            if (currentChar == "(")
            {
                console.log("Opening Bracket Found"); // debug  
                console.log("Entering Bracket string loop"); // debug
                while (true)
                {
                    currentBracket = currentBracket + string[j];
                    j++;

                    // console.log(`CurrentBracket: ${currentBracket}`); // debug

                    if (string[j] == ")") // break once the end of the expression is found
                    {
                        break;
                    }

                    else if (j > 100) // max limit 
                    {
                        break;
                    }
                    
                }
                console.log("exiting Bracket string loop"); // debug
                

                console.log("-- Calculating bracket result --");
                let bracketEvaulation = calculateResult(currentBracket, "no");  // calculate result for equation in brackets

                console.log(` bracketEvaluation Result: ${bracketEvaulation}`); // debug

                preBracket = string.slice(0,i - 1);  // get what was before the bracket
                console.log(`preBracket: ${preBracket}`); // debug

                postBracket = string.slice(j + 1, j + 2); // get what was after the bracket
                console.log(`postBracket: ${postBracket}`); // debug

                newString = preBracket + bracketEvaulation + postBracket; // recreate the string with the bracket now solved
                console.log(`newString: ${newString}`); // debug
                




                currentString = currentString + bracketEvaulation;  // add number to the current number in the string
                currentString = parseFloat(currentString);
                
                strings.push(currentString);
                strings.push(postBracket);

                currentString = "";
                
                i = j + 1;
                console.log("-- Bracket processing complete --");
            }

            else
            {
                console.log("closing Bracket Found"); // debug  

            }



        }
                
        else  // if its a numerical char or decimal
        {
            currentString = currentString + currentChar;  // add number to the current number in the string
            console.log(`Added ${currentChar} to currentString`); // debug
            // console.log('currentString:' + currentString); // debug
            
        }
    }

    if(currentString != "")  // adding what is left in the current string to final strings
    {
        strings.push(parseFloat(currentString)); // pass final number to strings
    }

    return strings;
}


// ---------------------------------------------------------------------------------------------------------------

function calculateResult(equation, final="yes") 
{ 

    if (final === "yes") // if we need to calculate the final result of the equation
    {
        calculation = document.querySelectorAll(".calcText")[0].innerText;  // array of calculation to be completed
        sections = parseCalcString(calculation);
    }

    else // if we need to calculate only a part of the equation
    {
        sections = parseCalcString(equation);
    }
    

    console.log(`sections array: ${sections}`);  //debug

    let result = parseFloat(sections[0]);  // base number for the calcualtion is the first number
    let newString = "";

    for (i = 0; i < 4; i++) // cycles through operators by priority in (BI)DMAS
    {

        for (currentSection = 0; currentSection < sections.length; currentSection++)
        {
            console.log(`currentSection: ${sections[currentSection]}`); // debug


            if (i === 0)  // looking for "/"
            {

                if (sections[currentSection] === "/") 
                {

                    console.log("/ found"); // once found, calculation is done in place

                    newString = parseFloat(sections[currentSection - 1]) / parseFloat(sections[currentSection + 1]); 

                    sections.splice(currentSection - 1, 3, newString); // the result is spliced in place of the 2 nums and operator
                    currentSection++; // move to the next number for the calculation
                    i = 0; // i needs to be reset to ensure every operator gets computed after alterations

                    break;
                }

            }

            else if (i === 1) // looking for "*"
            {

                if (sections[currentSection] === "*")
                {
                    console.log("* found");

                    newString = parseFloat(sections[currentSection - 1]) * parseFloat(sections[currentSection + 1]);

                    sections.splice(currentSection - 1, 3, newString);
                    currentSection++;
                    i = 0;

                    break;
                }

            }

            else if (i === 2) // looking for "+"
            {

                if (sections[currentSection] === "+")
                {
                    console.log("+ found");

                    newString = parseFloat(sections[currentSection - 1]) + parseFloat(sections[currentSection + 1]);

                    sections.splice(currentSection - 1, 3, newString);
                    currentSection++;
                    i = 0;
                    break;
                }

            }

            else if (i === 3) // looking for "-"
            {

                if (sections[currentSection] === "-")
                {
                    console.log("- found");

                    newString = parseFloat(sections[currentSection - 1]) - parseFloat(sections[currentSection + 1]);

                    sections.splice(currentSection - 1, 3, newString);
                    currentSection++;
                    i = 0;
                    break;
                }

            }



        } 

    }

    result = parseFloat(sections[0]); // once al operators have been applied the only thing left is the final result


    if (final === "yes")  // if the calculation is completed
    {
        console.log("Final Result:" + result);

        for(i = 0; i < calcText.length; i++)
        {
            calcText[i].innerText = "=" + result;
            calcTextMobile[0].innerText = "=" + result;
        }

        return 0
    }

    else // if we need to then use the value
    {
        return result; 
    }
}

// ---------------------------------------------------------------------------------------------------------------