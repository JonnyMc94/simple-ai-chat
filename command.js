
import help from "./commands/help.js";
import stream from "./commands/stream.js";
import entry from "./commands/entry.js";

export default function commands(input) {
  let command = input;
  let args = [];
  
  if (input.indexOf(' ') !== -1) {
    // Has arguments
    command = input.substring(0, input.indexOf(' '));
    args = extractArgs(input.substring(input.indexOf(' ') + 1));
  }
  
  if (command.startsWith(":help")) return help(args);
  if (command.startsWith(":entry")) return entry(args);
  if (command.startsWith(":stream")) return stream(args);
  return "Unknown command.";
}

function extractArgs(input) {
  let regex = /\b\w+\b|"[^"]*"/g;
  let match;
  let matchList = [];
  while ((match = regex.exec(input)) !== null) {
    if (match[1] != null) {
        // Add double-quoted string without the quotes
        matchList.push(match[1]);
    } else if (match[2] != null) {
        // Add single-quoted string without the quotes
        matchList.push(match[2]);
    } else {
        // Add unquoted word
        matchList.push(match[0]);
    }
  }
  return matchList;
}