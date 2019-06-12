const fs = require('fs');
const argv = require('yargs').argv;

let filepath = argv.f;
let devf = argv.d;


let resultArray = [];
let previous_size = resultArray.length;
let linha = 1;
let coluna = 0;
let dev = false;

let tabelaSimbolos = [];
let escopoNumber = 0;

let labelCount = 1;
let OL = 1;

if (!filepath) {
    console.log('usage: node javacomp.js -f path/to/file');
    console.log('-d: for extra info');
} else {
    console.log('==================================================================');
    console.log(`file path: ${filepath}`);
    console.log('==================================================================');
    if (argv.d) {
        dev = true;
    }
    let code = fs.readFileSync(filepath, 'utf8');
    if (dev) {
        console.log('string form input data:')
        console.log(code);
        console.log('==================================================================')
    }
    var allchr = [...code];
    if (dev) {
        console.log('array form input data:')
        console.log(allchr);
        console.log('==================================================================')
        console.log('');
        console.log('');
        console.log('');
        console.log('');
    }

    var x = 0;


    //scanner testing 

    // let y = 0;
    // while (y < 100) {
    //     let result = scanner(allchr);
    //     y++
    // }

    
    //parser testing
    // while(1){
    //     console.log('-------*---------')       
    //     programa();
    // }
 

    //analisador semantico
    while(1){
        console.log('-------*---------')       
        programa();
        console.table(tabelaSimbolos);
    }


    // for(let i = 0; i < 4;i++){
    //     console.log(newLabel());
    // }

}



function scanner(allchr) {      //CONSERTAR COMENTARIO


    let resultArray = [];
    atual = allchr[x];
    lookAhead = allchr[x + 1];

    while(atual == ' ' || atual == '\r' || atual == '\t' || atual == '\n' || atual == '/'){            //if ignoring white spaces
        if (atual == '/') { // comentario simple ou multilinhas ou operador divisão =============================
            let com = '/';
            if (lookAhead == '/') { // single line comment
                while (lookAhead != '\n' && x <= (allchr.length - 2)) {
                    x++;
                    atual = allchr[x];
                    lookAhead = allchr[x + 1];
                    com += atual;

                }
                let obj = {
                    type: 'COMS',
                    value: com,
                    linha: linha,
                    coluna: coluna
                }
                if (dev) {
                    console.log(obj);
                }
                x++;
            } else if (lookAhead == '*') { //multy line comment
                x++;
                atual = allchr[x];
                lookAhead = allchr[x + 1];
                com += atual;
                while (x < allchr.length) {
                    if (x >= allchr.length - 1) {
                        console.log('error: comentário multi-linha não fechado');
                        console.log(`linha: ${linha}`);
                        process.kill(process.pid);
                    }
                    if(lookAhead == '/' && atual == '*'){
                        break;
                    }
                    x++;
                    atual = allchr[x];
                    lookAhead = allchr[x + 1];
                    com += atual;

                }
                
                com += '*/';
                x++;
                let obj = {
                    type: 'COMM',
                    value: com,
                    linha: linha,
                    coluna: coluna
                }
                if (dev) {
                    console.log(obj)
                }

                

            } else { //operador divisão
                break;
            }
            

            


        } 
        
        
        x++;
        atual = allchr[x];
        lookAhead = allchr[x + 1];
        if(atual == '\n'){
            linha++;
        coluna = 0;
        }
    }

    
        //qualquer caractere e espaço em branco

        coluna++;
        if (dev) {
            console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~coluna: ${coluna} linha:${linha} x: ${x}~~~~~~~~~~~~~~~~~~~~~~~~~`);
            console.log('')
        }
        
        

        // if (atual == ' ') {         //espaço em braco sendo contado
        //     let obj = {
        //         type: 'ESPACO_BRANCO',
        //         linha: linha,
        //         coluna: coluna
        //     }
        //     if (dev) {
        //         console.log(obj)
        //     }
        //     resultArray.push(obj)
        //     x++;
        // }else 
        if ('0123456789.'.includes(atual)) { //int ou float-----------------------
            let num = '';
            if (atual == '.') { //float começado em .
                num += '0.'

                if (!'0123456789'.includes(lookAhead)) {
                    console.log('error: float mal formado');
                    console.log(`linha: ${linha}`);
                    process.kill(process.pid);
                }

                while ('0123456789'.includes(lookAhead)) {
                    num += lookAhead;
                    x++;
                    atual = allchr[x];
                    lookAhead = allchr[x + 1];
                }
                
                let obj = {
                    type: 'VALOR_FLOAT',
                    valor: num,
                    linha: linha,
                    coluna: coluna,
                }
                if (dev) {
                    console.log(obj)
                }
                resultArray.push(obj)

            } else { //int ou float começado em digito
                num += atual;
            outside:while ('0123456789.'.includes(lookAhead)) {
                    num += lookAhead;
                    x++;
                    if (lookAhead == '.') { //float
                        atual = allchr[x];
                        lookAhead = allchr[x + 1];

                        if (!'0123456789'.includes(lookAhead)) {
                            console.log('error: float mal formado');
                            console.log(`linha: ${linha}`);
                            process.kill(process.pid);
                        }
                        
                        while ('0123456789'.includes(lookAhead)) {
                            num += lookAhead;
                            x++;
                            atual = allchr[x];
                            lookAhead = allchr[x + 1];
                        }
                        
                        break outside;
                        
                    } else { //int
                        atual = allchr[x];
                        lookAhead = allchr[x + 1];
                    }

                }
                if (num.includes('.')) { //float
                    let obj = {
                        type: 'VALOR_FLOAT',
                        valor: num,
                        linha: linha,
                        coluna: coluna
                       
                    }
                    if (dev) {
                        console.log(obj)
                    }
                    resultArray.push(obj)

                } else { //int
                    let obj = {
                        type: 'VALOR_INT',
                        valor: num,
                        linha: linha,
                        coluna: coluna
                        
                    }
                    if (dev) {
                        console.log(obj)
                    }
                    resultArray.push(obj)
                }
            }
            x++;
        } else if (atual == '+') { //SOMA
            let obj = {
                type: 'OPERADOR_SOMA',
                linha: linha,
                coluna: coluna
            }
            if (dev) {
                console.log(obj)
            }
            resultArray.push(obj)
            x++;
        } else if (atual == '-') { //SUBTRAÇÂO
            let obj = {
                type: 'OPERADOR_SUB',
                linha: linha,
                coluna: coluna
            }
            if (dev) {
                console.log(obj)
            }
            resultArray.push(obj)
            x++;
        } else if (atual == '*') { //MULTIPLICAÇÃO
            let obj = {
                type: 'OPERADOR_MULT',
                linha: linha,
                coluna: coluna
            }
            if (dev) {
                console.log(obj)
            }
            resultArray.push(obj)
            x++;
        } else if (atual == '>') { //MAIOR OU MAIOR_IGUAL
            if (lookAhead == '=') {      //MAIOR IGUAL
                x++;
                let obj = {    
                    type: 'MAIOR_IGUAL',
                    linha: linha,
                    coluna: coluna
                }
                if (dev) {
                    console.log(obj)
                }
                resultArray.push(obj)
            } else {                    //MAIOR
                let obj = {
                    type: 'MAIOR',
                    linha: linha,
                    coluna: coluna        
                }
                if (dev) {
                    console.log(obj)
                }
                resultArray.push(obj)
            }
            x++;
        } else if (atual == '<') { //MENOR OU MENOR IGUAL
            if (lookAhead == '=') {     //MENOR IGUAL
                x++;
                let obj = {
                    type: 'MENOR_IGUAL',
                    linha: linha,
                    coluna: coluna
                }
                if (dev) {
                    console.log(obj)
                }
                resultArray.push(obj)
            } else {                     //MENOR
                let obj = {
                    type: 'MENOR',
                    linha: linha,
                    coluna: coluna
                }
                if (dev) {
                    console.log(obj)
                }
                resultArray.push(obj)
            }
            x++;
        } else if (atual == '!') { //DIFERENÇA
            if (lookAhead == '=') {
                x++;
                let obj = {
                    type: 'DIFERENCA',
                    linha: linha,
                    coluna: coluna
                }
                if (dev) {
                    console.log(obj)
                }
                resultArray.push(obj)
            } else {
                console.log('error: ! não seguido de =');
                console.log(`linha: ${linha}`);
                process.kill(process.pid);
            }
            x++;
        } else if (atual == '=') { //IGUALDADE OU ATRIBUIÇÂO
            if (lookAhead == '=') {
                x++;
                let obj = {
                    type: 'IGUALDADE',
                    linha: linha,
                    coluna: coluna
                }
                if (dev) {
                    console.log(obj)
                }
                resultArray.push(obj)
            } else {
                let obj = {
                    type: 'ATRIBUICAO',
                    linha: linha,
                    coluna: coluna
                }
                if (dev) {
                    console.log(obj)
                }
                resultArray.push(obj)
            }
            x++;
        } else if (atual == '(') { //abre parenteses
            let obj = {
                type: 'AP',
                linha: linha,
                coluna: coluna
            }
            if (dev) {
                console.log(obj)
            }
            resultArray.push(obj)
            x++;
        } else if (atual == ')') { //fecha parenteses
            let obj = {
                type: 'FP',
                linha: linha,
                coluna: coluna
            }
            if (dev) {
                console.log(obj)
            }
            resultArray.push(obj)
            x++;
        } else if (atual == '{') { //abre colchetes
            let obj = {
                type: 'AC',
                linha: linha,
                coluna: coluna
            }
            if (dev) {
                console.log(obj)
            }
            resultArray.push(obj)
            x++;
        } else if (atual == '}') { //fecha colchetes
            let obj = {
                type: 'FC',
                linha: linha,
                coluna: coluna
            }
            if (dev) {
                console.log(obj)
            }
            resultArray.push(obj)
            x++;
        } else if (atual == ';') { //ponto e virgula
            let obj = {
                type: 'PV',
                linha: linha,
                coluna: coluna
            }
            if (dev) {
                console.log(obj)
            }
            resultArray.push(obj)
            x++
        } else if (atual == ',') { //virgula
            let obj = {
                type: 'VIR',
                linha: linha,
                coluna: coluna
            }
            if (dev) {
                console.log(obj)
            }
            resultArray.push(obj)
            x++


        } else if (atual == "\'") { //char ========================================
            let char = '';
            x++;
            atual = allchr[x];
            lookAhead = allchr[x + 1];
            char += atual;
            if ('abcdefghijklmnopqrstuvwxyz1234567890'.includes(atual) && lookAhead == "\'") {
                x++;
                let obj = {
                    type: 'VALOR_CHAR',
                    value: char,
                    linha: linha,
                    coluna: coluna
                }
                if (dev) {
                    console.log(obj)
                }
                resultArray.push(obj)
            } else {
                console.log('error: char mal formado');
                console.log(`linha: ${linha}`);
                process.kill(process.pid);
            }
            x++;



        } 
        
        else if(atual == '/'){
            x++;
            let obj = {
                type: 'OPERADOR_DIV',
                linha: linha,
                coluna: coluna
            }
            if (dev) {
                console.log(obj)
            }
            resultArray.push(obj)
        }

        else if ('abcdefghijklmnopqrstuvwyxz'.includes(atual)) { //ID OU PALAVRAS RESERVADAS =========================

            let palavra = '';
            palavra += atual;
            let accepted = 'abcdefghijklmnopqrstuvwyxz_';

            //loop enquanto palavra for valida
            while (accepted.includes(lookAhead)) {
                x++;
                atual = allchr[x];
                lookAhead = allchr[x + 1];
                if (atual == '_') {
                    accepted += '1234567890'; //adicionar palavras validas apos _
                }
                palavra += atual;
            }

            // if (dev) {
            //     console.log(`string encontrada: ${palavra} na linha:${linha} e coluna: ${coluna}`);
            // }

            resultArray.push(identify(palavra)[0]);
            x++;

        
        }else{
            if(x >= allchr.length-1){   
                let obj = {
                    type: 'END_OF_FILE',
                    linha: linha,
                    coluna: coluna
                }
                if (dev) {
                    console.log(obj)
                }
                resultArray.push(obj)
            }else{
                console.log('error: caractere invalido');
                console.log(`linha: ${linha}`);
                process.kill(process.pid);
            }

        }







    

    //results:

    return resultArray[0]

}


function identify(input) {
    let resultArray = [];
    if (input == 'int') {
        let obj = {
            type: 'TIPO_INT',
            linha: linha,
            coluna: coluna
        }

        if (dev) {
            console.log(obj)
        }
        resultArray.push(obj)

    } else if (input == 'float') {

        let obj = {
            type: 'TIPO_FLOAT',
            linha: linha,
            coluna: coluna
        }
        if (dev) {
            console.log(obj)
        }
        resultArray.push(obj)
    } else if (input == 'char') {
        let obj = {
            type: 'TIPO_CHAR',
            linha: linha,
            coluna: coluna
        }
        if (dev) {
            console.log(obj)
        }
        resultArray.push(obj)
    } else if (input == 'main') {
        let obj = {
            type: 'MAIN',
            linha: linha,
            coluna: coluna
        }
        if (dev) {
            console.log(obj)
        }
        resultArray.push(obj)
    } else if (input == 'if') {
        let obj = {
            type: 'IF',
            linha: linha,
            coluna: coluna
        }
        if (dev) {
            console.log(obj)
        }
        resultArray.push(obj)
    } else if (input == 'else') {
        let obj = {
            type: 'ELSE',
            linha: linha,
            coluna: coluna
        }
        if (dev) {
            console.log(obj)
        }
        resultArray.push(obj)
    } else if (input == 'while') {
        let obj = {
            type: 'WHILE',
            linha: linha,
            coluna: coluna
        }
        if (dev) {
            console.log(obj)
        }
        resultArray.push(obj)
    } else if (input == 'do') {
        let obj = {
            type: 'DO',
            linha: linha,
            coluna: coluna
        }
        if (dev) {
            console.log(obj)
        }
        resultArray.push(obj)
    } else if (input == 'for') {
        let obj = {
            type: 'FOR',
            linha: linha,
            coluna: coluna
        }
        if (dev) {
            console.log(obj)
        }
        resultArray.push(obj)
    } else {
        let obj = {
            type: 'ID',
            value: input,
            linha: linha,
            coluna: coluna
        }
        if (dev) {
            console.log(obj)
        }
        resultArray.push(obj)
    }

    return resultArray;
}




function fator(){       //tested : ok   //semantico:ok  GC:ok?;
    let result = scanner(allchr);
    let returnID;
    let returnType;
    let returnToken;
    let returnAux;
    if(result.type != "VALOR_INT" && result.type != "VALOR_FLOAT" && result.type != 'VALOR_CHAR' && result.type != 'ID'&& result.type != 'AP'){
        throw new Error({name:'erro no fator1'});   
    }

    returnType = result.type;
    returnToken = result.valor;
    returnAux = {returnType,returnToken};

    if(result.type == 'ID'){
        let test = {
            name: result.value,
            type: null,
            value:null,
            scope: escopoNumber
        }

        returnID = variavelExists(test);
        returnToken = result.value
        returnType = returnID.type;
        returnAux = {returnType,returnToken};
    }
    if(result.type == 'VALOR_CHAR'){
        returnToken = `'${result.value}'`
        returnType = 'VALOR_CHAR';
        returnAux = {returnType,returnToken};
    }
    

    if(result.type == 'AP'){
        returnAux = expreArit();
        x--;
        coluna--;
        result = scanner(allchr);
        if(result.type != 'FP'){
            throw new Error({name:'erro no fator2'});;
        }
    }

    if(dev){
        console.log('fator bem formado');//DEV ME 
    }
    
    
    return returnAux;


    
}

function expreArit(){    //tested:ok    //semantico: ok GC:ok?
    let aux1,aux2;
    let auxR1,auxR2;
    let returnType;
    let returnToken;
    let returnAux;
    try{
        auxR1 = termo()
        aux1 = auxR1.returnType;
        x--;
        coluna--;
    }catch(err){
        throw new Error({name:'erro na expressão aritmetica1'});
    }
    let result = scanner(allchr);

    if(result.type == "OPERADOR_SOMA" || result.type == "OPERADOR_SUB"){
        try{
            auxR2 = expreArit()
            aux2 = auxR2.returnType;
        }catch(err){
            throw new Error({name:'erro na expressão aritmetica2'});
        }

        //valor = type
        if(aux1 == 'VALOR_INT'){aux1 = 'TIPO_INT'}
        if(aux2 == 'VALOR_INT'){aux2 = 'TIPO_INT'}
        if(aux1 == 'VALOR_FLOAT'){aux1 = 'TIPO_FLOAT'}
        if(aux2 == 'VALOR_FLOAT'){aux2 = 'TIPO_FLOAT'}
        if(aux1 == 'VALOR_CHAR'){aux1 = 'TIPO_CHAR'}
        if(aux2 == 'VALOR_CHAR'){aux2 = 'TIPO_CHAR'}


        else if(aux1 == 'TIPO_INT' && aux2 == 'TIPO_FLOAT' && result.type ==  "OPERADOR_SOMA" ){ //int + float = float
            returnType = 'TIPO_FLOAT'
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} + ${auxR2.returnToken}`);
            OL++;
        }
        else if(aux2 == 'TIPO_INT' && aux1 == 'TIPO_FLOAT' && result.type ==  "OPERADOR_SOMA" ){ //float  + int = float
            returnType = 'TIPO_FLOAT'
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} + ${auxR2.returnToken}`);
            OL++;
        }
        else if(aux1 == 'TIPO_INT' && aux2 == 'TIPO_FLOAT' && result.type ==  "OPERADOR_SUB" ){ //int - float = float
            returnType = 'TIPO_FLOAT'
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} - ${auxR2.returnToken}`);
            OL++;
        }
        else if(aux2 == 'TIPO_INT' && aux1 == 'TIPO_FLOAT' && result.type ==  "OPERADOR_SUB" ){ //float  - int = float
            returnType = 'TIPO_FLOAT'
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} - ${auxR2.returnToken}`);
            OL++;
        }
        else if(aux1 == aux2){//tipos iguais 
            returnType = aux1;
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            if(result.type ==  'OPERADOR_SOMA'){
                console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} + ${auxR2.returnToken}`);
            }else{
                console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} - ${auxR2.returnToken}`);
            }
            
            OL++;
        }else{
            if(dev){
                console.log(`err, aux1 = ${aux1} aux2 = ${aux2}`)   //APAGAR
                console.log('erro nos tipos da expressão aritmetica')// APAGAR
            }
            throw new Error({name:'erro de incompatibilidade na expressão aritmetica'})
        }
    }else{ //só um termo
        returnType = aux1;
        returnToken = auxR1.returnToken;
        returnAux = { returnType,returnToken }

    }
    if(dev){
        console.log('expressão aritmetica bem formada'); //MAKE ME DEV
    }
    
    return returnAux;
    

}

function termo(){    //tested:ok  //semantico: ok  //GC: ok?.
    let aux1;
    let aux2;
    let auxR1;
    let auxR2;
    let returnType;
    let returnToken;
    let returnAux;
    try{
        auxR1 = fator();
        aux1 = auxR1.returnType;
    }catch(err){
        throw new Error({name:'erro no termo1'});
    }
    let result = scanner(allchr);
    if(result.type == "OPERADOR_MULT" || result.type == "OPERADOR_DIV"){
        try{
            auxR2 = termo();
            aux2 = auxR2.returnType;
        }catch(err){
            throw new Error({name:'erro no termo2'});
        }


        //valor = type
        if(aux1 == 'VALOR_INT'){aux1 = 'TIPO_INT'}
        if(aux2 == 'VALOR_INT'){aux2 = 'TIPO_INT'}
        if(aux1 == 'VALOR_FLOAT'){aux1 = 'TIPO_FLOAT'}
        if(aux2 == 'VALOR_FLOAT'){aux2 = 'TIPO_FLOAT'}
        if(aux1 == 'VALOR_CHAR'){aux1 = 'TIPO_CHAR'}
        if(aux2 == 'VALOR_CHAR'){aux2 = 'TIPO_CHAR'}
        


        
        if(aux1 == 'TIPO_INT' && aux2 == 'TIPO_INT' && result.type ==  "OPERADOR_DIV" ){ //int / int = float
            returnType = 'TIPO_FLOAT'
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} / ${auxR2.returnToken}`);
            OL++;
        }
        else if(aux1 == 'TIPO_INT' && aux2 == 'TIPO_FLOAT' && result.type ==  "OPERADOR_DIV" ){ //int / float = float
            returnType = 'TIPO_FLOAT'
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} / ${auxR2.returnToken}`);
            OL++;
        }
        else if(aux2 == 'TIPO_INT' && aux1 == 'TIPO_FLOAT' && result.type ==  "OPERADOR_DIV" ){ //float  / int = float
            returnType = 'TIPO_FLOAT'
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} / ${auxR2.returnToken}`);
            OL++;
        }
        else if(aux1 == 'TIPO_INT' && aux2 == 'TIPO_FLOAT' && result.type ==  "OPERADOR_MULT" ){ //int * float = float
            returnType = 'TIPO_FLOAT'
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} * ${auxR2.returnToken}`);
            OL++;
        }
        else if(aux2 == 'TIPO_INT' && aux1 == 'TIPO_FLOAT' && result.type ==  "OPERADOR_MULT" ){ //float  * int = float
            returnType = 'TIPO_FLOAT'
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} * ${auxR2.returnToken}`);
            OL++;
        }
        else if(aux1 == aux2){//tipos iguais 
            returnType = aux1;
            returnToken = newLabel();
            returnAux = {returnType,returnToken};
            if(result.type == "OPERADOR_DIV"){
                console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} / ${auxR2.returnToken}`);
            }else{
                console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} * ${auxR2.returnToken}`);
            }
            
            OL++;
        }else{
            if(dev){
                console.log(`err, aux1 = ${aux1} aux2 = ${aux2}`)   //APAGAR
                console.log('erro nos tipos do termo')// APAGAR
            }

            throw new Error({name:'erro de incompatibilidade no termo'})
        }
    }else{// só um fator 
        returnType = aux1;
        returnToken = auxR1.returnToken;
        returnAux = { returnType,returnToken }
    }
    if(dev){
        console.log('termo bem formado'); //MAKE ME DEV
    }

    return returnAux;

}

function expreRelacional(){ //tested:ok    //GC: ok
    let auxR1,auxR2;
    let returnType,returnToken,returnAux;
    try{
        auxR1 = expreArit();
        x--;
    }catch(err){
        throw new Error({name:'erro na expressão relacional1'});
    }

    let result = scanner(allchr)        //gambiarra para identificar o numero que foi pulado
    if(result.type == 'ATRIBUICAO'){
        x-=2;
    }else{
        x--;
    }

    result = scanner(allchr)
    if(result.type !== "DIFERENCA" && result.type !== "IGUALDADE"  && result.type !== "MAIOR" && result.type !== "MAIOR_IGUAL" && result.type !== "MENOR" && result.type !== "MENOR_IGUAL"){
        throw new Error({name:'erro na expressão relacional2'});
    }

    let auxSimbolo;
    if(result.type == "ATRIBUICAO"){
        auxSimbolo = '='
    }else if(result.type == "DIFERENCA"){
        auxSimbolo = '!='
    }else if(result.type == "IGUALDADE"){
        auxSimbolo = '=='
    }else if(result.type == "MAIOR"){
        auxSimbolo = '>'
    }else if(result.type == "MAIOR_IGUAL"){
        auxSimbolo = '>='
    }else if(result.type == "MENOR"){
        auxSimbolo = '<'
    }else if(result.type == "MENOR_IGUAL"){
        auxSimbolo = '<='
    }


    try{
        auxR2 = expreArit();
    }catch(err){
        throw new Error({name:'erro na expressão relacional3'});
    }
    if(dev){
        console.log('expressão relacional bem formada')
    }

    returnType = null
    returnToken = newLabel();
    returnAux = {returnType,returnToken};
    console.log(`${OL}: ${returnToken} = ${auxR1.returnToken} ${auxSimbolo} ${auxR2.returnToken}`);
    OL++;

    return returnAux;
    
}

function atribuicao(){ //tested:ok  //semantico: ok
    let result = scanner(allchr);
    let existVar;
    let returnType;
    let aux1,aux2,auxR1,auxR2;
    let returnAux,returnToken;
    if(result.type !== "ID"){
        throw new Error({name:'erro na atribuição1'});
    }
    let vari = {
        name: result.value,
        type: null,
        value:null,
        scope:escopoNumber
    }
    existVar = variavelExists(vari);
    auxR1 = existVar;
    aux1 = auxR1.type;
    result = scanner(allchr);
    if(result.type !== "ATRIBUICAO"){
        throw new Error({name:'erro na atribuição2'});
    }
    try{
        auxR2 = expreArit();
        aux2 = auxR2.returnType;
        x--;
    }catch(err){
        throw new Error({name:'erro na atribuição3'});
    }


    //valor = type
    if(aux1 == 'VALOR_INT'){aux1 = 'TIPO_INT'}
    if(aux2 == 'VALOR_INT'){aux2 = 'TIPO_INT'}
    if(aux1 == 'VALOR_FLOAT'){aux1 = 'TIPO_FLOAT'}
    if(aux2 == 'VALOR_FLOAT'){aux2 = 'TIPO_FLOAT'}
    if(aux1 == 'VALOR_CHAR'){aux1 = 'TIPO_CHAR'}
    if(aux2 == 'VALOR_CHAR'){aux2 = 'TIPO_CHAR'}
    

    if(aux1 == 'TIPO_FLOAT' && aux2 == 'TIPO_INT' ){ //float = int

        returnType = 'TIPO_FLOAT'
        let auxreturnToken = newLabel();
        returnToken = newLabel();
        returnAux = {returnType,returnToken};
        console.log(`${OL}: ${auxreturnToken} = ${auxR2.returnToken}(float)`);
        OL++;
        console.log(`${OL}: ${returnToken} = ${auxR1.name} = ${auxR2.returnToken}`);
        OL++;
    }
    else if(aux1 == aux2){//tipos iguais 
        returnType = aux1;
        returnToken = newLabel();
        returnAux = {returnType,returnToken};
        console.log(`${OL}: ${returnToken} = ${auxR1.name} = ${auxR2.returnToken}`);
        OL++;
    }else{
        if(dev){
            console.log(`err, aux1 = ${aux1} aux2 = ${aux2}`)   //APAGAR
            console.log('erro nos tipos da atribuição')// APAGAR
        }

        throw new Error({name:'erro de incompatibilidade na atribuição'})
    }

    result = scanner(allchr);
    if(result.type !== "PV"){
        throw new Error({name:'erro na atribuição4'});
    }

    if(dev){
        console.log('atribuição retornando:',returnType);    //APAGAR
        console.log('atribuição bem formada')
    }


    
    return returnAux;
}

function comandoBasico(){ //tested:ok
    let prex = x;
    try{
        atribuicao();     
    }catch(err){
        x = prex;
        try{
            bloco();
        }catch(err){
            throw new Error({name:'erro no comando basico'});
        }   
    }
    if(dev){
        console.log('comando basico bem formado')
    }

}

function bloco(){ //tested: false
    let result = scanner(allchr);
    if(result.type !== "AC"){
        throw new Error({name:'erro na bloco1'});
    }
    escopoNumber++;
    let prex = x;
    result = scanner(allchr);
    while(result.type == "TIPO_INT" || result.type == "TIPO_FLOAT" || result.type == "TIPO_CHAR" || result.type == "ID" || result.type == "DO" || result.type == "WHILE"|| result.type == "AC"|| result.type == "IF" ){
       
        if(result.type == "TIPO_INT" || result.type == "TIPO_FLOAT" || result.type == "TIPO_CHAR" ){ //declarar variavel
            try{
                x = prex;
                declararVariavel()
            }catch(err){
                throw new Error({name:'erro na bloco2'});
            }
            
        }

        if(result.type == "ID" || result.type == "DO" || result.type == "WHILE"|| result.type == "AC"|| result.type == "IF" ){ //declarar variavel
            try{
                x = prex;
                comando()
            }catch(err){
                throw new Error({name:'erro na bloco3'});
            }
            
        }
        prex = x;
        result = scanner(allchr);
    }

    if(result.type !== "FC"){
        throw new Error({name:'erro na bloco4'});
    }
    escopoNumber--;
    eliminateVariables(escopoNumber);
    if(dev){
        console.log('bloco bem formado')
    }


}

function eliminateVariables(scope){
    let filtered = tabelaSimbolos.filter(a=>{return a.scope <= scope});
    tabelaSimbolos = filtered;
}

function variavelCheck(vari){
    tabelaSimbolos.forEach(a=>{
        if(a.name == vari.name){
            if(a.scope == vari.scope){
                throw new Error('variavel já declarada neste escopo')
            }
        }
    })
}

function variavelExists(vari){
    let tabelaSimbolosRev = tabelaSimbolos;
    tabelaSimbolosRev.reverse();
    let result = null;
    tabelaSimbolosRev.forEach(a=>{
        if(a.name == vari.name && a.scope <= vari.scope){
            result = a;
        }
    })
    if(!result){
        throw new Error({name:'variavel não inicializada'})
    }else{
        return result;
    }
}

function declararVariavel(){ //test:ok
    let pre = [];
    let type;
    let name;

    try{
        type = tipo();
    }catch(err){
        throw new Error({name:'erro na declaração de variavel1'});
    }
    let result = scanner(allchr);
    if(result.type !== "ID"){
        throw new Error({name:'erro na declaração de variavel2'});
    }
    name = result.value;

    let test = {
        name:name,
        type: type,
        value: null,
        scope: escopoNumber
    };

    variavelCheck(test);

    pre.push(test)

    result = scanner(allchr);
    while(result.type == "VIR"){
        result = scanner(allchr);
        if(result.type !== "ID"){
            throw new Error({name:'erro na declaração de variavel3'});  
        }
        name = result.value;

        test = {
            name:name,
            type: type,
            value: null,
            scope: escopoNumber
        }

        variavelCheck(test);
        
        pre.push(test)

        result = scanner(allchr);
    }
    if(result.type !== "PV"){
        throw new Error({name:'erro na declaração de variavel4'});
    }

    tabelaSimbolos = tabelaSimbolos.concat(pre);
    if(dev){
        console.log('declaração de variavel correta')
    }

}

function tipo(){    //test:ok
    let result = scanner(allchr);
    if(result.type !== "TIPO_INT" && result.type !== "TIPO_FLOAT" && result.type !== "TIPO_CHAR"){
        throw new Error({name:'erro no tipo'});
    }

    if(dev){
        console.log('tipo correto') //DEV ME 
    }

    return result.type; 
}

function condicional(){ //test:ok 
    let auxR1;

    let returnAux,returnToken,returnType;
    let result = scanner(allchr);
    if(result.type !== "IF"){
        throw new Error({name:'erro no condicional1'});
    }
    result = scanner(allchr);
    if(result.type !== "AP"){
        throw new Error({name:'erro no condicional2'});
    }

    try{
        auxR1 = expreRelacional();
        x--;
    }catch(err){
        throw new Error({name:'erro no condicional3'});
    }

    result = scanner(allchr);
    if(result.type !== "FP"){
        throw new Error({name:'erro no condicional4'});
    }

    let lablabA = newLabelLabel();

    console.log(`${OL}: if ${auxR1.returnToken} == 0 goto ${lablabA}`);
    OL++;


    try{
        comando(); 
    }catch(err){
        throw new Error({name:'erro no condicional5'});
    }

    

    let prex = x;
    let lablabB;
    result = scanner(allchr);
    if(result.type == 'ELSE'){
        lablabB = newLabelLabel();
        console.log(`GOTO ${lablabB}`);
        OL++;
    }
    console.log(`${lablabA}:`);
    OL++;
    if(result.type == "ELSE" ){ //ELSE
        try{
            comando() 
            console.log(`${lablabB}:`);
            OL++;
        }catch(err){
            throw new Error({name:'erro no condicional6'});
        }
    }else{
        x = prex;
    }

    if(dev){
        console.log('condicional correto')
    }
    
}

function iteracao(){ //test:ok
    let prex = x;
    try{
        enquanto();
    }catch(err){
        x = prex;
        fazerEnquanto();
    }

    if(dev){
        console.log('iteração correta')
    }
    
}

function enquanto(){    //test: ok 
    let auxR1;
    let labelA = newLabelLabel();
    let result = scanner(allchr);
    if(result.type !== "WHILE"){
        throw new Error({name:'erro no while1'});
    }
    result = scanner(allchr);
    if(result.type !== "AP"){
        throw new Error({name:'erro no while2'});
    }


    console.log(`${labelA}:`);
    OL++;

    try{
        auxR1 = expreRelacional();
        x--;
    }catch(err){
        throw new Error({name:'erro no while3'});
    }

    let labelB = newLabelLabel();

    console.log(`if ${auxR1.returnToken} == 0 goto ${labelB}`);
    OL++;

    result = scanner(allchr);
    if(result.type !== "FP"){
        throw new Error({name:'erro no while4'});
    }

    try{
        comando(); 
    }catch(err){
        throw new Error({name:'erro no while3'});
    }
    console.log(`GOTO ${labelA}`);
    OL++;
    console.log(`${labelB}:`);
    OL++;

    if(dev){
        console.log('while bem formado');
    }
    
}

function fazerEnquanto(){ //test:ok 
    let auxR1;
    let labelA = newLabelLabel();
    let result = scanner(allchr);
    if(result.type !== "DO"){
        throw new Error({name:'erro no dowhile1'});
    }
    console.log(`${labelA}:`);
    OL++;

    try{
        comando(); 
    }catch(err){
        throw new Error({name:'erro no dowhile2'});
    }

    result = scanner(allchr);
    if(result.type !== "WHILE"){
        if(dev){
            console.log('esperava WHILE recebeu:',result.type)
        }

        throw new Error({name:'erro no dowhile3'});
    }

    result = scanner(allchr);
    if(result.type !== "AP"){
        throw new Error({name:'erro no dowhile4'});
    }

    try{
       auxR1 = expreRelacional();
        x--;
    }catch(err){
        throw new Error({name:'erro no dowhile5'});
    }

    console.log(`if ${auxR1.returnToken} != 0 goto ${labelA}`);
    OL++;

    result = scanner(allchr);
    if(result.type !== "FP"){
        throw new Error({name:'erro no dowhile6'});
    }

    result = scanner(allchr);
    if(result.type !== "PV"){
        throw new Error({name:'erro no dowhile7'});
    }
   
    if(dev){
        console.log('dowhile bem formado');
    }

}

function comando(){ //test: ok
    let prex = x;
    try{
        comandoBasico()
    }catch(err){
        x = prex;
        try{
            iteracao();
        }catch(err){
            x = prex;
            try{
                condicional();
            }catch(err){
                throw new Error({name:'erro no comando'});
            }
        }
    }
    if(dev){
        console.log('comando correto')
    }

}

function programa(){ //test:false
    let result = scanner(allchr);
    if(result.type !== "TIPO_INT"){
        throw new Error({name:'erro no programa 1'});
    }
    result = scanner(allchr);
    if(result.type !== "MAIN"){
        throw new Error({name:'erro no programa 2'});
    }
    result = scanner(allchr);
    if(result.type !== "AP"){
        throw new Error({name:'erro no programa 3'});
    }
    result = scanner(allchr);
    if(result.type !== "FP"){
        throw new Error({name:'erro no programa 4'});
    }
    try{
        bloco();
    }catch(err){
        throw new Error({name:'erro no programa 5'});
    }

    if(dev){
        console.log('programa correto')
    }

}



function newLabel(){

    let label = 't'+labelCount;
    labelCount++;
    return label;
}

function newLabelLabel(){
    let label = 'l'+labelCount;
    labelCount++;
    return label;
}