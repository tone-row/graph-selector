import { addClassToNode } from "./addClassToNode";
import { removeClassFromNode } from "./removeClassFromNode";

export const operations = {
  removeClassFromNode,
  addClassToNode,
};

export type OperationKey = keyof typeof operations;

/** Create a type which is a tuple. First the opertion key, then the paramaters of the function */
export type Operation = {
  [K in OperationKey]: [K, Omit<Parameters<typeof operations[K]>[0], "line">];
}[OperationKey];

export type Instruction = {
  lineNumber: number;
  operation: Operation;
};

/**
 * Used to alter the text of a graph given an instruction.
 *
 * e.g. _"tell the node on line 14 to remove the class 'foo'"_
 */
export function operate(graphText: string, instruction: Instruction): string {
  const lines = graphText.split("\n");
  const { lineNumber, operation } = instruction;
  const [operationKey, operationParams] = operation;
  const operationFunction = operations[operationKey];
  const line = lines[lineNumber];
  const newLine = operationFunction({ line, ...operationParams });
  lines[lineNumber] = newLine;
  return lines.join("\n");
}
