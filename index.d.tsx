declare function Choose();
declare function When(props: { condition: boolean; });
declare function Otherwise();
declare function If(props: { condition: boolean; });
declare function For<T>(props: { each: string; of: Iterable<T>; index?: string; });
declare function With(props: { [id: string]: any; });


declare namespace JSX {
	type TChildren = Element[]
		| Element
		| Function
		| string
		| number
		| boolean
		| null
		| typeof undefined;

	interface IntrinsicAttributes {
		children?: TChildren;
	}
}
