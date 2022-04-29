import { Render, Reelm } from '../lib';

interface Item {
  value: string;
  done: boolean;
}

@Reelm.Component
export class Todo {

  @Reelm.Watch private items: Item[] = new Array<Item>(
    {done: true, value: '123'}, {done: false, value: '456'},
  );
  @Reelm.Watch private inputValue: string = '';

  private toggleTodoItem(item: Item) {
    item.done = !item.done;
  }

  private makeListItem(item: Item) {
    return Render.label(
        Render.input().repeatApply('setAttribute', [
          ['type', 'checkbox'],
          ['checked', item.done]
        ]),
        Render.input().setAttribute('value', item.value)
      ).addEventListener('click', this.toggleTodoItem.bind(this, item));
  }

  private addTodoItem(event: Event & {submitter: HTMLInputElement}) {
    event.preventDefault();
    this.items.push({
      done: false,
      value: (this.inputValue as any).value,
    });
    console.log(this.items);
  }

  private changeInputValue(event: KeyboardEvent) {
    this.inputValue = (event.target as HTMLInputElement).value;
  }

  render() {
    return (
      Render.div(
        Render.form(
          Render.input().repeatApply('setAttribute', [
            ['placeholder', 'Please enter todo item...'],
            ['type', 'text'],
            ['value', (this.inputValue as any).value]
          ]).addEventListener('keyup', this.changeInputValue.bind(this)),
        ).addEventListener('submit', this.addTodoItem.bind(this)),
        Render.span(this.inputValue),
        // Render.span(this.items.map(item => item.value)),
        Render.div(
          // Pending items
          this.items.filter((item: Item) => !item.done).map((item: Item) => (
            this.makeListItem(item)
          ))
        ),
        Render.hr(),
        Render.p(
          // Done items
          this.items.filter((item: Item) => true).map((item: Item) => (
            this.makeListItem(item)
          ))
        )
      )
    );
  }
}