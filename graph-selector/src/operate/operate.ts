import { addClassesToNode } from "./addClassToNode";
import { addDataAttributeToNode } from "./addDataAttributeToNode";
import { removeClassesFromNode } from "./removeClassesFromNode";
import { removeDataAttributeFromNode } from "./removeDataAttributeFromNode";

export const operations = {
  removeClassesFromNode,
  addClassesToNode,
  addDataAttributeToNode,
  removeDataAttributeFromNode,
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
  // 'as never' because "Correspondence Problem", basically TS can't infer
  const newLine = operationFunction({ line, ...operationParams } as never);
  lines[lineNumber] = newLine;
  return lines.join("\n");
}
