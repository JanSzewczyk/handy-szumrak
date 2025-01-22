import prompts from "prompts";
import { logger } from "./logger";

export function prompt<T extends string = string>(
  questions: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>
): Promise<prompts.Answers<T>> {
  return prompts(questions, {
    /**
     * User inputs Ctrl+C or Ctrl+D to exit the prompt. We should close the
     * process and not write to the file system.
     */
    onCancel: () => {
      logger.error("Exiting.");
      process.exit(1);
    }
  });
}
