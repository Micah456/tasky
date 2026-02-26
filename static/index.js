const day = 1000 * 60 * 60 * 24
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const newTaskBtn = document.getElementById("new-task-btn")
const newTaskDialog = document.getElementById("new-task-dialog")
const newTaskForm = document.getElementById("new-task-form")
const deadlineCheckbox = document.getElementById("deadline-checkbox")
const deadlineInput = document.getElementById("deadline-input")
const cancelNewTaskBtn = document.getElementById("cancel-new-task-btn")
const taskNameInput = document.getElementById("task-name-input")
const taskDescriptionTA = document.getElementById("task-description-ta")
const dueTaskDiv = document.getElementById("due-tasks-div")

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
    loadDueTasks()
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

function loadDueTasks(){
    const data = getLSData()
    const dueTasks = getDueTasks(data.Tasks)
    console.log(dueTasks)
    dueTaskDiv.innerHTML = ""
    if(dueTasks.length == 0){ //No due tasks
        const p = document.createElement("p")
        p.textContent = "You have no tasks due this week."
        dueTaskDiv.appendChild(p)
        return
    }
    const table = document.createElement("table")
    table.appendChild(getHeader(1))
    for(let i = 0; i < dueTasks.length; i++){
        table.appendChild(getTaskRow(dueTasks[i]))
    }
    dueTaskDiv.appendChild(table)
}

function getDueTasks(tasksArray){
    if(!tasksArray) {return null}
    const dueTasks = []

    //Get current Week
    const firstDayOfWeek = getFirstDayOfWeek()
    const lastDayOfWeek  = new Date(Number(firstDayOfWeek) + 6*day)
    console.log(`First day: ${firstDayOfWeek}, Last day: ${lastDayOfWeek}`)
    //Iterate over tasks
    for(let i = 0; i < tasksArray.length; i++){
        const task = tasksArray[i]
        //If deadline within current week
        if(task.Deadline >= firstDayOfWeek && task.Deadline <= lastDayOfWeek){
            //Push task to dueTasks
            dueTasks.push(task)
        }
    }
    return dueTasks
}

function getFirstDayOfWeek(){
    const today = new Date()
    const currDayOfWeek = today.getDay()
    console.log(currDayOfWeek)
    let monday
    switch (currDayOfWeek){
        case 1://If today is monday
            monday = today
            break
        case 0://If today is sunday
            monday = today - 6*day
            break
        default:
            monday = today - (currDayOfWeek - 1)*day
            break
    }
    //Strip remaining hours, min, sec, and ms from monday and return the resulting value  
    return stripDate(new Date(monday))
}

function getTaskRow(taskObj){
    const tr = document.createElement("tr")

    const td1 = document.createElement("td")
    const td2 = document.createElement("td")
    const td3 = document.createElement("td")

    //First cell - task name
    td1.textContent = taskObj.Name

    //Second cell - task due date
    const deadline = new Date(taskObj.Deadline)
    const deadlineDOW = dayNames[deadline.getDay()]

    const today = new Date()
    const todayIndex = today.getDay()
    const todayDOW = dayNames[todayIndex]

    const yesterdayDOW = dayNames[todayIndex == 0 ? 6 : todayIndex - 1]
    const tomorrowDOW = dayNames[todayIndex == 6 ? 0 : todayIndex + 1]

    switch(deadlineDOW){
        case todayDOW:
            td2.textContent = "Today"
            break
        case yesterdayDOW:
            td2.textContent = "Yesterday"
            break
        case tomorrowDOW:
            td2.textContent = "Tomorrow"
            break
        default:
            td2.textContent = deadlineDOW
    }
    
    if(stripDate(today) > stripDate(deadline)){
        td2.classList.add("overdue")
    }

    //Third cell - action buttons
    td3.classList.add("row")
    const openBtn = document.createElement("button")
    openBtn.textContent = "Open"
    const completeBtn = document.createElement("button")
    completeBtn.textContent = "Complete"
    openBtn.addEventListener("click", () => {
        openReadTaskDialog(taskObj)
    })
    completeBtn.addEventListener("click", () => {
        markComplete(taskObj)
    })
    td3.appendChild(openBtn)
    td3.appendChild(completeBtn)

    //Append all to tr
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)

    return tr
}

function openReadTaskDialog(task){
    console.log("To implement open task")
}

function markComplete(task){
    console.log("To implement complete task")
}

function getHeader(tableType){
    const th1 = document.createElement("th")
    const th2 = document.createElement("th")
    switch(tableType){
        case 0: //Events table
            th1.textContent = "Event"
            th2.textContent = "Time"
            break
        case 1: //Tasks table
            th1.textContent = "Task"
            th2.textContent = "Due"
            break
        default: //Category table
            th1.textContent = "Category"
            th2.textContent = "No. of Tasks"
    }
    const th3 = document.createElement("th")
    th3.textContent = "Actions"
    const tr = document.createElement("tr")
    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    return tr
}

/**
 * Strips the excess ms, s, min, etc. to give the given date at 00:00am
 * @param {Date} date date to strip
 * @returns {Date} Stripped version of the given date
 */
function stripDate(date){
    return new Date(date - date % day)
}

loadDueTasks()