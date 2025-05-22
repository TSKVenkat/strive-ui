import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveClass(className: string): R;
      // Add any other custom matchers you're using
      toBeVisible(): R;
      toBeChecked(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeEmpty(): R;
      toBeEmptyDOMElement(): R;
      toBeInvalid(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveAttribute(attr: string, value?: string | RegExp): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveFocus(): R;
      toHaveFormValues(values: Record<string, any>): R;
      toHaveStyle(css: string | Record<string, any>): R;
      toHaveValue(value: string | string[] | number): R;
      toBeInTheDOM(): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
    }
  }
}

// This is needed to make the file a module
export {};
