const actualDeadline = document.getElementById("deadline");
const actualTimeRemaining = document.getElementById("time-remaining");
const todoCard = document.getElementById("todo-card");
const statusControl = document.getElementById("status-control");
const completeToggle = document.getElementById("todo-complete-toggle");
const editButton = document.getElementById("todo-edit-button");
const deleteButton = document.getElementById("todo-delete-button");
const editFormContainer = document.getElementById("edit-form");
const todoEditForm = document.getElementById("todo-edit-form");
const cancelEditButton = document.getElementById("edit-cancel-button");
const editTitleInput = document.getElementById("edit-title");
const editDescriptionInput = document.getElementById("edit-description");
const editPriorityInput = document.getElementById("edit-priority");
const editDueDateInput = document.getElementById("edit-due-date");
const titleElement = document.getElementById("todo-title");
const descriptionElement = document.getElementById("todo-description");
const overdueIndicator = document.getElementById("overdue-indicator");
const priorityElement = document.getElementById("todo-priority");
const priorityIndicator = document.getElementById("todo-priority-indicator");
let timeUpdateInterval = null;
let editSnapshot = null;


function calculateDaysAndTimeLeft() {
  if (statusControl.value === "Done") {
    actualTimeRemaining.textContent = "Completed";
    actualTimeRemaining.classList.remove("is-overdue");
    if (overdueIndicator) {
      overdueIndicator.classList.remove("is-visible");
    }
    return;
  }

  const dueDateAndTime = new Date(actualDeadline.getAttribute("datetime"));
  const currentDay = new Date();

  // Calculate the wholetime left in milliseconds 
  const timeLeftInMilliseconds = dueDateAndTime - currentDay;

  // Check if the time left is negative (overdue) or positive (time remaining)
  if (timeLeftInMilliseconds < 0) {
    actualTimeRemaining.classList.add("is-overdue");
    if (overdueIndicator) {
      overdueIndicator.classList.add("is-visible");
    }

    const overdueMilliseconds = Math.abs(timeLeftInMilliseconds);
    const overdueTotalMinutes = Math.floor(overdueMilliseconds / (1000 * 60));

    // Calculating overdue days, hours, and minutes
    const overdueDays = Math.floor(overdueTotalMinutes / (60 * 24));
    const overdueHours = Math.floor((overdueTotalMinutes % (60 * 24)) / 60);
    const overdueMinutes = overdueTotalMinutes % 60;

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
     else {
      actualTimeRemaining.textContent = "Overdue by 1 minute";
    }

  } else {
    actualTimeRemaining.classList.remove("is-overdue");
    if (overdueIndicator) {
      overdueIndicator.classList.remove("is-visible");
    }

    const totalMinutes = Math.floor(timeLeftInMilliseconds / (1000 * 60));

    // Calculating remaining days, hours, and minutes
    const daysLeft = Math.floor(totalMinutes / (60 * 24));
    const hoursLeft = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutesLeft = totalMinutes % 60;

    // Display the most significant remaining time unit
    if (daysLeft > 0) {
      actualTimeRemaining.textContent = "Due in " + daysLeft + " day(s)";
    } else if (hoursLeft > 0) {
      actualTimeRemaining.textContent = "Due in " + hoursLeft + " hour(s)";
    } else if (minutesLeft > 0) {
      actualTimeRemaining.textContent = "Due in " + minutesLeft + " minute(s)";
    } else {
    actualTimeRemaining.textContent = "Due in 1 minute";
    }
  }

}

function startOrStopTimeUpdates() {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
    timeUpdateInterval = null;
  }

  calculateDaysAndTimeLeft();

  if (statusControl.value !== "Done") {
    timeUpdateInterval = setInterval(calculateDaysAndTimeLeft, 60000);
  }
}

function syncStatusVisualState() {
  const isDone = statusControl.value === "Done";
  const isInProgress = statusControl.value === "In Progress";

  completeToggle.checked = isDone;
  todoCard.classList.toggle("is-complete", isDone);
  todoCard.classList.toggle("is-in-progress", isInProgress);
  statusControl.setAttribute("aria-label", "Task status: " + statusControl.value);
}

function updatePriorityIndicator(priorityValue) {
  if (!priorityIndicator) {
    return;
  }

  const normalizedPriority = (priorityValue || "").trim().toLowerCase();
  priorityIndicator.classList.remove("priority-low", "priority-medium", "priority-high");

  if (normalizedPriority === "low") {
    priorityIndicator.classList.add("priority-low");
  } else if (normalizedPriority === "medium") {
    priorityIndicator.classList.add("priority-medium");
  } else {
    priorityIndicator.classList.add("priority-high");
  }
}

function getDescriptionText() {
  const dots = document.getElementById("dots");
  const more = document.getElementById("more");
  const preview = dots && dots.previousSibling ? dots.previousSibling.textContent : "";
  return (preview + (more ? more.textContent : "")).replace(/\s+/g, " ").trim();
}

function applyDescriptionText(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  const preview = words.slice(0, 14).join(" ");
  const remaining = words.slice(14).join(" ");
  const dots = document.getElementById("dots");
  const more = document.getElementById("more");
  const btn = document.getElementById("myBtn");

  if (dots && dots.previousSibling) {
    dots.previousSibling.textContent = (preview || text || "") + " ";
    dots.style.display = remaining ? "inline" : "none";
  }
  if (more) {
    more.textContent = remaining ? " " + remaining : "";
    more.style.display = "none";
  }
  if (btn) {
    btn.textContent = "Read more";
    btn.setAttribute("aria-expanded", "false");
    btn.style.display = remaining ? "inline-block" : "none";
    if (more && more.parentNode) {
      more.parentNode.insertBefore(btn, more);
    }
  }
}

function closeEditMode() {
  editFormContainer.style.display = "none";
  todoCard.style.display = "inline-flex";
  editButton.focus();
}

completeToggle.addEventListener("change", function (event) {
  const isComplete = event.target.checked;

  // Keep status and time in sync with the completion toggle.
  statusControl.value = isComplete ? "Done" : "Pending";
  syncStatusVisualState();
  startOrStopTimeUpdates();
});

statusControl.addEventListener("change", function () {
  syncStatusVisualState();
  startOrStopTimeUpdates();
});

editButton.addEventListener("click", function(event) {
  event.preventDefault();

  editSnapshot = {
    title: titleElement ? titleElement.textContent.trim() : "",
    description: getDescriptionText(),
    priority: priorityElement ? priorityElement.textContent.trim() : "",
    deadlineIso: actualDeadline ? actualDeadline.getAttribute("datetime") : ""
  };

  editTitleInput.value = editSnapshot.title;
  editDescriptionInput.value = editSnapshot.description;
  editPriorityInput.value = editSnapshot.priority || "Medium";

  if (editSnapshot.deadlineIso) {
    const dueDate = new Date(editSnapshot.deadlineIso);
    const localDate = new Date(dueDate.getTime() - dueDate.getTimezoneOffset() * 60000);
    editDueDateInput.value = localDate.toISOString().slice(0, 16);
  }

  editFormContainer.style.display = "block";
  todoCard.style.display = "none";
  editTitleInput.focus();
});

todoEditForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (titleElement) {
    titleElement.textContent = editTitleInput.value.trim() || editSnapshot.title;
  }
  if (priorityElement) {
    priorityElement.textContent = editPriorityInput.value;
    priorityElement.setAttribute("aria-label", "Task priority: " + editPriorityInput.value);
    updatePriorityIndicator(editPriorityInput.value);
  }

  applyDescriptionText(editDescriptionInput.value.trim() || editSnapshot.description);

  if (editDueDateInput.value) {
    const selectedDate = new Date(editDueDateInput.value);
    actualDeadline.setAttribute("datetime", selectedDate.toISOString());
    actualDeadline.textContent = selectedDate.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  startOrStopTimeUpdates();
  closeEditMode();
});

cancelEditButton.addEventListener("click", function () {
  closeEditMode();
});
  
deleteButton.addEventListener("click", function () {
  if (confirm("Are you sure you want to delete this task?")) {
    todoCard.remove();
  }
});

function myFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myBtn");

  if (dots.style.display === "none") {
    // Collapse: move Read more back to its original location before extra text.
    moreText.parentNode.insertBefore(btnText, moreText);
    dots.style.display = "inline";
    btnText.innerHTML = "Read more";
    btnText.setAttribute("aria-expanded", "false");
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less";
    btnText.setAttribute("aria-expanded", "true");
    moreText.style.display = "inline";

    // Expand: place Read less at the end of the full text.
    moreText.insertAdjacentElement("afterend", btnText);
  }
}

syncStatusVisualState();
applyDescriptionText(getDescriptionText());
startOrStopTimeUpdates();
updatePriorityIndicator(priorityElement ? priorityElement.textContent : "");
