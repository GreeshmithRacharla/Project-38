var dog,happydog,database,FoodS,FoodStock;
var dogimage,happydogimage,milkbottleimg;
var fedTime,lastFed,foodObj,feed,addfood;
var changingState,readingState;
var bedroomIMG,gardenIMG,washroomIMG,saddog;
var livingroom;

function preload(){
	 dogimage = loadImage("images/Dog.png");
   happydogimage = loadImage("images/happy dog.png");
   bedroomIMG = loadImage("images/Bed Room.png");
   gardenIMG = loadImage("images/Garden.png");
   washroomIMG = loadImage("images/Wash Room.png");
   saddog = loadImage("Lazy.png");
   milkbottleimg = loadImage("milk.png");
   livingroom = loadImage("Living Room.png");
}

function setup() {
	createCanvas(500, 500);
 
  database = firebase.database();
  console.log(database);

  dog = createSprite(130,200,10,10);
  dog.addImage(dogimage);


  FoodStock = database.ref('Food');
  FoodStock.on("value",readStock);

  foodObj = new Food(100,200,10,10);

  feed = createButton(' feed the Dog ');
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addfood = createButton(' Food for Dog ');
  addfood.position(800,95);
  addfood.mousePressed(addFoodS);

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

 
}


function draw() {  

 background(46,139,87);

 fedTime = database.ref('FeedTime');
 fedTime.on("value",function(data){
    lastFed = data.val();
 })

if(gameState!="Hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(saddog);
}

currentTime=hour();
if (currentTime==(lastFed+1)){
  update("Playing");
  foodObj.gardenIMG();
} else if (currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroomIMG();
} else if (currentTime>(lastFed+2) && currentTime<=(lastFed+4)) {
  foodObj.washroomIMG();
} else {
  update("Hungry");
  foodObj.display();
}

if (foodS == 0) {
  dog.addImage(happydogimage);
  milkbottleimg.visible = false;
} else {
  dog.addImage(saddog);
  milkbottleimg.visible = true;
}

if(gameState === 1){
  dog.addImage(happydogimage);
  dog.scale = 0.175;
  dog.y = 250;
}

if(gameState === 2){
  dog.addImage(saddog);
  dog.scale = 0.175;
  milkbottleimg.visible = false
  dog.y = 250;
}

var Bath = createButton(" I want to bath ");
Bath.position(580,125);
if(Bath.mousePressed(function(){
  gameState = 3;
  database.ref('/').update({'gameState':gameState});
}));
if(gameState === 3){
  dog.addImage(washroomIMG);
  dog.scale = 1;
  milkbottleimg.visible = false;
}

var Sleep = createButton(" I am very sleepy ");
Sleep.position(710,125);
if(Sleep.mousePressed(function(){
  gameState = 4;
  database.ref('/').update({'gameState':gameState});
}));
if(gameState === 4){
  dog.addImage(bedroomIMG);
  dog.scale = 1;
  milkbottleimg.visible = false;
}

var Play = createButton(" Let's Play ! ");
Play.position(500,160);
if(Play.mousePressed(function(){
  gameState = 5;
  database.ref('/').update({'gameState':gameState});
}));
if(gameState === 5){
  dog.addImage(livingroom);
  dog.scale = 1;
  milkbottleimg.visible = false;
}

var Playingarden = createButton(" Let's Play in Park ");
Playingarden.position(585,160);
if(Playingarden.mousePressed(function(){
  gameState = 6;
  database.ref('/').update({'gameState':gameState});
}));
if(gameState === 6){
  dog.y = 175;
  dog.addImage(gardenIMG);
  dog.scale = 1;
  milkbottleimg.visible = false;
}

  drawSprites();

  foodObj.display();

  text("Food remaining" + FoodStock, 200,250);
  textSize(32);
  fill("red");
  Stroke("blue");

}

function readStock(data){

FoodS = data.val();

}

function writeStock(x){
database.ref('/').update({
   Food:x
})  

}

function addFoods(){

foodS++;
database.ref('/').update({
  Food:foodS
})

}

function feedDog(){

  dog.addImage(happydogimage);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}
