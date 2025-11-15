import {ArrowLeftCommand} from "./handler/commands/ArrowLeftCommand";
import {ArrowRightCommand} from "./handler/commands/ArrowRightCommand";
import {ArrowUpCommand} from "./handler/commands/ArrowUpCommand";
import {ArrowDownCommand} from "./handler/commands/ArrowDownCommand";
import {BackspaceCommand} from "./handler/commands/BackspaceCommand";
import {InsertNewLineCommand} from "./handler/commands/InsertNewLineCommand";
import {InsertTabCommand} from "./handler/commands/InsertTabCommand";
import {DocumentService} from "./DocumentService";
import {KeyCommand} from "./handler/KeyCommand";
import {ShiftArrowLeftCommand} from "./handler/commands/ShiftArrowLeftCommand";
import {ShiftArrowRightCommand} from "./handler/commands/ShiftArrowRightCommand";
import {ShiftArrowUpCommand} from "./handler/commands/ShiftArrowUpCommand";
import {ShiftArrowDownCommand} from "./handler/commands/ShiftArrowDownCommand";
import {ControlAll} from "./handler/commands/ControlAll";

type CommandConstructor = new (service: DocumentService) => KeyCommand;

const CommandRegistry: Record<string, CommandConstructor> = {
    "ArrowLeft": ArrowLeftCommand,
    "ArrowRight": ArrowRightCommand,
    "ArrowUp": ArrowUpCommand,
    "ArrowDown": ArrowDownCommand,
    "Ctrl+a": ControlAll,
    "Ctrl+A": ControlAll,
    "Shift+ArrowLeft": ShiftArrowLeftCommand,
    "Shift+ArrowRight": ShiftArrowRightCommand,
    "Shift+ArrowUp": ShiftArrowUpCommand,
    "Shift+ArrowDown": ShiftArrowDownCommand,
    "Backspace": BackspaceCommand,
    "Enter": InsertNewLineCommand,
    "Tab": InsertTabCommand
};

export function initializeCommands(service: DocumentService) {
    const commands: Record<string, KeyCommand> = {};
    for (const key in CommandRegistry) {
        const CommandClass = CommandRegistry[key];
        commands[key] = new CommandClass(service);
    }
    return commands;
}