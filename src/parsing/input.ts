import { InputType } from "./transition";
import { Testament } from "./state";
import { ParseError } from "./errors";

export class Input {
  constructor(
    readonly type: InputType,
    readonly string: string,
    readonly value: number | null,
    readonly testament: Testament | null = null,
    readonly error: ParseError | null = null
  ) {}
}
