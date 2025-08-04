// Add action for the staff add button
if (document.getElementById("staff-add")) document.getElementById("staff-add").onclick = () => {
    showStaffDialog();
}

// Show a dialog to edit a staff member's information
function showStaffDialog(firstName = "", lastName = "", available = [], staff_id = 0) {
    let dialogContent = document.createElement("div");
    dialogContent.className = "dialog-form";

    // text inputs
    let fname = new DialogTextInput("First Name", firstName, "firstname");
    dialogContent.appendChild(fname.getElement());
    let lname = new DialogTextInput("Last Name", lastName, "lastname");
    dialogContent.appendChild(lname.getElement());

    // new editor for each of the weekdays
    let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let editors = [];
    daysOfWeek.forEach((day, i) => {
        let editor = new WeekdayAvailabilityEditor(day, available.filter(e => e.weekday == i + 1), i + 1);
        dialogContent.appendChild(editor.getElement());
        editors.push(editor);
    });

    showDialog("Edit Staff Member", dialogContent, [
        {
            "type": "cancel",
            "content": "Cancel"
        },
        {
            "type": "confirm",
            "content": "Submit"
        }
    ], (confirmButton) => {
        confirmButton.innerHTML = '<i class="spinner"></i>'

        let first = fname.value;
        let last = lname.value;

        const formData = new FormData();
        formData.append('staff_id', staff_id);
        formData.append('first_name', first);
        formData.append('last_name', last);

        // Compile the availability data from all 5 editors
        let availability = [];
        editors.forEach((e, i) => {
            availability = availability.concat(e.value.map(a => ({ "start": a.start, "end": a.end, "weekday": i + 1 })))
        });
        formData.append('availability', JSON.stringify(availability))

        // Submit it to the form
        fetch('/edit/edit_staff.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw { status: response.status, message: text };
                    });
                }
                return response.text();
            })
            .then(() => {
                // If success, redirect
                window.location.href = staff_id == 0 ? `/edit/?message=Successfully added ${first} ${last}` : `/edit/?message=Successfully edited ${first} ${last}`;
            })
            .catch(err => {
                // If error, alert the user
                displayErrorToast("Unable to process request: " + err.message)
            });
    }, false, true)
}

// Class for editing the availability
// Use .value to get an array of the available times
class WeekdayAvailabilityEditor {
    constructor(name, availability_data, weekdayInt) {
        this.name = name;
        this.availability_data = availability_data;
        this.weekdayInt = weekdayInt;
        this.entries = [];
        availability_data.forEach(e => {
            let entry = new AvailabilityEntry(e.start, e.end);
            this.entries.push(entry);
        });
    }

    getElement() {
        let dayElement = document.createElement("div");
        dayElement.className = "dialog-form-entry";
        let dayTop = document.createElement("div");
        dayTop.className = "list-flex-title";
        let dayTitle = document.createElement("h3");
        dayTitle.innerHTML = this.name;
        dayTop.appendChild(dayTitle);
        let dayAdd = document.createElement("button");
        dayAdd.className = "list-add";
        dayAdd.innerHTML = '<i class="fa-solid fa-plus"></i>';
        dayAdd.style.width = "30px";
        dayAdd.style.height = "30px";
        dayAdd.style.fontSize = "1rem";
        dayAdd.type = "button";
        dayAdd.onclick = () => {
            let newEntry = new AvailabilityEntry();
            this.entries.push(newEntry);
            timeIntervals.appendChild(newEntry.element);
        }
        dayTop.appendChild(dayAdd);
        dayElement.appendChild(dayTop);
        let timeIntervals = document.createElement("div");
        timeIntervals.className = "time-intervals";
        let nothingsHere = document.createElement("div");
        nothingsHere.className = "nothings-here";
        nothingsHere.innerHTML = "No availability set for this day yet.";
        timeIntervals.appendChild(nothingsHere);
        this.entries.forEach(entry => {
            timeIntervals.appendChild(entry.element);
        });
        dayElement.appendChild(timeIntervals);
        return dayElement;
    }

    get value() {
        return this.entries.map(e => e.value).filter(e => e);
    }
}

// An availability entry with a start and end time, used in a WeekdayAvailabilityEditor
class AvailabilityEntry {
    constructor(startTime, endTime) {
        let element = document.createElement("div");
        this.element = element;
        this.deleted = false;
        element.className = "time-interval";
        let startTimeInput = document.createElement("input");
        startTimeInput.type = "time";
        if (startTime) startTimeInput.value = startTime;
        startTimeInput.className = "time-interval-input";
        let toElement = document.createElement("div");
        toElement.innerHTML = "to";
        toElement.style.fontFamily = "Arial, Helvetica, sans-serif";
        let endTimeInput = document.createElement("input");
        endTimeInput.type = "time";
        if (endTime) endTimeInput.value = endTime;
        endTimeInput.className = "time-interval-input";
        let trashButton = document.createElement("button");
        trashButton.className = "trash";
        trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        trashButton.onclick = () => {
            this.element.remove();
            this.deleted = true;
        }
        element.appendChild(startTimeInput);
        element.appendChild(toElement);
        element.appendChild(endTimeInput);
        element.appendChild(trashButton);
        this.startTimeInput = startTimeInput;
        this.endTimeInput = endTimeInput;
    }
    get value() {
        return ((this.deleted || !this.startTimeInput.value || !this.endTimeInput.value) ? null : {
            "start": this.startTimeInput.value,
            "end": this.endTimeInput.value
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Add actions for edit buttons
    const editButtons = document.querySelectorAll('.edit-action');
    editButtons.forEach(button => {
        button.onclick = () => {
            // Show the staff dialog
            const firstName = button.dataset.firstName;
            const lastName = button.dataset.lastName;
            const availability = JSON.parse(button.dataset.availability);
            showStaffDialog(firstName, lastName, availability, button.dataset.staffId);
        }
    });

    // Add actions for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-action');
    deleteButtons.forEach(button => {
        let dialogContent = document.createElement("div");
        dialogContent.style.fontFamily = "Arial, Helvetica, sans-serif";
        dialogContent.style.maxWidth = "400px";
        let fname = button.dataset.firstName;
        let lname = button.dataset.lastName;
        dialogContent.innerHTML = `Are you sure you want to delete ${fname} ${lname}?`;
        let staff_id = button.dataset.staffId;
        button.onclick = () => {
            // Show confirmation dialog
            showDialog("Are you sure?", dialogContent, [
                {
                    "type": "cancel",
                    "content": "Cancel"
                },
                {
                    "type": "confirm",
                    "content": "Confirm"
                }
            ], (confirmButton) => {
                confirmButton.innerHTML = '<i class="spinner"></i>'

                const formData = new FormData();
                formData.append('staff_id', staff_id);

                // Submit it to the form
                fetch('/edit/delete_staff.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(text => {
                                throw { status: response.status, message: text };
                            });
                        }
                        return response.text();
                    })
                    .then(() => {
                        // If success, redirect
                        window.location.href = `/edit/?message=Successfully deleted ${fname} ${lname}`;
                    })
                    .catch(err => {
                        // If error, alert the user
                        displayErrorToast("Unable to process request: " + err.message)
                    });
            })
        }
    });
});