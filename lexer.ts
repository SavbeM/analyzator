export enum TokenType {
    NUMBER = "NUMBER",
    PLUS = "PLUS",
    MINUS = "MINUS",
    MULTIPLY = "MULTIPLY",
    POWER = "POWER",
    LPAREN = "LPAREN",
    RPAREN = "RPAREN",
    EOF = "EOF"
}


export class Token {
    type: TokenType;
    attribute: any;

    constructor(type: TokenType, value: any = null) {
        this.type = type;
        this.attribute = value;
    }

    toString(): string {
        if (this.attribute !== null) {
            return `Token(${this.type}, ${this.attribute})`;
        }
        return `Token(${this.type})`;
    }
}

export class Lexer {
    private input_text: string;
    private pos: number = 0;
    private current_char: string | null;

    constructor(input_text: string) {
        this.input_text = input_text;
        this.current_char = input_text.length > 0 ? input_text[0] : null;
    }

    private advance(): void {
        this.pos += 1;
        if (this.pos < this.input_text.length) {
            this.current_char = this.input_text[this.pos];
        } else {
            this.current_char = null;
        }
    }

    private skip_whitespace(): void {
        while (this.current_char !== null && /\s/.test(this.current_char)) {
            this.advance();
        }
    }

    private number(): Token {
        let result = 0;

        while (this.current_char !== null && /\d/.test(this.current_char)) {
            result = result * 10 + parseInt(this.current_char);
            this.advance();
        }

        return new Token(TokenType.NUMBER, result);
    }

    get_next_token(): Token {
        while (this.current_char !== null) {
            if (/\s/.test(this.current_char)) {
                this.skip_whitespace();
                continue;
            }

            if (/\d/.test(this.current_char)) {
                return this.number();
            }

            if (this.current_char === '+') {
                this.advance();
                return new Token(TokenType.PLUS);
            }

            if (this.current_char === '-') {
                this.advance();
                return new Token(TokenType.MINUS);
            }

            if (this.current_char === '*') {
                this.advance();
                return new Token(TokenType.MULTIPLY);
            }

            if (this.current_char === '^') {
                this.advance();
                return new Token(TokenType.POWER);
            }

            if (this.current_char === '(') {
                this.advance();
                return new Token(TokenType.LPAREN);
            }

            if (this.current_char === ')') {
                this.advance();
                return new Token(TokenType.RPAREN);
            }

            throw new Error(`Nerozpoznaný znak: '${this.current_char}'`);
        }


        return new Token(TokenType.EOF);
    }
}

