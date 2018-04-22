declare function For<T>({ each, of, index }: { each: string; of: T[]; index?: string });
declare function If({ condition }: { condition: boolean });
declare function Choose();
declare function When({ condition }: { condition: boolean });
declare function Otherwise();
declare function With(props: { [id: string]: any });
