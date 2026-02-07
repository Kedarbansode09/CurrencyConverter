const BASE_URL = "https://api.exchangerate.host/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select ")
const toCurr = document.querySelector(".to select ")
const msg = document.querySelector(".msg");

// for (code in countryList){
//     console.log(code,countryList[code]);
// }

for(let select of dropdowns){
    for(currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD"){
            newOption.selected="selected";
        }else if(select.name === "to" && currCode === "INR"){
            newOption.selected="selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change",(evt) => {
        updateFlag(evt.target);
    });
}
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    // console.log(currCode);
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

btn.addEventListener("click",async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input")
    let amtVal = amount.value;
    if(amtVal===""||amtVal<1){
        amtVal = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}?base=${fromCurr.value}&symbols=${toCurr.value}`;

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        const data = await response.json();
        const rate = data?.rates?.[toCurr.value];

        if (!rate) {
            throw new Error("Exchange rate unavailable.");
        }

        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Unable to fetch exchange rate. Please try again.";
        console.error(error);
    }
});
