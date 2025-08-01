function showDialog(title, content, buttons, onsubmit) {
    let dialog = document.createElement("dialog");
    dialog.className = "dialog";
    dialog.oncancel = () => {
        setTimeout(() => {
            dialog.remove();
        }, 1000);
    }
    let dialogTop = document.createElement("div");
    dialogTop.className = "dialog-top";
    let dialogTitle = document.createElement("div");
    dialogTitle.className = "dialog-title";
    dialogTitle.innerHTML = title;
    let dialogX = document.createElement("button");
    dialogX.className = "dialog-x";
    dialogX.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    dialogX.onclick = (e) => {
        dialog.close();
        setTimeout(() => {
            dialog.remove();
        }, 1000);
    }
    dialogTop.appendChild(dialogTitle);
    dialogTop.appendChild(dialogX);
    dialog.appendChild(dialogTop);
    let dialogContentWrapper = document.createElement("div");
    dialogContentWrapper.className = "dialog-content-wrapper";
    dialog.appendChild(dialogContentWrapper);
    dialogContentWrapper.appendChild(content);
    document.body.appendChild(dialog);
    if (buttons && buttons.length) {
        let dialogFooter = document.createElement("div");
        dialogFooter.className = "dialog-footer";
        for (let i = 0; i < buttons.length; i++) {
            let buttonElement = document.createElement("button");
            buttonElement.className = "dialog-button";
            buttonElement.innerHTML = buttons[i].content;
            if (buttons[i].type == "cancel") {
                buttonElement.onclick = (e) => {
                    dialog.close();
                    setTimeout(() => {
                        dialog.remove();
                    }, 1000);
                }
            } else if (buttons[i].type == "confirm") {
                buttonElement.classList.add("confirm");
                buttonElement.onclick = () => {
                    onsubmit(buttonElement);
                    dialog.close();
                    setTimeout(() => {
                        dialog.remove();
                    }, 1000);
                }
            }
            dialogFooter.appendChild(buttonElement);
        }
        dialog.appendChild(dialogFooter);
    }
    dialog.showModal();
}

document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location);
    if (url.searchParams.has('message')) {
        url.searchParams.delete('message');
        window.history.replaceState({}, '', url);
    }
    if (url.searchParams.has('log_id')) {
        url.searchParams.delete('log_id');
        window.history.replaceState({}, '', url);
    }
    if (url.searchParams.has('first')) {
        url.searchParams.delete('first');
        window.history.replaceState({}, '', url);
    }
    if (url.searchParams.has('last')) {
        url.searchParams.delete('last');
        window.history.replaceState({}, '', url);
    }
    const searchButtons = document.querySelectorAll('.search-action');
    searchButtons.forEach(button => {
        button.onclick = () => {
            const staffId = button.dataset.staffId;
            const firstName = button.dataset.firstName;
            const lastName = button.dataset.lastName;
            const time = button.dataset.time;
            const weekday = button.dataset.weekday;
            let dialogContent = document.createElement("div");
            dialogContent.style.fontFamily = "Arial, Helvetica, sans-serif";
            dialogContent.style.maxWidth = "400px";
            dialogContent.innerHTML = `Are you sure you want to select ${firstName} ${lastName} to sub on ${weekday} at ${time}?`;
            showDialog(`Select ${firstName} ${lastName} to Sub`, dialogContent, [{
                "type": "cancel",
                "content": "Cancel"
            }, {
                "type": "confirm",
                "content": "Confirm"
            }], (confirmButton) => {
                confirmButton.innerHTML = '<i class="spinner"></i>'
                const formData = new FormData();
                formData.append('staff_id', staffId);
                formData.append('time', button.dataset.timeFull);
                formData.append('weekday', button.dataset.weekdayInt);

                // Submit it to the form
                fetch('/select/select_staff.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.ok ? response.text() : Promise.reject('Failed'))
                    .then(response => {
                        let log_id = JSON.parse(response).log_id;
                        // If success, redirect back to start
                        window.location.href = `/select?log_id=${log_id}&first=${firstName}&last=${lastName}&message=Successfully selected ${firstName} ${lastName} to sub on ${weekday} at ${time}`;
                    })
                    .catch(() => {
                        // If error, alert the user
                        alert("Unable to process request.");
                    });
            });
        }
    });
    const logButtons = document.querySelectorAll('.log-action, .undo');
    logButtons.forEach(button => {
        button.onclick = () => {
            const firstName = button.dataset.firstName;
            const lastName = button.dataset.lastName;
            let dialogContent = document.createElement("div");
            dialogContent.style.fontFamily = "Arial, Helvetica, sans-serif";
            dialogContent.style.maxWidth = "400px";
            dialogContent.innerHTML = `Are you sure you want to undo selecting ${firstName} ${lastName} to sub?`;
            showDialog(`Undo Selection`, dialogContent, [{
                "type": "cancel",
                "content": "Cancel"
            }, {
                "type": "confirm",
                "content": "Confirm"
            }], (confirmButton) => {
                confirmButton.innerHTML = '<i class="spinner"></i>'
                const formData = new FormData();
                formData.append('log_id', button.dataset.logId);

                // Submit it to the form
                fetch('/log/undo_entry.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.ok ? response.text() : Promise.reject('Failed'))
                    .then(() => {
                        // If success, redirect
                        window.location.href = button.matches(".undo") ? '/select?message=Successfully undid sub selection' : '/log?message=Successfully undid sub selection';
                    })
                    .catch(() => {
                        // If error, alert the user
                        alert("Unable to process request.");
                    });
            });
        }
    });
    const editButtons = document.querySelectorAll('.edit-action');
    editButtons.forEach(button => {
        button.onclick = () => {
            const firstName = button.dataset.firstName;
            const lastName = button.dataset.lastName;
            const availability = JSON.parse(button.dataset.availability);
            showStaffDialog(firstName, lastName, availability, button.dataset.staffId);
        }
    })
});

class DialogTextInput {
    constructor(name, value, id) {
        this.name = name;
        this.val = value;
        this.id = id;
    }
    getElement() {
        let id = createId();
        let wrapper = document.createElement("div");
        wrapper.className = "dialog-form-entry";
        let label = document.createElement("label");
        label.className = "dialog-label";
        label.setAttribute("for", id);
        label.innerHTML = this.name;
        let input = document.createElement("input");
        input.className = "dialog-text-input";
        input.name = this.id;
        input.id = id;
        input.placeholder = this.name;
        input.value = this.val;
        this.input = input;
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        return wrapper;
    }
    get value() {
        return this.input?.value;
    }
}

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

function showStaffDialog(firstName = "", lastName = "", available = [], staff_id = 0) {
    let dialogContent = document.createElement("div");
    dialogContent.className = "dialog-form";

    let fname = new DialogTextInput("First Name", firstName, "firstname");
    dialogContent.appendChild(fname.getElement());
    let lname = new DialogTextInput("Last Name", lastName, "lastname");
    dialogContent.appendChild(lname.getElement());

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
            .then(response => response.ok ? response.text() : Promise.reject('Failed'))
            .then(() => {
                // If success, redirect
                window.location.href = staff_id == 0 ? `/edit/?message=Successfully added ${first} ${last}` : `/edit/?message=Successfully edited ${first} ${last}`;
            })
            .catch(() => {
                // If error, alert the user
                alert("Unable to process request.");
            });
    })
}

if (document.getElementById("staff-add")) document.getElementById("staff-add").onclick = () => {
    showStaffDialog();
}

function createId() {
    let string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    let id = "";
    for (let i = 0; i < 30; i++) {
        id += string[Math.floor(Math.random() * string.length)];
    }
    return id;
}