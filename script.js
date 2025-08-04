// Function to easily show a custom dialog element
function showDialog(title, content, buttons, onsubmit, disableClose = false, disableCloseUponSubmission = false) {
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
    dialogX.onclick = () => {
        dialog.close();
        setTimeout(() => {
            dialog.remove();
        }, 1000);
    }
    dialogTop.appendChild(dialogTitle);
    if (!disableClose) dialogTop.appendChild(dialogX);
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
                buttonElement.onclick = () => {
                    dialog.close();
                    setTimeout(() => {
                        dialog.remove();
                    }, 1000);
                }
            } else if (buttons[i].type == "confirm") {
                buttonElement.classList.add("confirm");
                buttonElement.onclick = () => {
                    onsubmit(buttonElement);
                    if (!disableCloseUponSubmission) {
                        dialog.close();
                        setTimeout(() => {
                            dialog.remove();
                        }, 1000);
                    }
                }
            } else if (buttons[i].type == "link") {
                buttonElement = document.createElement("a");
                buttonElement.className = "dialog-button";
                buttonElement.innerHTML = buttons[i].content;
                buttonElement.href = buttons[i].link;
            }
            dialogFooter.appendChild(buttonElement);
        }
        dialog.appendChild(dialogFooter);
    }
    if (disableClose) dialog.setAttribute("closedby", "none");
    dialog.showModal();
}

document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location);
    // Clean up the url and remove info when refreshed
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
    if (url.searchParams.has('unauthorize')) {
        url.searchParams.delete('unauthorize');
        window.history.replaceState({}, '', url);
    }
    if (url.searchParams.has('errmessage')) {
        displayErrorToast(url.searchParams.get('errmessage'));
        url.searchParams.delete('errmessage');
        window.history.replaceState({}, '', url);
    }
});

// Simple reusable class for text inputs in dialogs
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
        if (this.id == "password") {
            input.type = "password";
            input.autocomplete = "current-password";
        }
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        return wrapper;
    }
    get value() {
        return this.input?.value;
    }
}

// Function to create a 30 character string of random letters
function createId() {
    let string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    let id = "";
    for (let i = 0; i < 30; i++) {
        id += string[Math.floor(Math.random() * string.length)];
    }
    return id;
}

// Show a toast
function displayErrorToast(message) {
    let toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = message;
    toast.setAttribute("popover", "manual");
    document.body.appendChild(toast);
    toast.showPopover();
    setTimeout(() => {
        toast.hidePopover();
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}