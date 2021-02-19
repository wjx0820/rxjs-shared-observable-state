import { fromEvent } from "rxjs";
import {
  mapTo,
  scan,
  share,
  startWith,
  distinctUntilChanged,
  shareReplay
} from "rxjs/operators";

const emissions = fromEvent(emitButton, "click").pipe(mapTo(1));

const source = emissions.pipe(
  scan((total, current) => total + current),
  // share()
  // shareReplay(1)  / 内存泄漏危机
  shareReplay({ bufferSize: 1, refCount: true })
);

let subsOne = source.subscribe(x => console.log("ONE >> " + x));

let subsTwo;

document.getElementById("subscribe").addEventListener("click", () => {
  console.log("第二个subscriber添加了");
  subsTwo = source.subscribe(x => console.log("TWO >> " + x));
});

destroyAllButton.addEventListener("click", () => {
  console.log("UNSUBSCRIBED!!!!!");
  subsOne.unsubscribe();
  subsTwo.unsubscribe();
});
