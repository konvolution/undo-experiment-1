import * as Act from "./actions";
import { Action, ActionType } from "./actions";
import { Grid } from "./gridReducer";

// First implementation will be 
export type UndoState = {
    undoStack: Grid[],
    redoStack: Grid[]
};

export function notImplemented() {
    return new Error("Not implemented.");    
}

// Returns true if action leads to a mutation that is undoable
export function isUndoableAction(action: Action): boolean {
    switch (action.type) {
        case ActionType.ClearGrid:
        case ActionType.PutValue:
        case ActionType.InsertCell:
        case ActionType.InsertRow:
        case ActionType.InsertColumn:
        case ActionType.DeleteCell:
        case ActionType.DeleteRow:
        case ActionType.DeleteColumn:
            return true;
    }

    return false;
}

// Function calculates how to undo a specific action, given the current state
// function calculateUndoActions(state: Grid, action: Action): Action[] {
//     switch (action.type) {
//         case ActionType.ClearGrid:
//             throw notImplemented();

//         case ActionType.InsertRow: {
//             return [
//                 Act.createMoveCursorAction(state.cursor),
//                 Act.createDeleteRowAction(),
//                 Act.createFillLastRowAction()
//             ];
//         }
//     }
    
//     // Not all actions are undoable
//     return [];
// }