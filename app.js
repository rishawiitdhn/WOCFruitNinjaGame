let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 585;
let gravity = 0;
let scoreData = 0;
let scorePara = document.querySelector("#score");
let msg = document.querySelector("#msg");
let msgContainer = document.querySelector(".msg-container");
let newGameBtn = document.querySelector("#newGame");
let startGameBtn = document.querySelector("#startGame");
let mousePath = []; 
const maxPathLength = 5;
let missedCount = 0;
let gameOverTriggered = false;
let missedFruits = document.querySelector(".missedFruits");
let bestScore = document.querySelector("#bestScore");
let best = document.querySelector("#best");



c.fillRect(300, 100, canvas.width, canvas.height);

class images {
    constructor({position, imageSrc, scale = 1,framesMax = 1}) {
    this.position = position;
    this.height = 50;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    
    }
    draw() {
        c.drawImage(this.image,
             this.framesCurrent*(this.image.width / this.framesMax),
             0,
             this.image.width / this.framesMax,
             this.image.height,
             this.position.x,
             this.position.y,
             (this.image.width/this.framesMax)*this.scale,
             this.image.height*this.scale
            );
        
    }

    update () {
        this.draw();
        this.framesElapsed ++;
        if(this.framesElapsed % this.framesHold === 0){
        if(this.framesCurrent < this.framesMax - 1){
            this.framesCurrent++;
        }
        else{
            this.framesCurrent = 0;
        }}
    }
}


class sprite extends images {
    constructor({position, velocity, height = 50, color = "red", upward, score, imageSrc, scale = 1,framesMax = 1,}) {

        super({
            position,
            imageSrc,
            scale,
            framesMax,
         })
    this.position = position;
    this.velocity = velocity;
    this.height = height;
    this.width = 50;
    this.color = color;
    this.upward = true;
    this.score = score;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 20;
    this.isMissed = false;
    
    }
    
    update () {
        this.draw();
        this.framesElapsed ++;
        if(this.framesElapsed % this.framesHold === 0){
        if(this.framesCurrent < this.framesMax -1){
            this.framesCurrent++;
        }
        else{
            this.framesCurrent = 0;
        }}
        if(this.upward){
        this.position.x += this.velocity.x;
        this.position.y -= this.velocity.y;
        if(this.position.y + this.height + this.velocity.y <= 250){
            this.upward = false;
        }
        
    }
       else{
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.position.y + this.height >= canvas.height + 100){


            this.velocity.y = 0;
            this.velocity.x = 0;
            this.position.y = 100 + canvas.height - this.height;
        }
        this.position.y += gravity;
        this.upward = false;
       }
    }
}

const background = new images ({
    position: {
        x: 300,
        y: 100
    },
    imageSrc: './background_image_resized.jpg',
}) 

const banana = new sprite({
   position :{
    x: 500,
    y: 635
   },
   velocity: {
    x: 0.5,
    y: 1.5
   },
   color: "purple",
   score: 1,
   imageSrc : './new_banana-removebg-preview.png',
   framesMax: 10,
   scale: 0.5
});
const orange = new sprite({
    position :{
     x: 560,
     y: 635
    },
    velocity: {
     x: 0.75,
     y: 1
    }, 
    color : 'blue',
    score: 2,
    imageSrc : './orange-removebg-preview.png',
   framesMax: 10,
   scale: 0.6
 });
 const watermelon = new sprite({
    position :{
     x: 560,
     y: 635
    },
    velocity: {
     x: 1,
     y: 2
    },
    color: 'green',
    score: 5,
    imageSrc : './watermelon1-removebg-preview.png',
    framesMax: 10,
    scale: 0.8
 });
 const redApple = new sprite({
    position :{
     x: 600,
     y: 635
    },
    velocity: {
     x: 0.75,
     y: 1.5
    },
    color: 'pink',
    score: 3,
    imageSrc : './new_apple_page-0001-removebg-preview.png',
    framesMax: 8,
    scale: 0.5, 
 });
 
 const bomb = new sprite({
    position :{
     x: 620,
     y: 635
    },
    velocity: {
     x: 1,
     y: 3
    },
    color: 'white',
    score: 0,
    imageSrc : './bomb-removebg-preview.png',
    framesMax: 10   
 });
 const scoreImg = new images ({
    position: {
        x: 300,
        y: 100
    },
    scale: 0.8,
    imageSrc: 'melon.png',
}) 

let fruits = [banana, orange, watermelon, redApple, bomb];

let fruitSlice = new Audio("Music4.mp3");
fruitSlice.volume = 0.5;

function checkSlice(fruit) {
    for (let i = 0; i < mousePath.length - 1; i++) {
        const p1 = mousePath[i];
        const p2 = mousePath[i + 1];
        
       
        if (
            p1.x < fruit.position.x + fruit.width &&
            p2.x > fruit.position.x &&
            p1.y < fruit.position.y + fruit.height &&
            p2.y > fruit.position.y 
        ) {
            fruitSlice.currentTime = 0;
            fruitSlice.play();
            return true; // Fruit is sliced
        }
    }
    return false;
}


let fruitNumber1;
let fruitNumber2;
let timeInterval;
let audio = new Audio("horror.mp3");
    audio.volume = 0.7;
const backgroundMusic = new Audio("fruite_ninja.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;
let musicStarted = false;


newGameBtn.classList.add("hide");
startGameBtn.addEventListener("click", () => {
        

        if(!musicStarted){
        backgroundMusic.play();
        musicStarted = true;
        }
        audio.play();
        startGameBtn.classList.add("hide");
        newGameBtn.classList.remove("hide");
        timeInterval = setInterval(() => {
        fruitNumber1 = Math.floor(Math.random() * fruits.length);
        fruitNumber2 = Math.floor(Math.random() * fruits.length);
        console.log(fruitNumber1);
        console.log(fruitNumber2);
    
    
        fruits.forEach((fruit) => {
            fruit.position.x = 400 + Math.random() * (canvas.width /5); 
            fruit.position.y = 635; 
            fruit.velocity.x = Math.random() + 0.8; 
            fruit.velocity.y = Math.random() * 2 + 1.5; 
            fruit.upward = true;
        });
    
    }, 4000);
     
})

let endGame = new Audio("game over (mp3cut.net).mp3");
endGame.volume = 0.3;
//gameOver condition after slicing bomb:
function gameover1(fruit) {
    if(fruit == bomb){
        let bomb = new Audio("bomb.mp3");
        bomb.play();
        bomb.volume=0.5;
        audio.play();
        endGame.play();
        backgroundMusic.pause();
        clearInterval(timeInterval);
        msgContainer.classList.remove("hide");
       fruits.forEach((fruit) => {
        fruit.position.y = 635;
        fruit.velocity.x = 0;
        fruit.velocity.y = 0;
       })
    }
}

function gameover2() {
    if (gameOverTriggered) return; 
    gameOverTriggered = true;
    console.log("Game Over: Too many unsliced fruits!");
    audio.play();
    endGame.play();
    backgroundMusic.pause();
    clearInterval(timeInterval);
    msgContainer.classList.remove("hide");

   
    fruits.forEach((fruit) => {
        fruit.position.y = 635;
        fruit.velocity.x = 0;
        fruit.velocity.y = 0;
        fruit.isMissed = false; 
    });

}



newGameBtn.addEventListener(("click") , () => {
    audio.play();
    backgroundMusic.play();
    msgContainer.classList.add("hide");
    clearInterval(timeInterval);
    fruit.isMissed = false;
    missedCount = 0;
    gameOverTriggered = false;
    missedFruits.innerText = "";
  
    fruits.forEach((fruit) => {
        fruit.position.x = 400 + Math.random() * (canvas.width /5); 
        fruit.position.y = 635; 
        fruit.velocity.x = Math.random() + 0.2; 
        fruit.velocity.y = Math.random() * 2 + 0.5; 
        fruit.upward = true;
    });

    timeInterval = setInterval(() => {
    fruitNumber1 = Math.floor(Math.random() * fruits.length);
    fruitNumber2 = Math.floor(Math.random() * fruits.length);
    console.log(fruitNumber1);
    console.log(fruitNumber2);


    fruits.forEach((fruit) => {
        fruit.position.x = 400 + Math.random() * (canvas.width /5); 
        fruit.position.y = 635; 
        fruit.velocity.x = Math.random() + 0.2; 
        fruit.velocity.y = Math.random() * 2 + 0.5; 
        fruit.upward = true;
        fruit.isMissed = false;
    });

}, 4000);
    scoreData = 0;
    scorePara.textContent = `${scoreData}`;
});


let missing = new Audio("xyz (mp3cut.net).mp3");  
let fruit;
function ejecting () {
    
    if(fruitNumber1 <= fruitNumber2){
    for(let i=fruitNumber1; i<=fruitNumber2; i++){
        fruit = fruits[i];
        fruit.update();


        // Check if the fruit is sliced
        if (checkSlice(fruit)) {
            console.log(`${fruit.color} fruit sliced!`);
            
            scoreData += fruit.score;
            scorePara.textContent = `${scoreData}`;
            
            if(bestScore.innerText<=scoreData){
                bestScore.innerText = scoreData;
            }
        
            // Remove or reset the fruit
            fruit.position.y = canvas.height + 100; 
            fruit.velocity.x = 0;
            fruit.velocity.y = 0;
            gameover1(fruit);
            fruit.isMissed = true;
    }  
    else {
        if (fruit.position.y + fruit.height >= canvas.height + 100 && !fruit.isMissed && fruit !== bomb ) {
        fruit.isMissed = true;
        missedCount++;
        console.log(`Missed count: ${missedCount}`);
        if(missedCount === 1){
            missedFruits.innerText = "X";
            missing.play();
        }
        else if(missedCount === 2){
            missedFruits.innerText = "X X";
            missing.play();
        }
        else if(missedCount === 3){
            missedFruits.innerText = "X X X";
            missing.play();
        }

        if (missedCount >= 3) {
            gameover2(); 
        }


        fruit.position.y = 635;
        fruit.velocity.x = 0;
        fruit.velocity.y = 0;
    }
}
    }
}
    else if(fruitNumber1 > fruitNumber2){
        for(let i=fruitNumber1; i>=fruitNumber2; i--){
            fruit = fruits[i];
            fruit.update();

    if (checkSlice(fruit)) {
        console.log(`${fruit.color} fruit sliced!`);

        scoreData += fruit.score;
        scorePara.textContent = `${scoreData}`;

        if(bestScore.innerText<=scoreData){
            bestScore.innerText = scoreData;
        }

         fruit.position.y = canvas.height + 100; 
         gameover1(fruit);
         fruit.isMissed = true;
    }
    else {
        if (fruit.position.y + fruit.height >= canvas.height + 100 && !fruit.isMissed && fruit !== bomb) {
        fruit.isMissed = true;
        missedCount++;
        console.log(`Missed count: ${missedCount}`);
        if(missedCount === 1){
            missedFruits.innerText = "X";
            missing.play();
        }
        else if(missedCount === 2){
            missedFruits.innerText = "X X";
            missing.play();
        }
        else if(missedCount === 3){
            missedFruits.innerText = "X X X";
            missing.play();
        }

        if (missedCount >= 3) {
            gameover2(); 
        }

        fruit.position.y = 635;
        fruit.velocity.x = 0;
        fruit.velocity.y = 0;
    }
}
}    
}        
}


let slicingSound = new Audio("waving.mp3");
slicingSound.volume = 0.3; 
let lastSoundTime = 0; 
const soundInterval = 800; 

canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    
    mousePath.push({ x: mouseX, y: mouseY });

   
    if (mousePath.length > maxPathLength) {
        mousePath.shift();
    }
    const currentTime = Date.now();
    if (currentTime - lastSoundTime > soundInterval) {
        slicingSound.currentTime = 0; 
        slicingSound.play();
        lastSoundTime = currentTime;
    }
});

function drawSlice() {
    c.strokeStyle = "white";
    c.lineWidth = 2;
    c.beginPath();
    for (let i = 0; i < mousePath.length; i++) {
        const point = mousePath[i];
        if (i === 0) {
            c.moveTo(point.x, point.y);
        } else {
            c.lineTo(point.x, point.y);
        }
    }
    c.stroke();
}

const animate = () => {
window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(300, 100, canvas.width, canvas.height - 100);
    background.update();
    scoreImg.update();
    ejecting();
    drawSlice(); 
}
animate();


