import { Render } from './lib/Render';
import { Table } from './examples/Table';

(Object.prototype as any).repeatApply = function(functionName: string, functionArguments: any[][]) {
  functionArguments.forEach((value) => {
    this[functionName](...value);
  });
  return this;
};

function getDiv(rows: Array<any>) {
  return Render.div(rows).style(
    `div > div {
      border: 1px solid black;
      margin-bottom: 2px;
    }
    div > div:nth-child(1) div > div {
      border: 1px solid black;
      margin: 2px;
    }
    div > div > div div  {
      box-sizing: border-box;
      padding-left: 15px;
    }`
  ).element;
}

function getTable(headers: Array<any>, rows: Array<any>) {
  return Render.table(
    Render.thead(headers.map(header =>
      Render.th(header).style('border: 1px solid black; font-weight: bold; background: green;')
    )),
    Render.tbody(rows.map(row =>
      Render.tr(row.map((cell: any) =>
        Render.td(cell).style('td {color: white}')
      ))
    ))
  ).style(`
      background: red;
      border: 1px solid black;
  `)
  .addEventListener('click', () => {
    console.log(123);
  }).element;
}

const headers = ["Name", "Age", "School"];

const rows = [
  ["Harry Potter", "18", "Hogwarts"],
  ["Izuku Midoriya", "16", "UA High"],
  ["Yonatan Vega", "24", "College of Management"],
];

export const table = new Table(headers, rows).render();

export {Render, getTable, getDiv};
