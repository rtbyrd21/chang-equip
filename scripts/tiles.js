

myApp.controller('TileController', function($scope, $rootScope, $timeout, $state, $stateParams) {





  var crop = $stateParams.data[0];
  var equipment = $stateParams.data[1];
  var obj = data.crop[crop][equipment];


  

  var a = function(p) {

 p.disableFriendlyErrors = true;	

  	var canvas;
  	var quarterTiles = [];
  	var images = [];
  	var videos = [];
  	var years = [];
  	var descriptions = ['There will be text or an information icon that will prompt the visitor to tap on the photo or video of the equipment. ', 'There will be text or an information icon that will prompt the visitor to tap on the photo or video of the equipment.', 'There will be text or an information icon that will prompt the visitor to tap on the photo or video of the equipment.', 'There will be text or an information icon that will prompt the visitor to tap on the photo or video of the equipment.'];
  	var tileIsFullScreen = false;
  	$rootScope.tileIsFullScreen = false;
  	var placeholder;
  	var myFont;

  	p.preload = function(){
  		$.each( obj, function( key, value ) {
			years.push(key);
		  	videos.push(p.createVideo("images/" +crop + "/" + equipment + "/"  + key + "/video.mp4"))
		  	// videos.push(p.createVideo("https://vineyardsandbox.s3.amazonaws.com/Rob/images/"+crop + "/" + equipment + "/"  + key + "/video.mp4"))
		  
		  	// p.loadJSON("https://vineyardsandbox.s3.amazonaws.com/Rob/images/"+crop + "/" + equipment + "/"  + key + "/video.mp4", function(data){
		  	// 	console.log(data);
		  	// })


		  });

		videos.forEach(function(item, index){
			videos[index].loop();
			videos[index].volume(0);
			videos[index].hide();
		});
  	}

	p.setup = function(){
		console.log(videos);
		infoIcon = p.loadImage("images/info_icon.png"); 
		closeIcon = p.loadImage("images/close_icon.png"); 
		background = p.loadImage("images/farm_background.jpg"); 
		
		p.frameRate(90);
		p.textAlign(p.CENTER);
		placeholder = p.createVideo("images/corn/harvesting/1860s/video.mp4");
		placeholder.loop();
		placeholder.hide();

		canvas = p.createCanvas(p.windowWidth, (p.windowWidth / 16) * 9);
		canvas.parent('quarter-tiles');
		quarterTiles.push(new QuarterTile(0 - p.windowWidth/2,0 - p.height/2,p.windowWidth/2,p.height/2, [0,0], 0));
		quarterTiles.push(new QuarterTile(p.windowWidth,0 - p.height/2, p.windowWidth/2, p.height/2, [p.windowWidth /2,0], 1));
		quarterTiles.push(new QuarterTile(0 - p.windowWidth/2, p.height, p.windowWidth/2, p.height/2, [0,p.height/2], 2));
		quarterTiles.push(new QuarterTile(p.windowWidth, p.height, p.windowWidth/2,p.height/2, [p.windowWidth/2,p.height/2], 3));

		

	}

	p.draw = function() {
		p.background(background);
		// p.textFont(myFont);
		p.textFont('Corbel');
		for(var i=0; i< quarterTiles.length; i++){
				// if(!quarterTiles[i].isFullScreen){
					quarterTiles[i].moveIntoPlace();
					if(videos[i].loadedmetadata){
						quarterTiles[i].checkClick();
						quarterTiles[i].checkSlide();
					}
					quarterTiles[i].drawDate();
				// }
			}



		// console.log(tileIsFullScreen);	


	};



function QuarterTile(xPos, yPos, width, height, origin, index) {
	this.x = xPos;
	this.y = yPos;
	this.slideX = xPos;
	this.slideY = yPos;
	this.startX = xPos;
	this.startY = yPos;
	this.width = width;
	this.height = height;
	this.speedToMove = 70;
	this.distanceToMoveX = (-this.startX + origin[0]) / (this.speedToMove - 1);
	this.distanceToMoveY = (-this.startY + origin[1]) / (this.speedToMove - 1);
	this.isClicked = true;
	this.previousFrame = 0;
	this.isFullScreen = false;
	this.isSliding = false;
	this.startSlide = false;
	this.startSlideClosed = false;
	this.isSlidingClosed = false;
	this.slideCompletelyOpen = false;
	this.slideCompletelyClosed = false;

	this.drawDate = function(){

		p.fill(255);

		p.textSize(30);

		p.text(years[index], (this.x + width) - 80, (this.y + height) - 20);
		p.textSize(17);
		// p.strokeWeight(1);
		// p.fill(255,255,255,200);
		if(videos[index].loadedmetadata){
			p.ellipse(((this.x + width) - 40) + 15, (this.y + 10) + 15, 30, 30);
		}
		if(!this.isSliding){
			if(videos[index].loadedmetadata){
				p.image(infoIcon, (this.x + width) - 40, this.y + 10, 30, 30);
			}
		}else{
			if(videos[index].loadedmetadata){
				p.image(closeIcon, (this.x + width) - 40, this.y + 10, 30, 30);
			}
		}	
		

	}

	

	this.moveIntoPlace = function(){
		if(p.frameCount < this.speedToMove){
			this.x += this.distanceToMoveX;
			this.y += this.distanceToMoveY;
		}

		if(!this.isClicked){	
				if(videos[index].loadedmetadata){
					p.image(videos[index], this.x, this.y, this.width, this.height);
					videos[index].volume(0);
				}
			}else{
				if(videos[index].loadedmetadata){

					p.image(videos[index], this.x, this.y, this.width, this.height);
				}else{
					p.image(placeholder, this.x, this.y, this.width, this.height);
					p.fill(0);
					p.rect(this.x, this.y, this.width, this.height);
					p.fill(255);
					// p.textFont(myFont);
					p.textSize(17);
					p.text(obj[years[index]].description, this.x + (this.width *.15), this.y + (this.height * .15), this.width * .7, this.height);
				}
				
			}

		
	}

	this.checkSlide = function(){
		if(this.startSlide){
			this.slideTile();
		}
		if(this.startSlideClosed){
			this.slideTileClosed();
		}
	}

	this.checkClick = function(){

			if(p.mouseX > this.x && p.mouseX < this.x + this.width && p.mouseY > this.y && p.mouseY < this.y + this.height && p.mouseIsPressed){
				// if(p.frameCount > this.previousFrame + 30){


					//open slide if not completely open
					if(!this.slideCompletelyOpen){
						if(!this.isSliding){
							this.previousFrame = p.frameCount;
							this.isSliding = true;
						}
						this.startSlide = true;

					}

					if(this.slideCompletelyOpen){
						if(!this.isSlidingClosed){
							this.previousFrame = p.frameCount;
							this.isSlidingClosed = true;
						}
						this.startSlideClosed = true;
					}
					
					
			}
	}

	this.slideTile = function(){
		if(p.frameCount < this.speedToMove + (this.previousFrame - 1) && !this.isSlidingClosed){
			this.slideX += this.distanceToMoveX;
			this.slideY += this.distanceToMoveY;
			p.fill(0, 0, 0, 200);
			p.rect(this.slideX, this.slideY, width, height);
			p.fill(255);
			var that = this;
			var spacing = 0;
			p.textLeading(18);
			obj[years[index]].description.forEach(function(item, index){
				p.text(item, that.slideX + (width * .15), (that.slideY + (height * .15)) + spacing, width * .7);
				spacing += textHeight(item, width/2, 18 + 6);
			});
		}else{
			p.fill(0, 0, 0, 200);
			p.rect(this.slideX, this.slideY, width, height);
			p.fill(255);
			var that = this;
			var spacing = 0;
			p.textLeading(18);
			obj[years[index]].description.forEach(function(item, index){
				p.text(item, that.slideX + (width * .15), (that.slideY + (height * .15)) + spacing, width * .7);	
				spacing += textHeight(item, width/2, 18 + 6);
			});
			// p.text(obj[years[index]].description, this.slideX + (width *.25), this.slideY + (height * .25), width/2, height);
			this.slideCompletelyOpen = true;
		}
	}

	this.slideTileClosed = function(){
		if(p.frameCount < this.speedToMove + (this.previousFrame - 1)){
			this.slideX -= this.distanceToMoveX;
			this.slideY -= this.distanceToMoveY;
		}else{
				this.isSliding = false;
				this.startSlide = false;
				this.startSlideClosed = false;
				this.isSlidingClosed = false;
				this.slideCompletelyOpen = false;
				this.slideCompletelyClosed = false;
		}
	}

	this.goBack = function(){
		if(p.mouseIsPressed){
			this.isFullScreen = false;
			this.isClicked = true;
			this.x = origin[0];
			this.y = origin[1];
			this.width = width;
			this.height = height;
			$rootScope.tileIsFullScreen = false;
			$rootScope.$apply();
			setTimeout(function(){
				tileIsFullScreen = false;
			}, 250);
		}
	}


	// this.enlarge = function(){

	// 	if(index == 0){
	// 		if(this.x + this.width < p.width){
	// 			this.width += 16;
	// 			if(p.windowHeight > this.y){
	// 				this.height += 9;
	// 			}
	// 		}else{
	// 			this.goBack();
	// 		}
	// 	}

	// 	if(index == 1){
	// 		if(0 < this.x){
	// 			this.x += -16;
	// 			this.width += 16;
	// 			if(p.windowHeight > this.y){
	// 				this.height += 9;
	// 			}
	// 		}else{
	// 			this.goBack();
	// 		}
	// 	}

	// 	if(index == 2){
	// 		if(this.x + this.width < p.width){
	// 			this.width += 16;
	// 			if(this.y > 0){
	// 				this.y -= 9;
	// 				this.height += 9;
	// 			}
	// 		}else{
	// 			this.goBack();
	// 		}
	// 	}

	// 	if(index == 3){
	// 		if(0 < this.x){
	// 			this.x += -16;
	// 			this.width += 16;
	// 			if(this.y > 0){
	// 				this.y -= 9;
	// 				this.height += 9;
	// 			}
	// 		}else{
	// 			this.goBack();
	// 		}
	// 	}

		
	// }
	

}






 function textHeight(text, maxWidth, textLeading) {
     var words = text.split(' ');
     var line = '';
     var h = textLeading;


     for (var i = 0; i < words.length; i++) {
         var testLine = line + words[i] + ' ';
         var testWidth = p.drawingContext.measureText(testLine).width;

         if (testWidth > maxWidth && i > 0) {
             line = words[i] + ' ';
             h += textLeading;
         } else {
             line = testLine;
         }
     }

     return h;
 }






};







	// $timeout(function(){
		var myp5 = new p5(a);
	// }, 1200)
	 

});