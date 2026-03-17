import { formatLongDate } from "./support_functions.js"

const checkboxBtns = Array(document.getElementsByClassName("btn-checkbox"))[0]
const recurringEventCheckbox = document.getElementById("recurring-event-checkbox")
const todayDate = document.getElementById("today-date")

todayDate.textContent = formatLongDate(new Date())

recurringEventCheckbox.checked = true
recurringEventCheckbox.addEventListener("change", () => {
    for(let i = 0 ; i < checkboxBtns.length; i++){
        const btn = checkboxBtns[i]
        const checkbox = btn.firstElementChild
        if(recurringEventCheckbox.checked){ //enabled
            checkbox.disabled = false
            btn.classList.remove("btn-disabled")

        }else{ //disabled
            checkbox.disabled = true
            btn.classList.remove("btn-checked")
            btn.classList.add("btn-disabled")
        }
    }
})

console.log(checkboxBtns)

for(let i = 0 ; i < checkboxBtns.length; i++) {
    const btn = checkboxBtns[i]
    console.log(btn)
    const checkbox = btn.firstElementChild
    console.log(checkbox)
    checkbox.addEventListener("change", () => {
        if(checkbox.checked){
            btn.classList.add("btn-checked")
        }else{
            btn.classList.remove("btn-checked")
        }
    })
}

