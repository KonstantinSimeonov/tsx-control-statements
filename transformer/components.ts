/**
 * Stub definitions that will be replaced by the transformer.
 * They're used to provide type definitions for the typescript
 * compiler and various static analysis tools.
 */

type JsxChild = string | boolean | number | null | undefined | JSX.Element;
type JsxChildren = JsxChild | JsxChild[];

export function Choose(props: { children: JsxChildren }) {
  return props.children as any;
}

export function When(props: { children: JsxChildren; condition: unknown }) {
  return props.children as any;
}

export function If(props: { children: JsxChildren; condition: unknown }) {
  return props.children as any;
}

type NoBody<T> = { children?: JsxChildren; each: string; of: Iterable<T>; index?: string };
type WithBody<T> = {
  children?: JsxChildren;
  of: Iterable<T>;
  body: (x: T, index: number) => JsxChildren;
};
export function For<T>(props: NoBody<T> | WithBody<T>) {
  return undefined as any;
}

export function Otherwise(props: { children: JsxChildren }) {
  return props.children as any;
}

export function With(props: { children: JsxChildren; [id: string]: any }) {
  return props.children as any;
}
