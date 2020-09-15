import { InputType } from "./transition";
import { ParseError } from "./errors";

export class Input {
  constructor(
    readonly type: InputType,
    readonly string: string,
    readonly value: number | null,
    readonly testament: "o" | "n" | null = null,
    readonly error: ParseError | null = null
  ) {}
}
