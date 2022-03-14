import { Render } from "../lib/Render";
import { Reelm } from "../lib/Decorators";

@Reelm.Component
class Table {

  constructor(private headers: any[], private rows: any[][]) {}

  @Reelm.Prop style() {
    return `
      background: red;
      border: 1px solid black;
    `
  }

  @Reelm.Prop onclick(event: Event) {
    console.log(event);
  }
  
  render() {
    return Render.table(
      Render.thead(Th(this.headers)),
      Render.tbody(
        this.rows.map(row => new Tr(row))
      )
    );
  }
}

const Th = (headers: Array<string>) => headers.map(header =>
  Render.th(header).style('border: 1px solid black; font-weight: bold; background: green;')
)

@Reelm.Component
class Tr {
  constructor(private row: string[]) {}

  render() {
    return Render.tr(this.row.map((cell: any) =>
      Render.td(cell).style('td {color: white}')
    ));
  }
}

export { Table };