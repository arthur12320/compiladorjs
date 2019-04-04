const fs = require('fs');
const argv = require('yargs').argv;

let filepath = argv.f;
let devf = argv.d;


let resultArray = [];
let linha = 1;
let coluna = -1;
let dev = false;


if(!filepath){
    console.log('usage: node javacomp.js -f path/to/file');
    console.log('-d: for extra info');
}else{
    console.log(`file path: ${filepath}`)
    if(argv.d){
        dev = true;
    }
    let code = fs.readFileSync(filepath,'utf8');
    if(dev){
        console.log(code);
    }
    let allchr = [...code];
    if(dev){
        console.log(allchr)
    }
    let lookAhead = ' ';
    let atual = '';
    let x;
    for(x = 0; x < allchr.length;x++){   
        atual = allchr[x];
        lookAhead = allchr[x+1];
        if(atual == '\r'){
            linha++;
            coluna = 0;
            
        }else if(atual == '\n'){
        }else{ //qualquer caractere e espaço em branco
            if(dev){
                console.log(`coluna: ${coluna} linha:${linha}`);
            }
            coluna++;
            if('0123456789.'.includes(atual)){ //int ou float-----------------------
                let num = '';
                if(atual == '.'){  //float começado em .
                    num += '0.'
                    let start = coluna;
                    while('0123456789'.includes(lookAhead)){
                        num += lookAhead;
                        x++;
                        atual = allchr[x];
                        lookAhead = allchr[x+1];
                    }
                    if(dev){
                        console.log({
                            type: 'VALOR_FLOAT',
                            valor: num,
                            coluna: start,
                            linha: linha
                        })
                    }
                    resultArray.push({
                        type: 'VALOR_FLOAT',
                        valor: num,
                        coluna: start,
                        linha: linha
                    })
                }else{    //int ou float começado em digito
                    num += atual;
                    let start = coluna;
                    while('0123456789.'.includes(lookAhead)){
                        num += lookAhead;
                        x++;
                        if(lookAhead == '.'){ //float
                            atual = allchr[x];
                            lookAhead = allchr[x+1];
                            while('0123456789'.includes(lookAhead)){
                                num += lookAhead;
                                x++;
                                atual = allchr[x];
                                lookAhead = allchr[x+1];
                            }
                            if(lookAhead == '.'||atual == '.'){
                                console.log('error: float mal formado');
                                console.log(`linha: ${linha}`);
                                process.kill(process.pid);
                            }
                        }else{      //int
                            atual = allchr[x];
                            lookAhead = allchr[x+1]; 
                        }  
                        
                    }
                    if(num.includes('.')){ //float
                        if(dev){
                            console.log({
                                type: 'VALOR_FLOAT',
                                valor: num,
                                coluna: start,
                                linha: linha
                            })
                        }
                        resultArray.push({
                            type: 'VALOR_FLOAT',
                            valor: num,
                            coluna: start,
                            linha: linha
                        })
                    }else{   //int
                        if(dev){
                            console.log({
                                type: 'VALOR_INT',
                                valor: num,
                                coluna: start,
                                linha: linha
                            })
                        }
                        resultArray.push({
                            type: 'VALOR_INT',
                            valor: num,
                            coluna: start,
                            linha: linha
                        })
                    }
                }
                
            }

            else if(atual == '+'){//SOMA
                if(dev){
                    console.log({
                        type: 'OPERADOR_SOMA',
                        linha: linha,
                        coluna: coluna
                    })
                }
                resultArray.push({
                    type: 'OPERADOR_SOMA',
                    linha: linha,
                    coluna: coluna
                })
            }

            else if(atual == '-'){//SUBTRAÇÂO
                if(dev){
                    console.log({
                        type: 'OPERADOR_SUB',
                        linha: linha,
                        coluna: coluna
                    })
                }
                resultArray.push({
                    type: 'OPERADOR_SUB',
                    linha: linha,
                    coluna: coluna
                })
            }

            else if(atual == '*'){//MULTIPLICAÇÃO
                if(dev){
                    console.log({
                        type: 'OPERADOR_MULT',
                        linha: linha,
                        coluna: coluna
                    })
                }
                resultArray.push({
                    type: 'OPERADOR_MULT',
                    linha: linha,
                    coluna: coluna
                })
            }
            
            else if(atual == '>'){//MAIOR OU MAIOR_IGUAL
                if(lookAhead == '='){
                    x++;
                    if(dev){
                        console.log({   //MAIOR IGUAL
                            type: 'MAIOR_IGUAL',
                            linha: linha,
                            coluna: coluna
                        })
                    }
                    resultArray.push({   //MAIOR IGUAL
                        type: 'MAIOR_IGUAL',
                        linha: linha,
                        coluna: coluna
                    })
                }else{
                    if(dev){
                        console.log({ //MAIOR
                            type: 'MAIOR',
                            linha: linha,
                            coluna: coluna
                        })
                    }
                    resultArray.push({ //MAIOR
                        type: 'MAIOR',
                        linha: linha,
                        coluna: coluna
                    })
                }
            }

            else if(atual == '<'){//MENOR OU MENOR IGUAL
                if(lookAhead == '='){
                    x++;
                    if(dev){
                        console.log({   //MENOR IGUAL
                            type: 'MENOR_IGUAL',
                            linha: linha,
                            coluna: coluna
                        })
                    }
                    resultArray.push({   //MENOR IGUAL
                        type: 'MENOR_IGUAL',
                        linha: linha,
                        coluna: coluna
                    })
                }else{
                    if(dev){
                        console.log({ //MENOR
                            type: 'MENOR',
                            linha: linha,
                            coluna: coluna
                        })
                    }
                    resultArray.push({ //MENOR
                        type: 'MENOR',
                        linha: linha,
                        coluna: coluna
                    })
                }
            }

            else if(atual == '!'){  //DIFERENÇA
                if(lookAhead == '='){
                    x++;
                    if(dev){
                        console.log({
                            type: 'DIFERENCA',
                            linha: linha,
                            coluna:coluna
                        })
                    }
                    resultArray.push({
                        type: 'DIFERENCA',
                        linha: linha,
                        coluna:coluna
                    })
                }else{
                    console.log('error: ! não seguido de =');
                    console.log(`linha: ${linha}`);
                    process.kill(process.pid);
                }
            }

            else if(atual == '='){//IGUALDADE OU ATRIBUIÇÂO
                if(lookAhead == '='){
                    x++;
                    if(dev){
                        console.log({
                            type: 'IGUALDADE',
                            linha: linha,
                            coluna: coluna
                        })
                    }
                    resultArray.push({
                        type: 'IGUALDADE',
                        linha: linha,
                        coluna: coluna
                    })
                }else{
                    if(dev){
                        console.log({
                            type: 'ATRIBUICAO',
                            linha: linha,
                            coluna: coluna
                        })
                    }
                    resultArray.push({
                        type: 'ATRIBUICAO',
                        linha: linha,
                        coluna: coluna
                    })
                }
            }

            else if(atual == '('){ //abre parenteses
                if(dev){
                    console.log({
                        type: 'AP',
                        linha: linha,
                        coluna: coluna
                    })
                }
                resultArray.push({
                    type: 'AP',
                    linha: linha,
                    coluna: coluna
                })
            }

            else if(atual == ')'){ //fecha parenteses
                if(dev){
                    console.log({
                        type: 'FP',
                        linha: linha,
                        coluna: coluna
                    })
                }
                resultArray.push({
                    type: 'FP',
                    linha: linha,
                    coluna: coluna
                })
            }

            else if(atual == '{'){ //abre colchetes
                if(dev){
                    console.log({
                        type: 'AC',
                        linha: linha,
                        coluna: coluna
                    })
                }
                resultArray.push({
                    type: 'AC',
                    linha: linha,
                    coluna: coluna
                })
            }

            else if(atual == '}'){  //fecha colchetes
                if(dev){
                    console.log({
                        type: 'FC',
                        linha: linha,
                        coluna: coluna
                    })
                }
                resultArray.push({
                    type: 'FC',
                    linha: linha,
                    coluna: coluna
                })
            }

            else if(atual == ';'){ //ponto e virgula
                if(dev){
                    console.log({
                        type: 'PV',
                        linha: linha,
                        coluna: coluna
                    })
                }
                resultArray.push({
                    type: 'PV',
                    linha: linha,
                    coluna: coluna
                })
            }

            else if(atual == ','){ //virgula
                if(dev){
                    console.log({
                        type: 'VIR',
                        linha: linha,
                        coluna: coluna
                    })
                }
                resultArray.push({
                    type: 'VIR',
                    linha: linha,
                    coluna: coluna
                })
            }


            else if(atual == "\'"){
                let char = '';
                x++;
                atual = allchr[x];
                lookAhead = allchr[x+1];
                char += atual;
                if('abcdefghijklmnopqrstuvwxyz1234567890'.includes(atual) && lookAhead == "\'"){
                    x++;
                    if(dev){
                        console.log({
                            type: 'VALOR_CHAR',
                            value: char,
                            linha: linha,
                            coluna: coluna
                        })
                    }
                    resultArray.push({
                        type: 'VALOR_CHAR',
                        value: char,
                        linha: linha,
                        coluna: coluna
                    })
                }else{
                    console.log('error: char mal formado');
                    console.log(`linha: ${linha}`);
                    process.kill(process.pid);
                }
            }



            else if(atual == '/'){         // comentario simple ou multilinhas ou operador divisão
                let com = '/';
                if(lookAhead == '/'){
                    while(lookAhead != '\r' && x <= (allchr.length - 2)){
                            x++;
                            atual = allchr[x];
                            lookAhead = allchr[x+1];
                            com += atual;
                        
                    }
                    if(dev){
                        console.log({
                            type: 'COMS',
                            value: com,
                            linha:linha,
                            coluna: coluna
                        })
                    }
                    resultArray.push({
                        type: 'COMS',
                        value: com,
                        linha:linha,
                        coluna: coluna
                    })
                }else if(lookAhead == '*'){
                    x++;
                    atual = allchr[x];
                    lookAhead = allchr[x+1];
                    com += atual;
                    while(lookAhead != '*'){
                        if(x >= allchr.length){
                            console.log('error: comentário multi-linha não fechado');
                            console.log(`linha: ${linha}`);
                            process.kill(process.pid);
                        }
                        x++;
                        atual = allchr[x];
                        lookAhead = allchr[x+1];
                        com += atual;
                    
                    }
                    x++;
                    atual = allchr[x];
                    lookAhead = allchr[x+1];
                    if(lookAhead == '/'){
                        com += '*/';
                        x++;
                        if(dev){
                            console.log({
                                type: 'COMM',
                                value: com,
                                linha:linha,
                                coluna: coluna
                            })
                        }
                        resultArray.push({
                            type: 'COMM',
                            value: com,
                            linha:linha,
                            coluna: coluna
                        })
                       
                    }else{
                        console.log('error: comentário multi-linha não fechado');
                        console.log(`linha: ${linha}`);
                        process.kill(process.pid);
                    }
                    
                }

                else{
                    if(dev){
                        console.log({
                            type: 'OPERADOR_DIV',
                            linha: linha,
                            coluna: coluna
                        })
                    }
                    resultArray.push({
                        type: 'OPERADOR_DIV',
                        linha: linha,
                        coluna: coluna
                    })
                }
            }




            else if('abcdefghijklmnopqrstuvwyxz'.includes(atual)){ //ID OU PALAVRAS RESERVADAS
                let palavra = '';
                palavra += atual;
                let start = coluna
                let accepted = 'abcdefghijklmnopqrstuvwyxz_';
                while(accepted.includes(lookAhead)){
                    x++;
                    atual = allchr[x];
                    lookAhead = allchr[x+1];
                    if(atual == '_'){
                        accepted += '1234567890';
                    }
                    palavra+=atual;

                }
                if('1234567890'.includes(lookAhead)){
                    console.log('ID ou palavra reservada mal formada')
                    console.log(`linha: ${linha}`);
                    process.kill(process.pid);
                }

                if(dev){
                    console.log(`string encontrada: ${palavra} na linha:${linha} e coluna: ${start}`);
                }
                identify(palavra);

            }


        }

    }


   console.log(resultArray);

}





function identify(input){
    if(input == 'int'){
        if(dev){
            console.log({
                type: 'TIPO_INT',
                linha: linha,
                coluna: coluna
            })
        }
        resultArray.push({
            type: 'TIPO_INT',
            linha: linha,
            coluna: coluna
        })
    }else if(input == 'float'){
        if(dev){
            console.log({
                type: 'TIPO_FLOAT',
                linha: linha,
                coluna: coluna
            })
        }
        resultArray.push({
            type: 'TIPO_FLOAT',
            linha: linha,
            coluna: coluna
        })
    }else if(input == 'char'){
        if(dev){
            console.log({
                type: 'TIPO_CHAR',
                linha: linha,
                coluna: coluna
            })
        }
        resultArray.push({
            type: 'TIPO_CHAR',
            linha: linha,
            coluna: coluna
        })
    }else if(input == 'main'){
        if(dev){
            console.log({
                type: 'MAIN',
                linha: linha,
                coluna: coluna
            })
        }
        resultArray.push({
            type: 'MAIN',
            linha: linha,
            coluna: coluna
        })
    }else if(input == 'if'){
        if(dev){
            console.log({
                type: 'IF',
                linha: linha,
                coluna: coluna
            })
        }
        resultArray.push({
            type: 'IF',
            linha: linha,
            coluna: coluna
        })
    }else if(input == 'else'){
        if(dev){
            console.log({
                type: 'ELSE',
                linha: linha,
                coluna: coluna
            })
        }
        resultArray.push({
            type: 'ELSE',
            linha: linha,
            coluna: coluna
        })
    }else if(input == 'while'){
        if(dev){
            console.log({
                type: 'WHILE',
                linha: linha,
                coluna: coluna
            })
        }
        resultArray.push({
            type: 'WHILE',
            linha: linha,
            coluna: coluna
        })
    }else if(input == 'do'){
        if(dev){
            console.log({
                type: 'DO',
                linha: linha,
                coluna: coluna
            })
        }
        resultArray.push({
            type: 'DO',
            linha: linha,
            coluna: coluna
        })
    }else if(input == 'for'){
        if(dev){
            console.log({
                type: 'FOR',
                linha: linha,
                coluna: coluna
            })
        }
        resultArray.push({
            type: 'FOR',
            linha: linha,
            coluna: coluna
        })
    }else{
        if(dev){
            console.log({
                type: 'ID',
                value: input,
                linha: linha,
                coluna: coluna
            })
        }
        resultArray.push({
            type: 'ID',
            value: input,
            linha: linha,
            coluna: coluna
        })
    }


    
    
}





