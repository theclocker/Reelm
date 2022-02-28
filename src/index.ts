import { Render } from './Render';

function getDiv(rows: Array<any>) {
  return Render.div(rows).element;
}

function getTable(headers: Array<any>, rows: Array<any>) {
  return Render.table(
    Render.thead(headers, Render.th.style('font-weight: bold')).style('background: royalblue'),
    Render.tbody(rows.map(cells => Render.tr(cells, Render.td)))
  ).style('background: red').setAttribute('something', 'bla')
  .addEventListener('click', () => {
    console.log(123);
  }).element;
}

export {Render, getTable, getDiv};
