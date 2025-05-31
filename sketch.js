//Configurando para Mobile

let posicao; //posicao atual do circulo
let alvo; //ponto final(onde foi clicado)
let vel; //vetor velocidade
let acc; //vetor aceleração


function setup() {
  createCanvas(windowWidth, windowHeight);
  posicao = createVector(width/2, height/2);
  alvo=posicao.copy();
  vel = createVector(0,0);
  acc = createVector(0,0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function touchStarted() {
  alvo = createVector(mouseX, mouseY);
  return false;
}

function draw() {
  background(255);
  
  //Desenha circulo
  fill(0);
  circle(posicao.x, posicao.y, 30);
  
  desenhaAlvo();

  //Calcula vetor direção do circulo ao alvo
  let direcao = p5.Vector.sub(alvo, posicao);
  let distancia = direcao.mag();
  
  //Se tiver longe aplica aceleração
  if(distancia >2){
    direcao.normalize(); //direção unitária
    direcao.mult(0.8); //força da acc
    acc = direcao;    
  } else{
    acc.set(0,0);
    vel.set(0,0);
    posicao = alvo.copy();
  }
  vel.add(acc); //aplica acc
  vel.limit(5); //limita a vel
  posicao.add(vel); //move o objeto
  
  //---DESENHA VETORES---
  //Vetor posição a partir da origem até o circulo
  stroke('blue');
  desenhaVetor(posicao.copy(), createVector(0,0), 'blue');
  
  //Vetor alvo da origem ao ponto clicado
  stroke('green');
  desenhaVetor(alvo.copy(), createVector(0,0), 'green');
  
  //Vetor Direção da posição ao alvo
  stroke('red')
  desenhaVetor(p5.Vector.sub(alvo, posicao), posicao.copy(), 'red');
  
  //Legenda
  noStroke();
  fill('blue'); text("Posição", 10,20);
  fill('green'); text("Alvo", 10,40);
  fill('red'); text("Direção", 10,60); 
}

//Função para desenhar vetor
function desenhaVetor(vetor, origem, cor){
  push();
  stroke(cor);
  fill(cor);
  translate(origem.x, origem.y);
  line(0,0,vetor.x, vetor.y);
  
  //Desenha Seta
  let tam=7;
  let ang = atan2(vetor.y, vetor.x);
  translate(vetor.x, vetor.y);
  rotate(ang);
  triangle(0,0,-tam, tam/2, -tam, -tam/2);
  pop();
  
  //Desenha Alvo
  noFill();
  stroke('red');
  circle(mouseX, mouseY, 40);  
}

function mousePressed(){
  alvo= createVector(mouseX, mouseY);  
}

function desenhaAlvo(){
  noFill();
  stroke('red');
  circle(alvo.x, alvo.y, 40);
}