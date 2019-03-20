export declare type TChildren =
	| JSX.Element
	| string
	| number
	| boolean
	| null
	| typeof undefined;

export declare function Choose(props: { children?: TChildren | TChildren[] }): any;
export declare function When(props: { children?: TChildren | TChildren[]; condition: boolean; }): any;
export declare function Otherwise(props: { children?: TChildren | TChildren[] }): any;
export declare function If(props: { children?: TChildren | TChildren[]; condition: boolean; }): any;
export declare function For<T>(props: { children?: TChildren | TChildren[]; each: string; of: Iterable<T>; index?: string; }): any;
export declare function With(props: { children?: TChildren | TChildren[]; [id: string]: any; }): any;

export declare interface IntrinsicAttributes {
	children?: TChildren | TChildren[];
}

export {};