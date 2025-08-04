document.addEventListener('DOMContentLoaded', () => {
    // Add actions for undo buttons
    const logButtons = document.querySelectorAll('.log-action, .undo');
    logButtons.forEach(button => {
        button.onclick = () => {
            const firstName = button.dataset.firstName;
            const lastName = button.dataset.lastName;
            let dialogContent = document.createElement("div");
            dialogContent.style.fontFamily = "Arial, Helvetica, sans-serif";
            dialogContent.style.maxWidth = "400px";
            dialogContent.innerHTML = `Are you sure you want to undo selecting ${firstName} ${lastName} to sub?`;
            // show confirmation dialog
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
                        window.location.href = button.matches(".undo") ? '/select?message=Successfully undid sub selection' : '/log?message=Successfully undid sub selection';
                    })
                    .catch(err => {
                        // If error, alert the user
                        displayErrorToast("Unable to process request: " + err.message)
                    });
            });
        }
    });
});