import * as Act from "./actions";
import { cursorReducer } from "./cursorReducer";
import { Grid, gridReducer, initialGrid } from "./gridReducer";
import { isUndoableAction, UndoState } from "./undoReducer";

export type AppState = Grid & UndoState;

export const initialState: AppState = {
    ...initialGrid,
    undoStack: [],
    redoStack: []
};

export function appReducer(state: AppState, action: Act.Action): AppState {
    switch (action.type) {
        case Act.ActionType.Undo:
            if (state.undoStack.length > 0) {
                const { cursor, cells } = state;
                const currentState = { cursor, cells };

                return {
                    // Original state
                    ...state,
                    // last item on undo stack becomes the current grid state
                    ...state.undoStack[state.undoStack.length - 1],
                    // take last item from the undo stack
                    undoStack: state.undoStack.slice(0, state.undoStack.length - 1),
                    // push the current state onto the redo stack
                    redoStack: [...state.redoStack, currentState]
                };
            }
            break;

        case Act.ActionType.Redo:
            if (state.redoStack.length > 0) {
                const { cursor, cells } = state;
                const currentState = { cursor, cells };

                return {
                    // Original state
                    ...state,
                    // last item on redo stack becomes the current grid state
                    ...state.redoStack[state.redoStack.length - 1],
                    // push the current state onto the undo stack
                    undoStack: [...state.undoStack, currentState],
                    // take last item from the redo stack
                    redoStack: state.redoStack.slice(0, state.redoStack.length - 1)
                };
            }
            break;

        default: {
            // If undoable action, the push the current state unto the undo stack before
            // performing the action
            if (isUndoableAction(action)) {
                const { cursor, cells } = state;
                const currentState = { cursor, cells };

                if (state.redoStack.length > 0) {
                    state = {
                        ...state,
                        undoStack: [
                            ...state.undoStack, 
                            currentState,
                            ...[...state.redoStack].reverse(),
                            currentState],
                        redoStack: []
                    }
                } else {
                    state = {
                        ...state,
                        undoStack: [
                            ...state.undoStack,
                            currentState
                        ],
                        redoStack: []
                    };
                }
            }

            return {
                ...state,
                ...gridReducer({
                    ...state,
                    cursor: cursorReducer(state.cursor, action)
                }, action)
            };
        }
    }

    return state;
}

    