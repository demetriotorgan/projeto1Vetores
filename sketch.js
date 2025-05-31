//Adicionando Perseguidor
//Vetores do Perseguidor
//Adicionando Itens aleatórios
//Criando Tela de colisão
//Pontuação

let posicao; //posicao atual do circulo
let alvo; //ponto final(onde foi clicado)
let vel; //vetor velocidade
let acc; //vetor aceleração
let posPerseguidor;
let velPerseguidor;
let itens = [];
let raioItem=15;
let gameOver = false;
let botaoRestart;
let pontos;


function setup() {
  createCanvas(windowWidth, windowHeight);
  posicao = createVector(width/2, height/2);
  alvo=posicao.copy();
  vel = createVector(0,0);
  acc = createVector(0,0);
  pontos = 0;
  
  posPerseguidor = createVector(windowWidth/2, 0);
  velPerseguidor = createVector(0,0);
  
  for(let i=0; i<10;i++){
    let item = createVector(random(width), random(height));
    itens.push(item);
  }
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
  if(!gameOver){
  //Desenha circulo
  fill(0);
  circle(posicao.x, posicao.y, 30);  
  desenhaAlvo();
  
  //cria vetor da posição atual até o jogador
  let target = createVector(posicao.x, posicao.y);
  let dirPerseguidor = p5.Vector.sub(target, posPerseguidor); //Vetor Direção
  dirPerseguidor.setMag(2); //velocidade constante
  
  //aplica a direção como vel
  velPerseguidor = dirPerseguidor;
  posPerseguidor.add(velPerseguidor);
  
  //Desenha Perseguidor
  push();
  fill(50,100,255);
  noStroke();
  circle(posPerseguidor.x, posPerseguidor.y, 30);  
  
  //Desenha vetor da direção do perseguidor
  stroke(0);
  strokeWeight(2);
  line(posPerseguidor.x, posPerseguidor.y, posPerseguidor.x + velPerseguidor.x*10, posPerseguidor.y + velPerseguidor.y*10);
  pop();

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
  
  //Gerando Itens
  for(let i = itens.length -1; i>=0;i--){
    let item = itens[i];
    
    //Desenha item
    fill('orange');
    noStroke();
    circle(item.x, item.y, raioItem*2);
    
    //Verifica colisão
    let d = dist(posicao.x, posicao.y, item.x, item.y);
    if(d < raioItem + 15){
      itens.splice(i,1);  
      pontos ++;
    }
  }
   verificaColisaoPerseguidor();
   placar();
      
  }else{
    //Desenha tela do Game Over
    push();
    textAlign(CENTER, CENTER);
    textSize(40);
    fill('red');
    text("GAME OVER", width/2, height/2);
    pop();
  }
  }

//------------------------------------------
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

function verificaColisaoPerseguidor(){
  let d = dist(posicao.x, posicao.y, posPerseguidor.x, posPerseguidor.y);
  if(d < 15){
   gameOver = true;
    //cria botao de restart
    if(!botaoRestart){
      botaoRestart = createButton("Recomeçar");
      botaoRestart.position(width/2 -50, height/2+30);
      botaoRestart.mousePressed(reiniciarJogo);
    }
  }
}

function reiniciarJogo(){
  gameOver=false;
  posicao = createVector(width/2, height/2);
  alvo= posicao.copy();
  vel.set(0,0);
  acc.set(0,0);
  posPerseguidor = createVector(width/2, 0);
  velPerseguidor= set(0,0);
  pontos = 0;
  
  //gerando novos itens
  itens = [];
  for(let i = 0; i <10; i++){
    itens.push(createVector(random(width), random(height)));
  }
  //Remove Botão
  if(botaoRestart){
    botaoRestart.remove();
    botaoRestart = null;
  }
}

function placar(){
  let w = 180; // largura da caixa
  let h = 50;  // altura da caixa
  let x = width - w - 20; // margem da direita
  let y = 20; // margem do topo

  push();
  // Sombra da caixa
  noStroke();
  fill(0, 0, 0, 50); // sombra preta com transparência
  rect(x+5, y+5, w, h, 15);

  // Caixa principal
  fill(255, 150, 0); // laranja claro
  stroke(255, 100, 0); // borda laranja escura
  strokeWeight(2);
  rect(x, y, w, h, 15); // caixa com cantos arredondados

  // Texto do placar
  fill(255); // branco
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(BOLD);
  text("Pontos: " + pontos, x + w / 2, y + h / 2);
  pop();
}