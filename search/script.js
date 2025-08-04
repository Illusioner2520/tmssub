document.addEventListener('DOMContentLoaded', () => {
    // Add actions for buttons
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
            // Open confirmation dialog
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
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(text => {
                                throw { status: response.status, message: text };
                            });
                        }
                        return response.text();
                    })
                    .then(response => {
                        let log_id = JSON.parse(response).log_id;
                        // If success, redirect back to start
                        window.location.href = `/select?log_id=${log_id}&first=${firstName}&last=${lastName}&message=Successfully selected ${firstName} ${lastName} to sub on ${weekday} at ${time}`;
                    })
                    .catch(err => {
                        // If error, alert the user
                        displayErrorToast("Unable to process request: " + err.message)
                    });
            });
        }
    });
});