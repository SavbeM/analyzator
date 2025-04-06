import { Lexer, Token, TokenType } from "./lexer";
import treeify from 'treeify';

export class Parser {
    private parseTree: { [key: string]: any } = { 'START': {} };
    private treeStack: any[] = [this.parseTree['START']];
    private nodeCount = 0;

    constructor(private lexer: Lexer, private current_token: Token) {}

    private pushLog(message: string): void {
        const level = this.treeStack.length;
        const key = `lvl${level} ${this.nodeCount++}: ${message}`;
        const newNode = {};
        if (!this.treeStack[this.treeStack.length - 1]) {
            throw new Error("Current tree node is undefined");
        }
        this.treeStack[this.treeStack.length - 1][key] = newNode;
        this.treeStack.push(newNode);
    }

    private popLog(): void {
        if (this.treeStack.length > 1) {
            this.treeStack.pop();
        } else {
            throw new Error("Cant delete root");
        }
    }

    private consume(expected_token_type: string): void {
        if (this.current_token.type === expected_token_type) {
            this.current_token = this.lexer.get_next_token();
        } else {
            throw new Error(`Unexpected token: ${this.current_token.type}, expected: ${expected_token_type}`);
        }
    }

    expression(): number {
        this.pushLog("E");
        let result: number;

        if (this.current_token.type === TokenType.MINUS) {
            this.pushLog("-");
            this.consume(TokenType.MINUS);
            result = -this.term();
            this.popLog();
        } else {
            result = this.term();
        }

        while (this.current_token.type === TokenType.PLUS || this.current_token.type === TokenType.MINUS) {
            if (this.current_token.type === TokenType.PLUS) {
                this.pushLog("+");
                this.consume(TokenType.PLUS);
                this.popLog();
                result += this.term();
            } else {
                this.pushLog("-");
                this.consume(TokenType.MINUS);
                this.popLog();
                result -= this.term();
            }
        }

        this.popLog();
        return result;
    }

    term(): number {
        this.pushLog("T");
        let result = this.factor();

        while (this.current_token.type === TokenType.MULTIPLY) {
            this.pushLog("*");
            this.consume(TokenType.MULTIPLY);
            result *= this.factor();
            this.popLog();
        }

        this.popLog();
        return result;
    }

    factor(): number {
        this.pushLog("F");
        let result = this.primary();

        if (this.current_token.type === TokenType.POWER) {
            this.pushLog("^");
            this.consume(TokenType.POWER);
            result = Math.pow(result, this.factor());
            this.popLog();
        }

        this.popLog();
        return result;
    }

    primary(): number {
        this.pushLog("P");
        let result: number;
        const token = this.current_token;

        if (token.type === TokenType.NUMBER) {
            this.pushLog(String(token.attribute));
            result = token.attribute;
            this.consume(TokenType.NUMBER);
            this.popLog();
        } else if (token.type === TokenType.LPAREN) {
            this.pushLog("(");
            this.consume(TokenType.LPAREN);
            result = this.expression();
            this.consume(TokenType.RPAREN);
            this.pushLog(")");
            this.popLog();
            this.popLog();
        } else {
            throw new Error(`Syntax error: Unexpected token ${token}`);
        }

        this.popLog();
        return result;
    }

    parse(): number {
        const result = this.expression();
        console.log(treeify.asTree(this.parseTree, true, false));
        return result;
    }
}
