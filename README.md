# tasky
A web app tool to help list and organise tasks, goals, and events

## Features
- Calender: to organise events
- Event: task + event
- Task: simple todo
- Task with deadline
- Recurring event
- Category: list of tasks

## Pages
- Index: Shows today's events, tasks due this week, link to calendar view, list of categories, list of goals. You can check of tasks here
- Calendar: shows calendar view of events, you can create an event here either for an existing task or you can create a new task at the same time - done on the same page
- Category view: shows tasks and events related to the category, you can check off and create tasks and events here.

## Structure
### Objects
- Task: has ID, name, desciption, done?, deadline (optional)
- Event: has an ID, a task ID, start date/time (ms), duration (mins), recurring object
- Recurring object: end date/time, daysArray (E.g. [0,2,4] = Mon, Wed, Fri)
- Category: has an ID, name, array of task id

### Example JSON
{
  "Categories" : [
    {
        "ID" : "<timestamp>",
        "Name" : "Category1",
        "Tasks" : ["<taskID>", "<taskID>" ]
    }
  ],
  "Tasks" : [
    {
        "ID" : "<timestamp>",
        "Name" : "Task1",
        "Description" : "Task1 Description",
        "Done" : false,
        "deadline" : -1
    }
  ],
  "Events" : [
    {
        "ID" : "<timestamp>",
        "Task ID" : "<TaskID>",
        "Start" : 1772028125816,
        "Duration" : 60,
        "Recurring: {
          "End" : 1772228125816,
          "Days" : [0, 2, 4]
        }
    }
  ],
}

