const newTaskBtn = document.getElementById("new-task-btn")
const newTaskDialog = document.getElementById("new-task-dialog")
const newTaskForm = document.getElementById("new-task-form")
const deadlineCheckbox = document.getElementById("deadline-checkbox")
const deadlineInput = document.getElementById("deadline-input")
const cancelNewTaskBtn = document.getElementById("cancel-new-task-btn")
const taskNameInput = document.getElementById("task-name-input")
const taskDescriptionTA = document.getElementById("task-description-ta")

const appDataKey = "Tasky_Key"
const defaultData = {
    "Categories" : [],
    "Tasks" : [],
    "Events" : []
}

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
        saveTask(task)
        closeNewTaskDialog()
        
    }else{
        alert("Could not save task: task name required")
    }
})

function saveTask(task){
    console.log(task)
    const data = getLSData()
    if(containsTaskName(data, task.Name)){
        if(!confirm(`A task with the name ${task.Name} already exists. Are you sure you want to create this task?`)){
            alert("Task not saved")
            return false
        }
    }
    data.Tasks.push(task)
    localStorage.setItem(appDataKey, JSON.stringify(data))
    alert(`Task '${task.Name}' successfully created.`)
}

function closeNewTaskDialog(){
    newTaskForm.reset()
    newTaskDialog.open = false
}

/**
 * Attempts to get app data from local storage. If not present, 
 * it will create local storage data from the default data
 * @returns app data from local storage (or default data if there is none)
 */
function getLSData(){
    const data = localStorage.getItem(appDataKey)
    if(!data){
        localStorage.setItem(appDataKey, JSON.stringify(defaultData))
        return defaultData
    }
    return JSON.parse(data)
}

/**
 * Checks to see if a task with a given name already exists in the data.
 * @param {{}} data 
 * @param {String} name 
 * @returns {Boolean} true if it exists, false if it doesn't
 */
function containsTaskName(data, name){
    const tasks = data.Tasks
    for(let i = 0; i < tasks.length; i++){

        if(name == tasks[i].Name){ return true}
    }
    return false
}