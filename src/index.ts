import { Render } from './Render';

function getDiv(rows: Array<any>) {
  return Render.div(rows).element;
}

function getTable(headers: Array<any>, rows: Array<any>) {
  return Render.table(
    Render.thead(headers, Render.th),
    Render.tbody(rows.map(cells => Render.tr(cells, Render.td)))
  ).style('background: red').element;
}

export {Render, getTable, getDiv};
