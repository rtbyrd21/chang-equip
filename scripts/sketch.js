

myApp.controller('SketchController', function($scope, $rootScope, $timeout, $state) {

  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };
  $scope.modalText = '';


  var a = function(p) {

  	var canvas;
  	var cropTiles = [];
  	var equiptmentTiles = [];
    var green;
    var brown;
  	var crops = ['Corn', 'Soybeans', 'Hay', 'Smallgrains'];
  	var equiptment = ['Plowing', 'Planting', 'Cultivating', 'Harvesting'];
  	var tileCount = crops.length + equiptment.length;
  	var cropsMoving = true;
  	var selectedCrop = false;
  	var selectedEquip = false;
    var cropImages = [];
    var equipImages = [];
    var shadow;
    var hilight;
    var chooseText;
    var chooseCrop;
    var myFont;
p.preload = function() {
  for(var i = 0; i < crops.length; i++){
    cropImages.push(p.loadImage("images/crops/"+ i +".png"));
  }
  for(var i = 0; i < 4; i++){
    equipImages.push(p.loadImage("images/equipment/"+ i +".png"));
  }
  shadow = p.loadImage("images/shadow.png");
  hilight = p.loadImage("images/hilight.png");
  chooseText = p.loadImage("images/choose_text.png");
  chooseCrop = p.loadImage("images/choose_crop.png");
}


	p.setup = function(){
		p.frameRate(120);
    green = p.color(90,107,75);
    brown = p.color(140,111,74);
		canvas = p.createCanvas(p.windowWidth, (p.windowWidth / 16) * 9);
		canvas.parent('sketch-holder');
		p.textAlign(p.CENTER);
    // p.textFont(myFont);

		for(var i=0; i<crops.length; i++){
			var spacing = i * (p.width / (tileCount / 2) + 1);
			var initOffset = p.width / (tileCount / 2);
			var startingPos = spacing;
			cropTiles.push(new CropTile(startingPos, crops[i].toLowerCase(), i));
		}

		for(var i=0; i<equiptment.length; i++){
			var spacing = i * (p.width / (tileCount / 2) + 1);
			var initOffset = p.width / (tileCount / 2);
			var startingPos = spacing + 20;
			equiptmentTiles.push(new EquiptmentTile(startingPos, equiptment[i].toLowerCase(), i));
		}

	}

	p.draw = function() {
    p.fill(76,53,67);
    p.rect(0,0, p.width, p.height /2);
    p.fill(56,83,86);
    p.rect(0, p.height / 2, p.width, p.height /2);
    p.image(chooseCrop, p.width / 2 - (chooseCrop.width / 2), p.height /2 - (chooseCrop.height - 10));
    p.image(chooseText, p.width / 2 - (chooseText.width / 2), p.height /2);
    p.translate(0,20);
		for(var i=0; i < cropTiles.length; i++){
			cropTiles[i].move();
			cropTiles[i].display();
			cropTiles[i].checkPos();
		}
		for(var i=0; i < equiptmentTiles.length; i++){
			equiptmentTiles[i].move();
			equiptmentTiles[i].display();
			equiptmentTiles[i].checkPos();
		}

    if(selectedCrop && selectedEquip){

      if(selectedCrop === 'hay' && selectedEquip === 'cultivating'){
        $scope.modalShown = true;
        $scope.modalText = 'Because hay was planted so close together, cultivating weeds was not necessary—the weeds were shaded out by the hay';
        $scope.$apply();
      }else if(selectedCrop === 'small grains' && selectedEquip === 'cultivating'){
        $scope.modalShown = true;
        $scope.modalText = 'Because small grains were planted so closely together, cultivating weeds was not necessary—the weeds were shaded out by the wheat.';
        $scope.$apply();
      }else{
        $state.go('tiles', {data: [selectedCrop, selectedEquip]}).then(function(){
          selectedCrop = false;
          selectedEquip = false;
          $rootScope.tileIsFullScreen = false;
          p.remove();
        });


      }
      
    }
	};


p.mousePressed = function(){

  if($state.current.name === 'home'){
      for(var i=0; i < cropTiles.length; i++){
        cropTiles[i].checkClick();
      }
      for(var i=0; i < equiptmentTiles.length; i++){
        equiptmentTiles[i].checkClick();
      } 
  }

}

// Jitter class
function CropTile(startingPos, item, index) {
  this.x = startingPos;
  this.y = 0;
  this.speed = 1;
  this.width = p.width / ((tileCount / 2) + 1);
  this.height = this.width;
  this.item = item;
  this.index = index;

  this.move = function() {
  	if(selectedCrop == false){
  	  this.x += this.speed;
  	}
  }

  this.checkPos = function(){
  	if(p.floor(this.x + this.width) === p.width){

  		cropTiles.unshift(new CropTile((this.width * -1),this.item, this.index));
  	}
  	if(p.floor(this.x) === p.width){
  		cropTiles.splice(cropTiles.length - 1, 1);
  	}
  }

  this.checkClick = function(){
  	if(p.mouseX > this.x && p.mouseX < this.x + this.width && p.mouseY > this.y && p.mouseY < this.y + this.height){
  		if(selectedCrop == this.item){
  			selectedCrop = false
  		}else{
  			selectedCrop = this.item;
  		}	
  	}
  }

  this.display = function() {

  	if(selectedCrop == this.item){
      // p.rect(this.x - 5, this.y - 5, (this.width * .93) + 10, this.height + 10);
      p.image(hilight, this.x - 15, this.y - 15, (this.width * .93) + 30, this.height + 30);
      // if(this.index % 2 === 0){
        p.fill(green);
      // }else{
      //   p.fill(brown);
      // }
      p.strokeWeight(2);
      p.stroke(255);
  		p.rect(this.x, this.y, this.width * .93, this.height);
      p.image(cropImages[this.index], this.x - this.width * .035, this.y, this.width, this.height);
      p.fill(255); 
  	}else{
      p.image(shadow, this.x - 5, this.y - 5, (this.width * .93) + 10, this.height + 10);
  		// if(this.index % 2 === 0){
        p.fill(green);
      // }else{
      //   p.fill(brown);
      // }
      p.strokeWeight(2);
      p.stroke(255);
  		p.rect(this.x, this.y, this.width * .93, this.height);
      p.image(cropImages[this.index], this.x - this.width * .035, this.y, this.width, this.height);
  		p.fill(255);
  	}
    
   
   
  }
};


function EquiptmentTile(startingPos, item, index) {
  this.x = startingPos;
  
  this.speed = 1;
  this.width = p.width / ((tileCount / 2) + 1);
  this.y = (p.height - this.width) - 40;
  this.height = this.width;
  this.item = item;
  this.index = index;

  this.move = function() {
  	if(selectedEquip == false){
    	this.x -= this.speed;
	  }
  }

  this.checkPos = function(){
  	if(this.x + this.width < 0){
  		equiptmentTiles.splice(0, 1);
  	}
    if(p.floor(this.x) === 0){
      equiptmentTiles.push(new EquiptmentTile((p.width),this.item, this.index));
    }
  }

  this.checkClick = function(){
  	if(p.mouseX > this.x && p.mouseX < this.x + this.width && p.mouseY > this.y && p.mouseY < this.y + this.height){
  		if(selectedEquip == this.item){
  			selectedEquip = false;
  		}else{
  			selectedEquip = this.item;
  		}	
  	}
  }

  this.display = function() {
    p.textSize(30);
    p.fill(255,255,255,220);
    p.noStroke()
    // p.rect(this.x - 5, this.y - 5, (this.width * .93) + 10, this.height + 10);

  	if(selectedEquip == this.item){
      p.image(hilight, this.x - 15, this.y - 15, (this.width * .93) + 30, this.height + 30);
  		// if(this.index % 2 === 0){
    //     p.fill(green);
    //   }else{
        p.fill(brown);
      // }
      p.strokeWeight(2);
      p.stroke(255);
      
  		p.rect(this.x, this.y, this.width * .93, this.height);
      p.noStroke();
  		p.fill(255);
  		p.image(equipImages[this.index], this.x, this.y, this.width * .93, this.height);
      p.fill(255); 

  	}else{
    // p.fill(0,0,0,220);
    // p.noStroke()
    // p.rect(this.x - 5, this.y - 5, (this.width * .93) + 10, this.height + 10);
    p.image(shadow, this.x - 5, this.y - 5, (this.width * .93) + 10, this.height + 10);
  		// if(this.index % 2 === 0){
    //     p.fill(green);
    //   }else{
        p.fill(brown);
      // }
      p.strokeWeight(2);
      p.stroke(255);

  		p.rect(this.x, this.y, this.width * .93, this.height);
      p.noStroke();
  		p.fill(255);
  		p.image(equipImages[this.index], this.x, this.y, this.width * .93, this.height);
      p.fill(255); 
  	}
  }
};



};






	// $timeout(function(){
		var myp5 = new p5(a);
	// }, 1200)
	 

});