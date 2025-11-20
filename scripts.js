function showMessage() {
	const msgDiv = document.getElementById("message");
	msgDiv.textContent = "Hello! You clicked the button.";
}

function handleForm(event) {
	event.preventDefault();
	const nameInput = document.getElementById("name");
	const formMsg = document.getElementById("formMessage");
	if (nameInput.value.trim()) {
		formMsg.textContent = `Thank you, ${nameInput.value}!`;
	} else {
		formMsg.textContent = "Please enter your name.";
	}
	return false;
}
