export class ParseError extends Error {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
  code: string;

  constructor(
    message: string,
    startLineNumber: number,
    endLineNumber: number,
    startColumn: number,
    endColumn: number,
    /** A unique string referencing this error. Used for translations in consuming contexts. */
    code: string,
  ) {
    super(message);
    this.name = "ParseError";
    this.startLineNumber = startLineNumber;
    this.endLineNumber = endLineNumber;
    this.startColumn = startColumn;
    this.endColumn = endColumn;
    this.code = code;
  }
}
