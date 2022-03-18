import { Render } from "../lib/Render";
import { Reelm } from "../lib/Decorators";

@Reelm.Component
class Table {

  @Reelm.Watch something: string = "Hello, World!";
  @Reelm.Watch foo: number = 123;
  @Reelm.WatchTwo bar: number = 0;

  constructor(private headers: any[], private rows: any[][]) {
    console.log(this);
    console.log(this.bar);
    this.foo = 456;
  }

  @Reelm.Prop style() {
    return `
      background: red;
      display: inline-block;
      border: 1px solid black;
    `
  }

  @Reelm.Prop onclick(event: Event) {
    // this.something = `Hello, ${Math.random()}`;
  }
  
  render() {
    console.log(this);
    return Render.div(
      Render.span(this.something),
      Render.input()
      .addEventListener('blur', (event: Event) => {
        // console.log((event.target as HTMLInputElement).value);
        console.log(this);
        this.something = (event.target as HTMLInputElement).value;
      })
      .repeatApply('setAttribute', [
        ['type', 'text'],
        ['placeholder', 'name']
      ]),
      Render.table(
        Render.thead(Th(this.headers)),
        Render.tbody(
          this.rows.map(row => (new Tr(row)).render())
        )
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