import { Render, Reelm } from '../lib';

interface Item {
  value: string;
  done: boolean;
}

@Reelm.Component
export class Todo {

  @Reelm.Watch private items: Item[] = new Array<Item>();
  @Reelm.Watch private inputValue: string = '';

  private toggleTodoItem(item: Item) {
    item.done = !item.done;
  }

  private makeListItem(item: Item) {
    return Render.div(
      Render.label(
        Render.input().repeatApply('setAttribute', [
          ['type', 'checkbox'],
          ['checked', item.done]
        ]),
        Render.div(item.value)
      ).addEventListener('click', this.toggleTodoItem.bind(this, item))
    );
  }

  private addTodoItem(event: Event & {submitter: HTMLInputElement}) {
    event.preventDefault();
    this.items.push({
      value: (this.inputValue as any).value,
      done: false,
    });
    (this.items as any).triggerChange();
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
        Render.div(this.items.map(item => item.value)),
        Render.div(
          // Pending items
          this.items.filter((item: Item) => !item.done).map((item: Item) => (
            this.makeListItem(item)
          ))
        ).listen(this.items),
        Render.hr(),
        Render.div(
          // Done items
          this.items.filter((item: Item) => item.done).map((item: Item) => (
            this.makeListItem(item)
          ))
        )
      )
    );
  }
}