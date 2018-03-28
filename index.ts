import { JsxElement } from "typescript";

export declare function If(props: { condition: boolean }): JsxElement | undefined;
export declare function For(props: { each?: string; of: any[]; index?: string }): JsxElement | undefined;
export declare function Choose(): JsxElement | undefined;
export declare function When(props: { condition: boolean }): JsxElement | undefined;
export declare function Otherwise(): JsxElement | undefined;
