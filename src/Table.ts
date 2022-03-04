import { Render } from ".";
import { ReElement, Reprop } from "./Decorators";

@ReElement
export class Table {

  constructor(private headers: any[], private rows: any[][]) {}

  @Reprop style() {
    return `
      background: red;
      border: 1px solid black;
    `
  };

  @Reprop onclick(event: Event) {
    console.log(event);
  }
  
  render() {
    console.log(this.props);
    return Render.table(
      Render.thead(this.headers.map(header =>
        Render.th(header).style('border: 1px solid black; font-weight: bold; background: green;')
      )),
      Render.tbody(this.rows.map(row =>
        Render.tr(row.map((cell: any) =>
          Render.td(cell).style('td {color: white}')
        ))
      ))
    );
  };
}