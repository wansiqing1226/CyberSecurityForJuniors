document.addEventListener("DOMContentLoaded", function() {
    const output = document.getElementById("output");
    const input = document.getElementById("input");
    input.addEventListener("keydown", handleKeyPress);

    // 创建两个目录
    const currentDir = {
        name: "currentDir",
        files: []
    };

    const newDir = {
        name: "newdir",
        files: []
    };

    let currentDirectory = currentDir;

    const challenges = [
        {
            guide: "\n\n挑战2: 文件管理\n\n创建一个名为 \"newdir\" 的新目录，\n\n并在该目录中创建三个新文件 \"file1.txt\"、\"file2.txt\" 和 \"file3.txt\"。\n\n然后，将 \"file1.txt\" 移动到 \"newdir\" 目录中，\n\n并将 \"file3.txt\" 复制到 \"newdir\" 目录中。",
            command: "mkdir newdir",
            response: "Directory created successfully!"
        }
    ];

    let lastCommand = ""; // 添加一个变量来记录上次执行的命令

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const command = input.value.trim();
            input.value = "";

            displayResponse("$ " + command); // 显示用户输入的命令

            handleCommand(command);
        }
    }

    function handleCommand(command) {
        const parts = command.split(" ");
        const commandName = parts[0];

        switch (commandName) {
            case "cd":
                const directoryName = parts[1];
                cdCommand(directoryName);
                break;
            case "ls":
                lsCommand();
                break;
            case "touch":
                const fileNames = parts.slice(1);
                touchCommand(fileNames);
                break;
            case "mv":
                const sourceFileName = parts[1];
                const targetFileName = parts[2];
                mvCommand(sourceFileName, targetFileName);
                break;
            case "cp":
                const sourceFile = parts[1];
                const targetDirectory = parts[2];
                cpCommand(sourceFile, targetDirectory);
                break;
            default:
                if (checkChallenge(command)) {
                    displayResponse(challenges[currentChallenge].response);
                    currentChallenge++;
                    if (currentChallenge < challenges.length) {
                        displayGuide(challenges[currentChallenge].guide);
                    } else {
                        displayResponse("Congratulations! You have completed all challenges!");
                        input.disabled = true;
                    }
                } else {
                    displayResponse("Invalid command. Try again!");
                }
                break;
        }

        lastCommand = command; // 记录上次执行的命令
    }

    function cdCommand(directoryName) {
        if (directoryName === "newdir") {
            currentDirectory = newDir;
            displayResponse("Switched to 'newdir'");
        } else if (directoryName === "currentDir") {
            currentDirectory = currentDir;
            displayResponse("Switched to 'currentDir'");
        }  else if (directoryName === "..") {
            // 返回上一级目录
            if (currentDirectory === newDir) {
                currentDirectory = currentDir;
            } else {
                displayResponse("Already at the root directory.");
            }
        } else {
            displayResponse(`Directory '${directoryName}' not found.`);
        }
    }

    function lsCommand() {
        const filesList = currentDirectory.files.map(file => file.name);
        if (filesList.length === 0) {
            displayResponse("No files in the current directory.");
        } else {
            displayResponse("Files in the current directory:");
            displayResponse(filesList.join(" "));
        }
    }

    function touchCommand(fileNames) {
        fileNames.forEach(fileName => {
            const file = { name: fileName };
            currentDirectory.files.push(file);
        });
        displayResponse("Files created successfully!");
    }

    function mvCommand(sourceFileName, targetFileName) {
        const sourceFile = currentDirectory.files.find(file => file.name === sourceFileName);
        if (!sourceFile) {
            displayResponse(`File '${sourceFileName}' not found.`);
            return;
        }

        const targetFile = { name: targetFileName };
        currentDirectory.files.push(targetFile);

        // Remove the source file from the current directory
        const index = currentDirectory.files.indexOf(sourceFile);
        if (index !== -1) {
            currentDirectory.files.splice(index, 1);
            displayResponse("Files moved successfully~");
        } else {
            displayResponse(`Error moving file '${sourceFileName}'.`);
        }
    }

    function cpCommand(sourceFileName, targetDirectoryName) {
        const sourceFile = currentDirectory.files.find(file => file.name === sourceFileName);
        if (!sourceFile) {
            displayResponse(`File '${sourceFileName}' not found.`);
            return;
        }

        const targetDirectory = currentDirectory.name === targetDirectoryName ? currentDirectory : newDir;
        const targetFile = { name: sourceFile.name };
        targetDirectory.files.push(targetFile);
        displayResponse("File copied successfully!");
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
        input.scrollIntoView(); // 自动滚动到输入框

        if (response.startsWith("$")) {
            // 如果是用户输入的命令，则不再显示
            lastCommand = response.substr(2).trim();
            return;
        }
    }

    // Display the guide for the first challenge when the page loads
    displayGuide(challenges[0].guide);
});
