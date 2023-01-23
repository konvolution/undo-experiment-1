export const ActionType = {
    ClearGrid: "ClearGrid", // Clear the grid
    MoveCursorByCell: "MoveCursorByCell",
    MoveCursorToEdge: "MoveCursorToEdge",
    PutValue: "PutValue",
    InsertCell: "InsertCell",
    InsertRow: "InsertRow",
    InsertColumn: "InsertColumn",
    DeleteCell: "DeleteCell",
    DeleteRow: "DeleteRow",
    DeleteColumn: "DeleteColumn",
    Undo: "Undo",
    Redo: "Redo"
} as const;

export type ActionType = typeof ActionType[keyof typeof ActionType];

export const Direction = {
    Right: "Right",
    Down: "Down",
    Left: "Left",
    Up: "Up",
} as const;

export type Direction = typeof Direction[keyof typeof Direction];

export const ShiftDirection = {
  Horizontal: "Horizontal",
  Vertical: "Vertical",
} as const;

export type ShiftDirection = typeof ShiftDirection[keyof typeof ShiftDirection];
  
export interface ActionBase {
    type: ActionType;
}

export interface ActionClearGrid extends ActionBase {
  type: typeof ActionType.ClearGrid;
}

export interface ActionMoveCursorByCell extends ActionBase {
    type: typeof ActionType.MoveCursorByCell;
    direction: Direction;
}

export interface ActionMoveCursorToEdge extends ActionBase {
    type: typeof ActionType.MoveCursorToEdge;
    direction: Direction;
}

export interface ActionPutValue extends ActionBase {
  type: typeof ActionType.PutValue;
  value: string;
}

export interface ActionInsertCell extends ActionBase {
  type: typeof ActionType.InsertCell;
  shiftDirection: ShiftDirection;
}

export interface ActionInsertRow extends ActionBase {
  type: typeof ActionType.InsertRow;
}

export interface ActionInsertColumn extends ActionBase {
  type: typeof ActionType.InsertColumn;
}

export interface ActionDeleteCell extends ActionBase {
  type: typeof ActionType.DeleteCell;
  shiftDirection: ShiftDirection;
}

export interface ActionDeleteRow extends ActionBase {
  type: typeof ActionType.DeleteRow;
}

export interface ActionDeleteColumn extends ActionBase {
  type: typeof ActionType.DeleteColumn;
}

export interface ActionUndo extends ActionBase {
  type: typeof ActionType.Undo;
}

export interface ActionRedo extends ActionBase {
  type: typeof ActionType.Redo;
}

export type Action =
| ActionClearGrid
| ActionMoveCursorByCell
| ActionMoveCursorToEdge
| ActionPutValue
| ActionInsertCell
| ActionInsertRow
| ActionInsertColumn
| ActionDeleteCell
| ActionDeleteRow
| ActionDeleteColumn
| ActionUndo
| ActionRedo;

export function createClearGridAction(): ActionClearGrid {
  return {
    type: ActionType.ClearGrid
  };
}

export function createMoveCursorByCellAction(direction: Direction): ActionMoveCursorByCell {
  return {
    type: ActionType.MoveCursorByCell,
    direction
  };
}

export function createMoveCursorToEdgeAction(direction: Direction): ActionMoveCursorToEdge {
  return {
    type: ActionType.MoveCursorToEdge,
    direction
  };
}

export function createPutValueAction(value: string): ActionPutValue {
  return {
    type: ActionType.PutValue,
    value
  };
}

export function createInsertCellAction(shiftDirection: ShiftDirection): ActionInsertCell {
  return {
    type: ActionType.InsertCell,
    shiftDirection
  };
}

export function createInsertRowAction(): ActionInsertRow {
  return {
    type: ActionType.InsertRow
  };
}

export function createInsertColumnAction(): ActionInsertColumn {
  return {
    type: ActionType.InsertColumn
  };
}

export function createDeleteCellAction(shiftDirection: ShiftDirection): ActionDeleteCell {
  return {
    type: ActionType.DeleteCell,
    shiftDirection
  };
}

export function createDeleteRowAction(): ActionDeleteRow {
  return {
    type: ActionType.DeleteRow
  };
}

export function createDeleteColumnAction(): ActionDeleteColumn {
  return {
    type: ActionType.DeleteColumn
  };
}

export function createUndoAction(): ActionUndo {
  return {
    type: ActionType.Undo
  };
}

export function createRedoAction(): ActionRedo {
  return {
    type: ActionType.Redo
  };
}

/*

  ··········
  ··········
  ····oo····
  ···o··o···
  ··oo··oo··
  ··O····O··
  ·OO····OO·
  ·OOO··OOO·
  ····OO····
  ··········  
{
  undo: [],
  redo: []
}  
---------------------------------

PUT(X @ 4,3)

  ··········
  ··········
  ····oo····
  ···o··o···
  ··oX··oo··
  ··O····O··
  ·OO····OO·
  ·OOO··OOO·
  ····OO····
  ··········  
{
  undo: [PUT(o @ 4,3)],
  redo: []
}  
---------------------------------

INSERTCOL(3)

  ··········
  ··········
  ·····oo···
  ····o··o··
  ··o·X··oo·
  ··O·····O·
  ·OO·····OO
  ·OO·O··OOO
  ·····OO···
  ··········  
{
  undo: [PUT(o @ 4,3), DELETECOL(3)],
  redo: []
}  
---------------------------------


INSERTCOL(3)

  ··········
  ··········
  ······oo··
  ·····o··o·
  ··o··X··oo
  ··O······O
  ·OO······O
  ·OO··O··OO
  ······OO··
  ··········
{
  undo: [PUT(o @ 4,3), DELETECOL(3), DELETECOL(3, lastColumn: ······OO··)],
  undoIndex: 3,
  redo: []
}  
---------------------------------
  
UNDO

  ··········
  ··········
  ·····oo···
  ····o··o··
  ··o·X··oo·
  ··O·····O·
  ·OO·····OO
  ·OO·O··OOO
  ·····OO···
  ··········
{
  undo: [PUT(o @ 4,3), DELETECOL(3), DELETECOL(3, lastColumn: ······OO··)],
  redo: [INSERTCOL(3)]
}  
---------------------------------
  
UNDO

  ··········
  ··········
  ····oo····
  ···o··o···
  ··oX··oo··
  ··O····O··
  ·OO····OO·
  ·OOO··OOO·
  ····OO····
  ··········  
{
  undo: [PUT(o @ 4,3), DELETECOL(3), DELETECOL(3, lastColumn: ······OO··)],
  redo: [INSERTCOL(3), INSERTCOL(3)]
}  
---------------------------------

PUT(A @ 4,3)

  ··········
  ··········
  ····oo····
  ···o··o···
  ··oA··oo··
  ··O····O··
  ·OO····OO·
  ·OOO··OOO·
  ····OO····
  ··········  
{
  undo: [PUT(o @ 4,3), DELETECOL(3), DELETECOL(3, lastColumn: ······OO··), [INSERTCOL(3), INSERTCOL(3)], PUT(X @ 4,3)],
  redo: []
}  
---------------------------------




  ··········
  ··········
  ····oo····
  ···o··o···
  ··oX··oo··
  ··O····O··
  ·OO····OO·
  ·OOO··OOO·
  ····OO····
  ··········  

*/
