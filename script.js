const actualDeadline = document.getElementById("deadline");
const actualTimeRemaining = document.getElementById("time-remaining");
const todoCard = document.getElementById("todo-card");
const todoStatus = document.getElementById("todo-status");
const completeToggle = document.getElementById("todo-complete-toggle");
const editButton = document.getElementById("todo-edit-button");
const deleteButton = document.getElementById("todo-delete-button");

function calculateDaysAndTimeLeft() {
  const dueDateAndTime = new Date(actualDeadline.getAttribute("datetime"));
  const currentDay = new Date();

  // Calculate the wholetime left in milliseconds 
  const timeLeftInMilliseconds = dueDateAndTime - currentDay;

  // Check if the time left is negative (overdue) or positive (time remaining)
  if (timeLeftInMilliseconds < 0) {
    const overdueMilliseconds = Math.abs(timeLeftInMilliseconds);
    const overdueTotalMinutes = Math.floor(overdueMilliseconds / (1000 * 60));

    // Calculating overdue days, hours, minutes, and seconds
    const overdueDays = Math.floor(overdueTotalMinutes / (60 * 24));
    const overdueHours = Math.floor((overdueTotalMinutes % (60 * 24)) / 60);
    const overdueMinutes = overdueTotalMinutes % 60;
    const overdueSeconds = Math.floor((overdueMilliseconds % (1000 * 60)) / 1000);

    // Display the most significant overdue time unit
    if (overdueDays > 0) {
      actualTimeRemaining.textContent = "Overdue by " + overdueDays + " day(s)";
    }
    else if (overdueHours > 0) {
      actualTimeRemaining.textContent = "Overdue by " + overdueHours + " hour(s)";
    }
    else if (overdueMinutes > 0) {
      actualTimeRemaining.textContent = "Overdue by " + overdueMinutes + " minute(s)";
    }
    else if (overdueSeconds > 0) {
      actualTimeRemaining.textContent = "Overdue by " + overdueSeconds + " second(s)";
    }
     else {
      actualTimeRemaining.textContent = "Overdue now!";
    }

  } else {
    const totalMinutes = Math.floor(timeLeftInMilliseconds / (1000 * 60));

    // Calculating remaining days, hours, minutes, and seconds
    const daysLeft = Math.floor(totalMinutes / (60 * 24));
    const hoursLeft = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutesLeft = totalMinutes % 60;
    const secondsLeft = Math.floor((timeLeftInMilliseconds % (1000 * 60)) / 1000);

    // Display the most significant remaining time unit
    if (daysLeft > 1) {
      actualTimeRemaining.textContent = "Due in " + daysLeft + " day(s)";
    } else if (daysLeft === 1) {
      actualTimeRemaining.textContent = "Due tomorrow";
    } else if (hoursLeft > 0) {
      actualTimeRemaining.textContent = "Due in " + hoursLeft + " hour(s)";
    } else if (minutesLeft > 0) {
      actualTimeRemaining.textContent = "Due in " + minutesLeft + " minute(s)";
    } else if (secondsLeft > 0) {
      actualTimeRemaining.textContent = "Due in " + secondsLeft + " second(s)";
    } else {
    actualTimeRemaining.textContent = "Due now!";
    }
  }

}

completeToggle.addEventListener("change", function (event) {
  const isComplete = event.target.checked;
  todoCard.classList.toggle("is-complete", isComplete);
  todoStatus.textContent = isComplete ? "Done" : "In Progress";
  todoStatus.setAttribute("aria-label", "Task status: " + todoStatus.textContent);
});

editButton.addEventListener("click", function () {
  console.log("edit clicked");
});

deleteButton.addEventListener("click", function () {
  alert("Delete clicked");
});

calculateDaysAndTimeLeft();
setInterval(calculateDaysAndTimeLeft, 60000);
