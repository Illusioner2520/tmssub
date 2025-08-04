if (document.getElementById("notauthorized")) {
    let authorizedElement = document.getElementById("notauthorized");

    let dialogContent = document.createElement("form");
    dialogContent.className = "dialog-form";
    dialogContent.method = "post";
    dialogContent.action = "/authorize/authorize.php";

    let info = document.createElement("div");
    info.className = "info";
    info.innerHTML = "Enter the password to access this page.";
    dialogContent.appendChild(info);

    let hiddenTo = document.createElement('input');
    hiddenTo.type = "hidden";
    hiddenTo.name = "to";
    hiddenTo.value = authorizedElement.dataset.to;
    dialogContent.appendChild(hiddenTo);

    let passwordInput = new DialogTextInput("Password", "", "password");
    dialogContent.appendChild(passwordInput.getElement());

    showDialog("Enter Password", dialogContent, [
        {
            "type": "link",
            "content": "Go Back",
            "link": "/select"
        },
        {
            "type": "confirm",
            "content": "Submit"
        }
    ], (confirmButton) => {
        confirmButton.innerHTML = '<i class="spinner"></i>'

        let password = passwordInput.value;
        const formData = new FormData();
        formData.append('password', password);

        // Submit it to the form
        fetch('/authorize/authorize.php', {
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
                window.location.href = (authorizedElement.dataset.to ?? "/select") + "?message=Successfully authorized";
            })
            .catch(err => {
                confirmButton.innerHTML = 'Submit';
                // If error, alert the user
                displayErrorToast("Unable to authorize: " + err.message)
            });
    }, true, true);
}