document.addEventListener("DOMContentLoaded", function() {
    const output = document.getElementById("output");
    const input = document.getElementById("input");
    input.addEventListener("keydown", handleKeyPress);

    let currentChallenge = 0;
    const challenges = [
        {
            guide: "\n\n挑战1: 创建新用户\n\n创建一个新的用户叫dog，把用户加到sudoers组",
            command: "sudo useradd -m -s /bin/bash dog",
            response: "User 'dog' created successfully!"
        },
        {
            command: "sudo passwd dog",
            handleInput: handlePasswordInput
        },
        {
            command: "sudo usermod -aG sudo dog",
            response: "恭喜你完成挑战!"
        }
    ];

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const command = input.value.trim();
            input.value = "";

            if (checkChallenge(command)) {
                displayResponse("$ " + command);
                if (challenges[currentChallenge].handleInput) {
                    challenges[currentChallenge].handleInput(command);
                } else {
                    displayResponse(challenges[currentChallenge].response);
                    currentChallenge++;
                    if (currentChallenge < challenges.length) {
                        displayGuide(challenges[currentChallenge].guide);
                    } else {
                        displayResponse("Congratulations! You have completed all challenges!");
                        input.disabled = true;
                    }
                }
            } else {
                displayResponse("$ " + command);
                displayResponse("Invalid command. Try again!");
            }
        }
    }

    function checkChallenge(command) {
        return command === challenges[currentChallenge].command;
    }

    function handlePasswordInput(command) {
        if (command.startsWith("sudo passwd")) {
            displayResponse("$ " + command);
            displayResponse("Enter new UNIX password:");
            input.removeEventListener("keydown", handleKeyPress);
            input.addEventListener("keydown", handlePasswordConfirmation);
        }
    }

    function handlePasswordConfirmation(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const password = input.value.trim();
            input.value = "";
            if (password !== "") {
                displayResponse("Retype new UNIX password:");
                input.removeEventListener("keydown", handlePasswordConfirmation);
                input.addEventListener("keydown", function handlePasswordConfirmation(event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        const confirmation = input.value.trim();
                        input.value = "";
                        if (confirmation === password) {
                            displayResponse("passwd: password updated successfully");
                            currentChallenge++;
                            if (currentChallenge < challenges.length) {
                                displayGuide(challenges[currentChallenge].guide);
                                input.removeEventListener("keydown", handlePasswordConfirmation);
                                input.addEventListener("keydown", handleKeyPress); // 添加回原来的事件处理函数
                            } else {
                                displayResponse("Congratulations! You have completed all challenges!");
                                input.disabled = true;
                            }
                        } else {
                            displayResponse("Sorry, passwords do not match. Try again!");
                            displayResponse("$ sudo passwd dog"); // 重新显示密码输入提示
                            input.value = ""; // 清空输入
                        }
                    }
                });
            }
        }
    }

    function displayGuide(guide) {
        displayResponse(guide);
    }

    function displayResponse(response) {
        const newLine = document.createElement("div");
        newLine.textContent = response;
        output.appendChild(newLine);
        output.scrollTop = output.scrollHeight;
    }

    // Display the guide for the first challenge when the page loads
    displayGuide(challenges[0].guide);
});
