import { exampleData, exampleDataArray } from "./simpleFilter.types";

export const simpleFilter = <K extends keyof exampleData>(input: exampleDataArray, key: K, value: any)  => 
  input.filter((item): item is exampleData => item[key] === value);
