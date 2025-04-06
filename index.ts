import { Lexer } from "./lexer";
import { Parser } from "./parser";
import readline from 'node:readline';


export class Calculator {

  evaluate(expression: string): number | string {
    try {
      const lexer = new Lexer(expression);
      const token = lexer.get_next_token();
      const parser = new Parser(lexer, token);
      const result = parser.parse();
      return result;
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
}

const calc = new Calculator()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = () => {
  rl.question(`Insert your input: `, expr => {
    if (expr !== "exit") {
      console.log(calc.evaluate(expr));
      askQuestion();
    } else {
      rl.close();
    }
  });
};

askQuestion();