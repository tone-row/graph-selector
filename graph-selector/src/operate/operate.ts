import { addClassesToNode } from "./addClassToNode";
import { removeClassesFromNode } from "./removeClassesFromNode";

export const operations = {
  removeClassesFromNode,
  addClassesToNode,
};

export type OperationKey = keyof typeof operations;

/** Create a type which is a tuple. First the opertion key, then the paramaters of the function */
export type Operation = {
  [K in OperationKey]: [K, Omit<Parameters<typeof operations[K]>[0], "line">];
}[OperationKey];

export type Instruction = {
  /** a **1-indexed** (not 0-indexed) line number */
  lineNumber: number;
  operation: Operation;
};

/**
 * Used to alter the text of a graph given an instruction.
 *
 * e.g. _"tell the node on line 14 to remove the class 'foo'"_
 *
 * **Note:** The line number is 1-indexed, not 0-indexed.
 */
export function operate(graphText: string, instruction: Instruction): string {
  const lines = graphText.split("\n");
  const { operation } = instruction;
  if (instruction.lineNumber < 1) throw new Error("lineNumber must be 1-indexed");
  if (instruction.lineNumber > lines.length)
    throw new Error("lineNumber must be less than the number of lines");
  const lineNumber = instruction.lineNumber - 1;
  const [operationKey, operationParams] = operation;
  const operationFunction = operations[operationKey];
  const line = lines[lineNumber];
  // TODO: this type isn't error because our operations have the same interface right now, but as soon as they don't...
  const newLine = operationFunction({ line, ...operationParams });
  lines[lineNumber] = newLine;
  return lines.join("\n");
}
