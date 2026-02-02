export function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const lastValue = element.value;
  element.value = value;
  const event = new Event("input", { bubbles: true });
  // React 15
  (event as unknown as { simulated?: boolean }).simulated = true;
  // React 16+
  const tracker = (element as unknown as { _valueTracker?: { setValue: (value: string) => void } })._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  element.dispatchEvent(event);
}

export function waitForElement(selector: string): Promise<Element | null> {
  let count = 1;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      count += 1;

      if (element instanceof Element) {
        clearInterval(interval);
        resolve(element);
      } else if (count > 30) {
        clearInterval(interval);
        console.warn(`RSH - timeout waiting for: ${selector}`);
        resolve(null);
      }
    }, 100);
  });
}

export async function setTextForSelector(selector: string, val: string): Promise<void> {
  await waitForElement(selector);
  const item = document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | null;
  if (!item) {
    console.error(`RSH: setText selector failed: ${selector}`);
  } else {
    setNativeValue(item, val);
  }
}
