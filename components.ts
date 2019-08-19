/**
 * Stub definitions that will be replaced by the transformer.
 * They're used to provide type definitions for the typescript
 * compiler and various static analysis tools.
 */

export function Choose(props: { children: any }) {
	return props.children;
}

export function When(props: { children: any; condition: boolean; }) {
	return props.children;
}

export function If(props:{ children: any; condition: boolean; }) {
	return props.children;
}

export function For<T>(props: { children: any; each: string; of: Iterable<T>; index?: string; }) {
	return props.children;
}

export function Otherwise(props: { children: any; }) {
	return props.children;
}

export function With(props: { [id: string]: any }) {
	return props.children;
}

