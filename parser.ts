import {Lexer, Token, TokenType} from "./lexer";

export class Parser {
    constructor(private lexer: Lexer, private current_token: Token) {
        this.lexer = lexer;
        this.current_token = current_token;
    }

    consume(expected_token_type: string): void {

        if (this.current_token.type === expected_token_type) {
            this.current_token = this.lexer.get_next_token();
        } else {
            throw new Error(`Unexpected token: ${this.current_token.type}, expected: ${expected_token_type}`);
        }


    }

    expression(): number {
        let result: number;

         result = ((): number  => {
            if (this.current_token.type == TokenType.MINUS){
                this.consume(TokenType.MINUS)
                return -this.term()
            }
            else return  this.term()
        })();

        while (this.current_token.type === TokenType.PLUS || this.current_token.type === TokenType.MINUS) {
            const token = this.current_token;
            if (token.type === TokenType.PLUS) {
                this.consume(TokenType.PLUS);
                result += this.term();

            } else if (token.type === TokenType.MINUS) {
                this.consume(TokenType.MINUS);
                result -= this.term();
            }
        }


        return result;
    }

    term(): number {
        let result = this.factor();

        while (this.current_token.type === TokenType.MULTIPLY) {
            const token = this.current_token
            this.consume(TokenType.MULTIPLY);
            result *= this.factor();
        }

        return result
    }

    factor(): number {
        let result = this.primary()

        if(this.current_token.type === TokenType.POWER) {
            this.consume(TokenType.POWER);
            result = Math.pow(result, this.factor());
        }
        return result
    }

    primary(): number {
        const token = this.current_token;

        if (token.type === TokenType.NUMBER) {
            this.consume(TokenType.NUMBER);
            return token.attribute;
        } else if (token.type === TokenType.LPAREN) {
            this.consume(TokenType.LPAREN);
            const result = this.expression();
            this.consume(TokenType.RPAREN);
            return result;
        } else {
            throw new Error(`Syntax error: Unexpected token ${token}`);
        }
    }


    parse(): number {
        return this.expression();
    }
}