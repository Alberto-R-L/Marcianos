var marcianoa = [];
var disparoa;
var cambioDir = false;
var bajar = false;
var ronda = 0;

var mouseX;
var mouseY;
var mouseClick = false;
var nave2;
var disparos_cuenta = 0;
var disparos = [];
var estado = 0; // 0 = en juego, 1 = ganado, 2 = perdido


//Trackear el mouse

var elementoSelec, offset;
function startDrag(evt) {
  
    elementoSelec = evt.target;
    offset = getMousePosition(evt);
    offset.x -= parseFloat(elementoSelec.getAttributeNS(null, "x"));
    offset.y -= parseFloat(elementoSelec.getAttributeNS(null, "y"));
  
}



window.addEventListener('mousemove', function (e){
    console.log(e)
    mouseX = e.clientX;
    nave2.yo.setAttribute("cx", mouseX);

});




//clase nave
class nave{
    constructor(radio, color, x, y){
        this.r = radio;
        this.color = color;
        this.x = x;
        this.y = y;

        //repersentar nave
        this.yo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.yo.setAttributeNS(null, "cx", this.x);
        this.yo.setAttributeNS(null, "cy", this.y);
        this.yo.setAttributeNS(null, "r", this.r);
        this.yo.setAttributeNS(null, "fill", this.color);
        document.getElementsByTagName("svg")[0].appendChild(this.yo);

    }

    animarNave(nave){
        let posXact = parseInt(this.yo.getAttribute("cx"));
        this.yo.setAttribute(this.x, mouseX);
    }
}







//clase marciano
class marciano{
    constructor(radio, color, x, y, vida, velX, velY){
        this.r = radio;
        this.color = color;
        this.x = x;
        this.y = y;
        this.vida = vida;
        this.velX = velX;
        this.velY = velY;
        this.dead = false;
        this.bajar = false;
        //repersentar marciano
        this.bob = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.bob.setAttributeNS(null, "cx", this.x);
        this.bob.setAttributeNS(null, "cy", this.y);
        this.bob.setAttributeNS(null, "r", this.r);
        this.bob.setAttributeNS(null, "fill", this.color);
        document.getElementsByTagName("svg")[0].appendChild(this.bob);
    }

    dibuja(marcianoa){

        if ( this.dead ) {
            let posYact = 760;
            this.bob.setAttribute("cy", posYact);
            return 0;
        } 
        
        
        if(cambioDir){
            let posXact = parseInt(this.bob.getAttribute("cx"))+this.velX;
            this.bob.setAttribute("cx", posXact);
        
            
        } else {

            let posXact = parseInt(this.bob.getAttribute("cx"))-this.velX;
            this.bob.setAttribute("cx", posXact);
        }

        if(this.bajar){
            let posYact = parseInt(this.bob.getAttribute("cy"))+this.velY;
            this.bob.setAttribute("cy", posYact);  
            this.bajar = false;
            if (posYact > 1000){
                estado = 2;
            }
        }
    }

    getX() {
        return this.bob.getAttribute("cx");
    }
    getY() {
        return this.bob.getAttribute("cy");
    }
    matar() {
        this.bob.remove();
        this.dead = true;
    }

}


    //Clase Disparo Nave
    class disparoN{
        constructor(radio, color, x, y, velX, velY){
        this.r = radio;
        this.color = color;
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.estaDisparandose = true;
        //Representar disparo
        this.shoot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.shoot.setAttributeNS(null, "cx", this.x);
        this.shoot.setAttributeNS(null, "cy", this.y);
        this.shoot.setAttributeNS(null, "r", this.r);
        this.shoot.setAttributeNS(null, "fill", this.color);
        document.getElementsByTagName("svg")[0].appendChild(this.shoot);
        

        
        }

        dibuja(disparoa){
            this.y = parseInt(this.shoot.getAttribute("cy")) + this.velY;
            
            if ( this.y < -400 ) {
                this.shoot.remove();
            } else {
                this.shoot.setAttribute("cy", this.y);
                this.y = -400;
            }

            
        }

        getX() {
            return this.shoot.getAttribute("cx");
        }
        getY() {
            return this.shoot.getAttribute("cy");
        }

        matar() {
            this.shoot.remove();
        }
        
    }


pitagoras = function(x1,y1,x2,y2) {
    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}



window.onload = function(){

    //Cargar nave
    nave2 = new nave(20, "lime", 950, 900);
    //Cargar marcianos
    marcianoa = [];
    for(var f = 0; f<10; f++){
        marcianoa.push(new marciano(20, "orange", 500 + f*100, 100, 1, 2, 5));
    }
    for(var f = 0; f<10; f++){
        marcianoa.push(new marciano(20, "red", 500 + f*100, 200, 1, 2, 5));
    }
    for(var f = 0; f<10; f++){
        marcianoa.push(new marciano(20, "purple", 500 + f*100, 300, 1, 2, 5));
    }
    for(var f = 0; f<10; f++){
        marcianoa.push(new marciano(20, "blue", 500 + f*100, 400, 1, 2, 5));
    }
    for(var f = 0; f<10; f++){
        marcianoa.push(new marciano(20, "cyan", 500 + f*100, 500, 1, 2, 5));
    }
    setInterval(animarMarcianos, 30);
    setInterval(animarDisparo, 30);
    setInterval(cambiarDireccion, 3000);
    setInterval(funcionBajar, 600);
    
}

//Animar marcianos
function animarMarcianos(){
    for (i=0; i<marcianoa.length; i++){
        marcianoa[i].dibuja();
    }
}

//Animar disparos
function animarDisparo(){
    console.log("CACA " + disparos.length);
    if ( disparos.length > 0 ) {
        for ( i = 0 ; i < disparos.length ; i++ ) {
            disparos[i].dibuja();
        }
        for ( i = disparos.length-1 ; i >= 0  ; i-- ) {
            if ( disparos[i].getY() < 0 ) {
                matardisparo(i)
            }
        }
    }
    // MATAR MARCIANOS
    for ( i = 0 ; i < marcianoa.length ; i ++ ) {
        for ( j = 0 ; j < disparos.length ; j ++ ) {
            if ( pitagoras( disparos[j].getX(), disparos[j].getY(), marcianoa[i].getX(), marcianoa[i].getY() ) < 20 && !marcianoa[i].dead ) {
                matardisparo(j);
                matarmarciano(i);
                break
            }
        }
    }
   
    
}

function cambiarDireccion(){
    cambioDir_antes = cambioDir;
    if(cambioDir == false)
        cambioDir = true;
    else
        cambioDir = false;
    if (cambioDir != cambioDir_antes ) {
        ronda += 1;
    }
}

function funcionBajar(){
    for ( i = 0 ; i < marcianoa.length ; i ++ ) {
        marcianoa[i].bajar = true;
    }
}



//Disparo Nave
//window.addEventListener('mousedown', matardisparo);
window.addEventListener('mouseup', disparar);

function matardisparo(i) {
    disparos[i].matar();
    delete(disparos.pop(i));
}

function matarmarciano(i) {
    marcianoa[i].matar();
    //delete(marcianoa.pop(i));
}


function disparar(e) {
    if (typeof e === 'object') {
        if(e.button == 0) {
            
            if ( disparos.length != 1) {
                disparos[disparos.length] = new disparoN(5, "red", mouseX, 900, 0, -15);
            }
            /*
            tmp = false;
            for ( i = 0 ; i < max_disparos ; i ++ ) {
                if ( disparos[i] == null || !estaDisparandose[i] ) {
                    disparos[i] = new disparoN(5, "red", mouseX, 900, 0, -25);
                    estaDisparandose[i] = true;
                    console.log(i + "KAKA");
                    tmp = true;
                    break;
                }
            }

            if ( !tmp ) {
                disparos[1] = new disparoN(5, "red", mouseX, 900, 0, -25);
                matardisparo(1);
                estaDisparandose[1] = true;
            }
            */
        }

    }
}


//control de victoria
if(estado == 1){
    alert("Has ganado")
} else if (estado == 2){
    alert("Has perdido")
} else {

}