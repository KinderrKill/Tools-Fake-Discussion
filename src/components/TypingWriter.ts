type QueueItem = () => Promise<void>;

export default class TypingWriter {
  private queue: QueueItem[] = [];
  private parentElement: HTMLElement;
  private element: HTMLElement;
  typingSpeed: number;
  deletingSpeed: number;

  private notifParentActiveState: (param: boolean) => void;

  constructor(parentElement: HTMLElement, notifParentActiveState: (param: boolean) => void) {
    this.parentElement = parentElement;
    this.element = document.createElement('p');
    this.element.classList.add('right-panel');
    this.typingSpeed = 50;
    this.deletingSpeed = 30;

    this.notifParentActiveState = notifParentActiveState;
  }

  type(string: string, speed: number = this.typingSpeed) {
    this.addToQueue((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        this.element.append(string[index]);
        index++;

        if (index >= string.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });

    return this;
  }

  pauseFor(duration: number) {
    this.addToQueue((resolve) => {
      setTimeout(resolve, duration);
    });

    return this;
  }

  deleteChar(count: number, speed: number = this.deletingSpeed) {
    this.addToQueue((resolve) => {
      const interval = setInterval(() => {
        let text = this.element.innerText;
        this.element.innerText = text.substring(0, text.length - 1);
        count--;

        if (this.element.innerText.length === 0 || count === 0) {
          if (this.element.innerText.length === 0) this.element.innerText = ' ';
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });

    return this;
  }

  deleteAll(speed?: number) {
    let count = this.element.innerText.length;
    this.addToQueue((resolve) => {
      const interval = setInterval(() => {
        let text = this.element.innerText;
        this.element.innerText = text.substring(0, text.length - 1);
        count--;

        if (this.element.innerText.length === 0 || count === 0) {
          this.parentElement.removeChild(this.element);
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
    return this;
  }

  newBubble(leftSide: boolean) {
    this.addToQueue((resolve) => {
      this.element = document.createElement('p');
      this.element.classList.add(leftSide ? 'left-panel' : 'right-panel');
      this.parentElement.append(this.element);

      resolve();
    });

    return this;
  }

  async start(startLeftSide?: boolean, shouldLoop?: boolean) {
    this.element.classList.add(startLeftSide ? 'left-panel' : 'right-panel');

    this.parentElement.append(this.element);

    let callback = this.queue.shift();

    while (callback != null) {
      await callback();

      if (shouldLoop) this.queue.push(callback);

      callback = this.queue.shift();
    }

    this.notifParentActiveState(this.isActive());

    return this;
  }

  reset() {
    this.parentElement.querySelectorAll('p').forEach((el) => {
      this.parentElement.removeChild(el);
    });

    this.queue.forEach((item) => {
      if (item instanceof Promise) {
        item.catch(() => {});
      } else if (typeof item === 'number') {
        clearInterval(item);
      }
    });

    this.queue = [];
    this.element = document.createElement('p');
  }

  isActive() {
    return this.queue.length > 0;
  }

  isFinished() {
    return this.parentElement.querySelectorAll('p').length > 0 && !this.isActive();
  }

  private addToQueue(callback: (resolve: () => void) => void) {
    this.queue.push(() => {
      return new Promise(callback);
    });
  }
}
