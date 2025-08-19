var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { countryList } from "./countryList.js";
const Base_URL = "https://2024-03-06.currency-api.pages.dev/v1/currencies";
//Dom Elements
const dropdowns = document.querySelectorAll('.dropdown select');
let btn = document.querySelector('.btn');
let result = document.querySelector('.result');
const message = document.querySelector('.msg');
const arrowBtn = document.querySelector('.fa-arrow-right-arrow-left');
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement('option');
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        }
        else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }
        select.appendChild(newOption);
    }
    select.addEventListener('change', (evt) => {
        updateFlag(evt.target);
    });
}
arrowBtn.addEventListener("click", (evt) => {
    let fromSelect = document.querySelector("select[name='from']");
    let toSelect = document.querySelector("select[name='to']");
    let temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    updateFlag(fromSelect);
    updateFlag(toSelect);
    getExchangeRate();
});
const updateFlag = (element) => {
    var _a;
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('img');
    if (img) {
        img.src = newSrc;
    }
};
function getExchangeRate() {
    return __awaiter(this, arguments, void 0, function* (showLoading = true) {
        let from = document.querySelector('.from select').value;
        let to = document.querySelector('.to select').value;
        let amount = parseFloat(document.querySelector('.amount input').value);
        if (from === to) {
            result.innerText = "Please select different currencies";
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            amount = 1;
            document.querySelector('.amount input').value = "1"; // Default to 1 if input is invalid
            result.innerText = "⚠️ Invalid input, defaulted to 1";
        }
        if (showLoading) {
            result.innerText = "⏳Converting...";
        }
        let url = `${Base_URL}/${from.toLowerCase()}.json`;
        try {
            let response = yield fetch(url);
            let data = yield response.json();
            // Example API response structure:
            // { "usd": { "inr": 82.5 } }
            const rate = data[from.toLowerCase()][to.toLowerCase()];
            const finalAmount = (amount * rate).toFixed(2);
            result.innerText = `${amount} ${from} = ${finalAmount} ${to}`;
        }
        catch (error) {
            result.innerText = "❌ Error fetching conversion rate. Please try again later.";
            console.error(error);
        }
    });
}
btn.addEventListener('click', (evt) => __awaiter(void 0, void 0, void 0, function* () {
    evt.preventDefault(); // Prevent form submission
    getExchangeRate(true); // Call the function to get exchange rate
}));
window.addEventListener('load', () => {
    document.querySelector('.amount input').value = "1"; // Default to 1 if input is invalid
    getExchangeRate(false); // Fetch initial exchange rate on page load
});
//# sourceMappingURL=main.js.map