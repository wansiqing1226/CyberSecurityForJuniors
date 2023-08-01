
function executeCommand(command) {
  switch (command) {
    case "whoami":
      return "user123\n";
    case "ls":
      return "file1.txt\nfile2.txt\nfolder1\nfolder2\n";
    case "pwd":
      return "/home/user123\n";
    // Add more cases for other commands...
    default:
      return "Command not found: " + command + "\n";
  }
}

