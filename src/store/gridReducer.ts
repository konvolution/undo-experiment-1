import * as constants from "./constants";
import { Action, ActionType, ShiftDirection } from "./actions";
import { Cursor } from "./cursorReducer"

export type Cells = string[][];

export type Grid = {
    cursor: Cursor;
    cells: Cells;
};

const makeEmptyCells = () => Array.from({length: constants.GridRows}).map(_ => new Array(constants.GridColumns).fill(''));

function putValue(cells: Cells, loc: Cursor, value: string): Cells {
    const { row, column } = loc;
    const changeRow = cells[row];
    return [
        ...cells.slice(0, row),
        [
            ...changeRow.slice(0, column),
            value,
            ...changeRow.slice(column + 1)
        ],
        ...cells.slice(row + 1)
    ];
}

function insertCellShiftRight(cells: Cells, loc: Cursor): Cells {
    const { row, column } = loc;
    const changeRow = cells[row];
    return [
        ...cells.slice(0, row),
        [
            ...changeRow.slice(0, column),
            '',
            ...changeRow.slice(column, changeRow.length - 1)
        ],
        ...cells.slice(row + 1)
    ];
}

function insertCellShiftDown(cells: Cells, loc: Cursor): Cells {
    // Make shallow copy of original cells
    const result = [...cells];

    const { row, column } = loc;

    let newValue = '';
    for (let r = row; r < cells.length; ++r) {
        const changeRow = cells[r];

        result[r] = [ 
            ...changeRow.slice(0, column),
            newValue,
            ...changeRow.slice(column, changeRow.length - 1)
        ];

        newValue = changeRow[column];
    }

    return result;
}

function insertRow(cells: Cells, row: number): Cells {
    return [
        ...cells.slice(0, row),
        new Array(constants.GridColumns).fill(''),
        ...cells.slice(row, cells.length - 1)
    ];
}

function insertColumn(cells: Cells, column: number): Cells {
    return cells.map(row => [...row.slice(0, column), '', ...row.slice(column, row.length - 1)]);
}

function deleteCellShiftLeft(cells: Cells, loc: Cursor): Cells {
    const { row, column } = loc;
    const changeRow = cells[row];
    return [
        ...cells.slice(0, row),
        [
            ...changeRow.slice(0, column),
            ...changeRow.slice(column + 1, changeRow.length),
            ''
        ],
        ...cells.slice(row + 1)
    ];
}

function deleteCellShiftUp(cells: Cells, loc: Cursor): Cells {
    // Make shallow copy of original cells
    const result = [...cells];

    const { row, column } = loc;

    let newValue = '';
    for (let r = cells.length - 1; r > row; --r) {
        const changeRow = cells[r];

        result[r] = [ 
            ...changeRow.slice(0, column),
            newValue,
            ...changeRow.slice(column, changeRow.length - 1)
        ];

        newValue = changeRow[column];
    }

    return result;
}

function deleteRow(cells: Cells, row: number): Cells {
    return [
        ...cells.slice(0, row),
        ...cells.slice(row + 1, cells.length),
        new Array(constants.GridColumns).fill('')
    ];
}

function deleteColumn(cells: Cells, column: number): Cells {
    return cells.map(row => [...row.slice(0, column), ...row.slice(column + 1, row.length), '']);
}

export const initialGrid: Grid = {
    cursor: { row: 0, column: 0},
    cells: [
        [ '',  '',  '',  '',  '',  '',  '',  '',  '',  ''],
        [ '',  '',  '',  '',  '',  '',  '',  '',  '',  ''],
        [ '',  '',  '',  '', 'o', 'o',  '',  '',  '',  ''],
        [ '',  '',  '', 'o',  '',  '', 'o',  '',  '',  ''],
        [ '',  '', 'o', 'o',  '',  '', 'o', 'o',  '',  ''],
        [ '',  '', 'O',  '',  '',  '',  '', 'O',  '',  ''],
        [ '', 'O', 'O',  '',  '',  '',  '', 'O', 'O',  ''],
        [ '', 'O', 'O', 'O',  '',  '', 'O', 'O', 'O',  ''],
        [ '',  '',  '',  '', 'O', 'O',  '',  '',  '',  ''],
        [ '',  '',  '',  '',  '',  '',  '',  '',  '',  ''],  
    ]
};

export function gridReducer(state: Grid, action: Action): Grid {
    switch(action.type) {
        case ActionType.ClearGrid:
            return {
                ...state,
                cells: initialGrid.cells 
            };

        case ActionType.PutValue:
            return {
                ...state,
                cells: putValue(state.cells, state.cursor, action.value)
            };

        case ActionType.InsertCell: {
            const insertOperation = action.shiftDirection === ShiftDirection.Horizontal ? insertCellShiftRight : insertCellShiftDown;

            return {
                ...state,
                cells: insertOperation(state.cells, state.cursor)
            };
        }

        case ActionType.InsertRow:
            return {
                ...state,
                cells: insertRow(state.cells, state.cursor.row)
            };

        case ActionType.InsertColumn:
            return {
                ...state,
                cells: insertColumn(state.cells, state.cursor.column)
            };

        case ActionType.DeleteCell: {
            const deleteOperation = action.shiftDirection === ShiftDirection.Horizontal ? deleteCellShiftLeft : deleteCellShiftUp;

            return {
                ...state,
                cells: deleteOperation(state.cells, state.cursor)
            };
        }

        case ActionType.DeleteRow:
            return {
                ...state,
                cells: deleteRow(state.cells, state.cursor.row)
            };

        case ActionType.DeleteColumn:   
            return {
                ...state,
                cells: deleteColumn(state.cells, state.cursor.column)
            };
    }

    return state;
}
