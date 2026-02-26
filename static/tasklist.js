import { getHeader, getLSData, getTaskRow, saveTask } from "./support_functions.js"
const taskDiv = document.getElementById("task-div")
const newTaskBtn = document.getElementById("new-task-btn")
const newTaskDialog = document.getElementById("new-task-dialog")
const newTaskForm = document.getElementById("new-task-form")
const deadlineCheckbox = document.getElementById("deadline-checkbox")
const deadlineInput = document.getElementById("deadline-input")
const cancelNewTaskBtn = document.getElementById("cancel-new-task-btn")
const taskNameInput = document.getElementById("task-name-input")
const taskDescriptionTA = document.getElementById("task-description-ta")

deadlineInput.setAttribute('min', (new Date()).toISOString().split('T')[0])

newTaskBtn.addEventListener("click", () => {
    if(!newTaskDialog.open){
        newTaskForm.reset()
        newTaskDialog.open = true
    }
})

deadlineCheckbox.addEventListener("change", () => {
    if (deadlineCheckbox.checked){
        deadlineInput.disabled = false
    }else{
        deadlineInput.value = ""
        deadlineInput.disabled = true
    }
})

cancelNewTaskBtn.addEventListener('click', closeNewTaskDialog)

newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const taskName = taskNameInput.value.trim()
    const taskDescription = taskDescriptionTA.value.trim()
    const deadline = deadlineInput.value
    const task = {}
    if(taskName){
        task.ID = Number(new Date())
        task.Name = taskName
        task.Description = taskDescription
        task.Deadline = deadline ? Number(new Date(deadline)) : -1
        task.Done = false
        saveTask(task, loadTasks)
        closeNewTaskDialog()
        
    }else{
        alert("Could not save task: task name required")
    }
})

function closeNewTaskDialog(){
    newTaskForm.reset()
    newTaskDialog.open = false
}

function loadTasks(){
    const data = getLSData()
    const tasks = data.Tasks
    tasks.sort((a, b) => a.Deadline - b.Deadline)
    taskDiv.innerHTML = ""
    if(tasks.length == 0){ //No tasks
        const p = document.createElement("p")
        p.textContent = "You have no tasks."
        taskDiv.appendChild(p)
        return
    }
    const table = document.createElement("table")
    table.appendChild(getHeader(1))
    for(let i = 0; i < tasks.length; i++){
        table.appendChild(getTaskRow(tasks[i]))
    }
    taskDiv.appendChild(table)
}

loadTasks()
