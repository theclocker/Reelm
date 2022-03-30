import { Render } from "../lib/Render";
import { Reelm } from "../lib/Decorators";

@Reelm.Component
class Table {

  @Reelm.Watch something: string = "Hello, World!";
  @Reelm.Watch foo: number = 123;

  constructor(private headers: any[], private rows: any[][]) {
    // console.log(this.foo);
  }

  @Reelm.Prop style() {
    return `
      background: red;
      display: inline-block;
      border: 1px solid black;
    `
  }

  @Reelm.Prop onclick(event: Event) {
    // this.bar = Math.random();
    // this.something = `Hello, ${Math.random()}`;
  }

  private onInputChange(event: Event) {
    this.something = (event.target as HTMLInputElement).value;
  }

  private getRandomHeader() {
    this.foo = Math.random();
  }
  
  render() {
    return Render.div(
      Render.div(this.foo).addEventListener('click', this.getRandomHeader.bind(this)),
      Render.div(this.something),
      Render.input().setAttribute('value', this.something).addEventListener('keyup', this.onInputChange.bind(this))
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