import { Component } from 'react';
import { MapLike } from 'typescript';

export declare class For extends Component<{ each?: string, index?: string, of: any[] }> {};
export declare class If extends Component<{ condition: boolean }> {};
export declare class Choose extends Component<{}> {};
export declare class When extends Component<{ condition: boolean }> {};
export declare class Otherwise extends Component<{}> {};
export declare class With extends Component<MapLike<any>> {};
