import React from 'react';
import * as AppModel from './store/appReducer';
import * as Act from './store/actions';
import './App.css';

function App() {
  const [gameState, dispatch] = React.useReducer(
    AppModel.appReducer,
    AppModel.initialState,
    i => i
  );

  // Handle key press events at the document level
  React.useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.ctrlKey && ['z', 'Z', 'y', 'Y'].indexOf(ev.key) !== -1) {
        if (ev.key === 'z' || ev.key === 'Z') {
          dispatch(Act.createUndoAction());
        } else {
          dispatch(Act.createRedoAction());
        }
        return;
      }

      switch (ev.key) {
        case "ArrowLeft":
          dispatch(Act.createMoveCursorByCellAction(Act.Direction.Left));
          break;

        case "ArrowRight":
          dispatch(Act.createMoveCursorByCellAction(Act.Direction.Right));
          break;

        case "ArrowUp":
          dispatch(Act.createMoveCursorByCellAction(Act.Direction.Up));
          break;

        case "ArrowDown":
          dispatch(Act.createMoveCursorByCellAction(Act.Direction.Down));
          break;

        case "Insert":
          dispatch(ev.altKey ? Act.createInsertColumnAction() : Act.createInsertRowAction());
          break;

        case "Delete":
          dispatch(ev.altKey ? Act.createDeleteColumnAction() : Act.createDeleteRowAction());
          break;

        default:
          if (ev.key.length === 1) {
            dispatch(Act.createPutValueAction(ev.key));
          }
          break;
      }
    };

    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  return (
    <div className="App">
      <table className="grid">
        <tbody>
          { gameState.cells.map(
            (rowCells, row) =>
              <tr key={row}>
                { rowCells.map(
                    (value, column) =>
                      <td key={column}><div className={gameState.cursor.row === row && gameState.cursor.column === column ? "cell active" : "cell"}>{value}</div></td>
                )}
              </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
