export interface Theme {
    name: string;
    properties: Dictionary<string>;
    extend?: string;
  }
  
  export interface Dictionary<T> {
    [Key: string]: T;
  }
  