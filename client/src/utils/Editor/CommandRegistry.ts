import {ArrowLeftCommand} from "./handler/commands/ArrowLeftCommand";
import {ArrowRightCommand} from "./handler/commands/ArrowRightCommand";
import {ArrowUpCommand} from "./handler/commands/ArrowUpCommand";
import {ArrowDownCommand} from "./handler/commands/ArrowDownCommand";
import {BackspaceCommand} from "./handler/commands/BackspaceCommand";
import {InsertNewLineCommand} from "./handler/commands/InsertNewLineCommand";
import {InsertTabCommand} from "./handler/commands/InsertTabCommand";
import {KeyCommand} from "./handler/KeyCommand";
import {ShiftArrowLeftCommand} from "./handler/commands/ShiftArrowLeftCommand";
import {ShiftArrowRightCommand} from "./handler/commands/ShiftArrowRightCommand";
import {ShiftArrowUpCommand} from "./handler/commands/ShiftArrowUpCommand";
import {ShiftArrowDownCommand} from "./handler/commands/ShiftArrowDownCommand";
import {CtrlAll} from "./handler/commands/CtrlAll";
import {CtrlArrowLeftCommand} from "./handler/commands/CtrlArrowLeftCommand";
import {CtrlArrowRightCommand} from "./handler/commands/CtrlArrowRightCommand";
import {CtrlBackspaceCommand} from "./handler/commands/CtrlBackspaceCommand";
import {CtrlZCommand} from "./handler/commands/CtrlZCommand";
import {CtrlYCommand} from "./handler/commands/CtrlYCommand";
import {LayoutEngine} from "./ServiceClasses/LayoutEngine";
import {TextController} from "./ServiceClasses/TextController";
import {InputController} from "./ServiceClasses/InputController";
import {CursorOperation} from "./ServiceClasses/CursorOperation";
import {DeleteCommand} from "./handler/commands/DeleteCommand";
import {CtrlDeleteCommand} from "./handler/commands/CtrlDeleteCommand";

type CommandConstructor = new (inputController: InputController, layout: LayoutEngine, textController: TextController, cursorOperation: CursorOperation) => KeyCommand;

const CommandRegistry: Record<string, CommandConstructor> = {
    "ArrowLeft": ArrowLeftCommand,
    "ArrowRight": ArrowRightCommand,
    "ArrowUp": ArrowUpCommand,
    "ArrowDown": ArrowDownCommand,
    "Backspace": BackspaceCommand,
    "Delete": DeleteCommand,
    "Enter": InsertNewLineCommand,
    "Tab": InsertTabCommand,

    "ctrl+z": CtrlZCommand,
    "ctrl+shift+z": CtrlYCommand,
    "ctrl+y": CtrlYCommand,
    "ctrl+a": CtrlAll,
    "ctrl+Backspace": CtrlBackspaceCommand,
    "ctrl+Delete": CtrlDeleteCommand,
    "ctrl+ArrowLeft": CtrlArrowLeftCommand,
    "ctrl+ArrowRight": CtrlArrowRightCommand,
    "shift+ArrowLeft": ShiftArrowLeftCommand,
    "shift+ArrowRight": ShiftArrowRightCommand,
    "shift+ArrowUp": ShiftArrowUpCommand,
    "shift+ArrowDown": ShiftArrowDownCommand,
};

export function initializeCommands(inputController: InputController, layout: LayoutEngine, textController: TextController, cursorOperation: CursorOperation) {
    const commands: Record<string, KeyCommand> = {};
    for (const key in CommandRegistry) {
        const CommandClass = CommandRegistry[key];
        commands[key] = new CommandClass(inputController, layout, textController, cursorOperation);
    }
    return commands;
}