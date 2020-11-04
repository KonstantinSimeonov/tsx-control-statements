/**
 * Stub definitions that will be replaced by the transformer.
 * They're used to provide type definitions for the typescript
 * compiler and various static analysis tools.
 */

type JsxChild = string | number | boolean | JSX.Element | JsxChild[];

export function Choose(props: { children: JSX.Element[] }) {
  return props.children as any;
}

export function When(props: { children: JsxChild; condition: unknown }) {
  return props.children as any;
}

export function If(props: { children: JsxChild; condition: unknown }) {
  return props.children as any;
}

type NoBody<T> = { children?: JsxChild; each: string; of: Iterable<T>; index?: string };
type WithBody<T> = {
  children?: JsxChild;
  of: Iterable<T>;
  body: (x: T, index: number) => JsxChild;
};
export function For<T>(props: NoBody<T> | WithBody<T>) {
  return props.children as any;
}

export function Otherwise(props: { children: JsxChild }) {
  return props.children as any;
}

export function With(props: { children: JsxChild; [id: string]: any }) {
  return props.children as any;
}
