document.addEventListener("DOMContentLoaded", function() {
    const output = document.getElementById("output");
    const input = document.getElementById("input");
    input.addEventListener("keydown", handleKeyPress);

    let currentChallenge = 0;
    const challenges = [
        {
            guide: "\n\n挑战2: 文件管理\n\n创建一个名为 \"newdir\" 的新目录，\n\n并在该目录中创建三个新文件 \"file1.txt\"、\"file2.txt\" 和 \"file3.txt\"。\n\n然后，将 \"file1.txt\" 移动到 \"newdir\" 目录中，\n\n并将 \"file3.txt\" 复制到 \"newdir\" 目录中。",
            command: "mkdir newdir",
            response: "Directory created successfully!"
        },
        {
            command: "touch file1.txt file2.txt file3.txt",
            response: "Files created successfully!"
        },
        {
            command: "mv file1.txt file2.txt newdir/",
            response: "恭喜你完成挑战!"
        },
        {
            command: "cp file3.txt newdir/",
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
                displayResponse(challenges[currentChallenge].response);
                currentChallenge++;
                if (currentChallenge < challenges.length) {
                    displayGuide(challenges[currentChallenge].guide);
                } else {
                    displayResponse("Congratulations! You have completed all challenges!");
                    input.disabled = true;
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
