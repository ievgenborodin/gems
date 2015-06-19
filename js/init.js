$(function(){
var canvas = document.getElementById("c"),
	console = document.getElementById('chk'),
    ctx = canvas.getContext("2d"),
	spanMes = document.getElementById("mes"), status = 0,
	state,s=0,m=0,gs=0,M=0,S=0,FPS=50,init;
   
    screenState();
    
//$('#c').attr('width', colWidth).attr('height', colWidth);
    
function animate(time){
    handleTime();
	init = (gems.length<=cells.length-1)? initialize() : 0;
	state = 0;
    for(var i=0;i<cells.length;i++) state = (cells[i].used===true)? ++state : --state;
	if (s%2===0)
		handleCollides();			
    handleMotion();
    ctx.clearRect(0,0,canvas.width, canvas.height);
    cells.forEach(function(c){   if (c.used===true) c.gem.draw();     });
	
	window.requestNextAnimationFrame(animate);
}
window.requestNextAnimationFrame(animate);
       
/////////////////  TIME    ////////////////////////
function handleTime(){
	++gs;
    if (gs*FPS>2400){
        gs=0;
        ++s;
        if (s>59){
            s=0; ++m;
        }
    }
    (s<10 && s>=0) ? S = '0'+s : S=s;
    (m<10 && m>=0) ? M = '0'+m : M=m;
    //mBox.min = M;
    //mBox.sec = S;
}		 

/*	SCREEN STATE	*/
function screenState(){
	width = window.innerWidth-15;
	height = window.innerHeight-15;
	landscape = width-height>0 ? true : false;
	if (landscape)
		scrX = scrY = (width > 1300) ? height * 0.7 : height;
	else 
		scrY = scrX = width;
	canvas.width = (scrX<400) ? scrX : scrX * 0.6;
	canvas.height = (scrY<400) ? scrY : scrY * 0.6;
}

var gems = [], cells = [], gemA = {}, gemB = {}, nmatchGems = [], mmatchGems = [],
	x=0, y=0, col=0, row=0, N=0,
	colors=["red", "yellow", "blue", "green", "purple",  "orange", "white", "#8AE6B8"],
	dcolors=["#750202", "#969b00", "#000060", "#0c3800", "#29002d",  "#5e3b00", "white", "#8AE6B8"],

	field = {
		x: 5,
		y: 5,
		margin: 20,
		velocity: 6
	},
	
    cell_width =Math.floor( (canvas.width-((field.x+1)*field.margin))/field.x),
    cell_height =Math.floor( (canvas.height-((field.y+1)*field.margin))/field.y),
	
	Cell = function(I){
		var I = I || {};
		I.used = false;
		return I;
	};
	
	colors.length = 6;	
	for (var i=0, max=field.x*field.y; i<max; i++){		
		 x= Math.floor(field.margin + col*(field.margin + cell_width));
			y= Math.floor(field.margin + row*(field.margin + cell_height));
		cells.push(Cell({x: x, y: y, col: col, row: row}));		
			//console.log('x:'+ x+ ' y:' +y+  ' row:' + row+ ' col:'+col);
		col++;
		if (col>=field.x){ 
			col = 0;
			x = field.margin;
			row++;
		}			
	}
	
	function Gem(I){
		var I = I || {};

		I.depth = cell_width/4;
		I.width = cell_width;
		I.height = cell_height;
		I.pressed = false;
		I.velocityX = 0;
		I.draw = function(){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
			
			ctx.fillStyle = this.dcolor;
			ctx.beginPath();
			var xx= this.x+ this.width,
				yy = this.y+ this.height;
			ctx.moveTo(xx, this.y);
			ctx.lineTo(xx+this.depth, this.y+this.depth);
			ctx.lineTo(xx+this.depth, yy+this.depth);
			ctx.lineTo(this.x+this.depth, yy+this.depth);
			ctx.lineTo(this.x, yy);
			ctx.lineTo(xx, yy);
			ctx.lineTo(xx, y);
			ctx.fill();
			ctx.strokeStyle = this.color;
			ctx.lineWidth = 0.2;
			ctx.beginPath();
			ctx.moveTo(xx,yy);
			ctx.lineTo(xx+this.depth, yy+this.depth);
			ctx.stroke();
			if (this.pressed){
				ctx.lineWidth = 3;
				ctx.strokeStyle = "white";
				ctx.strokeRect(this.x-3, this.y-3, this.width+6, this.height+6);
			}
		};   
	return I;
	}

////////////////////////  ADDING  ////////////////////////////
function initialize(){
	if (cells[N].used==false){
		var colour = Math.floor(Math.random()*colors.length);
		gems.push(Gem({x: cells[N].x, y: field.margin, index: N, color: colors[colour], dcolor: dcolors[colour]}));
		cells[N].gem = gems[gems.length-1];
		cells[N].used = true;
	}				
	N++;
	if (N>cells.length-1)
		N=0;
}

///////////////////// MOTION    ////////////////////////////
function handleMotion(){
	cells.forEach(function(c){
	 if (c.used===true){
			if (c.gem.y !== c.y){
				c.gem.velocityY = (c.gem.y - c.y > 0)? -(field.velocity) : field.velocity;
				c.gem.y += c.gem.velocityY;
				if (Math.abs(c.gem.y-c.y)<field.velocity){
					c.gem.y = c.y;
					c.gem.velocityY = 0;
				}
			}
			if (c.gem.x !== c.x){
				c.gem.velocityX = (c.gem.x - c.x > 0)? -(field.velocity) : field.velocity;
				c.gem.x += c.gem.velocityX;
				if (Math.abs(c.gem.x-c.x)<field.velocity){
					c.gem.x = c.x;
					c.gem.velocityX = 0;
				}
			}								
			if (c.gem.y>canvas.height-field.margin-cell_height)
				c.gem.y = canvas.height-field.margin-cell_height;
	 }
    });
}


/////////////////////   EVENTS   ///////////////////////////
var touched = false,loc,x0,y0,x1,y1,key=1, _gem = {}, iB, iA;
 canvas.ontouchstart = function(e) { 
 	e.preventDefault(e); 
 	 loc = windowToCanvas(canvas,e.touches[0].pageX,e.touches[0].pageY); 
 	  
 	handleEvents();
 }
 canvas.onmousedown = function(e) { 	
 	e.preventDefault(e); 
 	 loc = windowToCanvas(canvas,e.clientX,e.clientY); 
 	  
 	 handleEvents();
 }

function handleEvents(){
 	 if (key===1){
 	  	x1=x0; y1=y0;
 	  	x0 = loc.x; y0 = loc.y;
 	  	key=2;
 	  } else{
 	  	x1=x0; y1=y0;
 	  	x0=loc.x; y0=loc.y;
 	  	key=1;
 	  }
 	 // console.log('a('+x0+';'+y0+'), b('+x1+';'+y1+')');
		
	  	for(i=0;i<cells.length; i++){
			if (x0>cells[i].gem.x && x0<(cells[i].gem.x+cell_width) && y0>cells[i].gem.y && y0<(cells[i].gem.y+cell_height)){
				cells[i].gem.pressed = (cells[i].gem.pressed)? false : true;
				gemA = cells[i].gem;
				iB= i;
			} else if (x1>cells[i].gem.x && x1<(cells[i].gem.x+cell_width) && y1>cells[i].gem.y && y1<(cells[i].gem.y+cell_height)){
				gemB = cells[i].gem; 
				iA=i;
			} else{
				cells[i].gem.pressed = false;
			}
		}
		
		if (gemB.x!==undefined && (gemA.pressed && gemB.pressed)){
			if ((Math.abs(gemB.x-gemA.x)+Math.abs(gemB.y-gemA.y))===cell_width+field.margin){		
				_gem = cells[iA].gem;
				cells[iA].gem = cells[iB].gem;			
				cells[iB].gem = _gem;	
			}
			gemA.pressed = false;
			gemB.pressed = false;
			gemA = {}; gemB = {};
		}
 }
 
 
 //////////////// COLLIDES   /////////////////////
 function handleCollides() {
	var ncolor, mcolor,
		nmatch=1, mmatch = 1,
		lastnMatchLength = 0,
		lastmMatchLength = 0;
	
	if (state === cells.length){
		for (var l=0; l<field.x; l++){
			ncells = cells.filter(function(c){return (c.row==l);}).sort(function(a,b){return a.col - b.col; });
			mcells = cells.filter(function(c){return (c.col==l);}).sort(function(a,b){return a.row - b.row; });
			
			ncolor = ncells[0].gem.color; 
			nmatchGems[lastnMatchLength] = ncells[0];
			nmatch = 1;
			
			mcolor = mcells[0].gem.color; 
			mmatchGems[lastmMatchLength] = mcells[0];
			mmatch = 1;
			
			for(var i=1; i<ncells.length; i++){
				if (ncolor===ncells[i].gem.color){
					nmatch++;
					nmatchGems[nmatchGems.length] = ncells[i];
				} else {
					ncolor = ncells[i].gem.color;
					if (nmatch>2){
						lastnMatchLength += nmatch;
					} else {
						nmatchGems.length = lastnMatchLength;
					}
					nmatch = 1;
					nmatchGems[lastnMatchLength] = ncells[i];
				}
				
				if (mcolor===mcells[i].gem.color){
					mmatch++;
					mmatchGems[mmatchGems.length] = mcells[i];
				} else {
					mcolor = mcells[i].gem.color;
					if (mmatch>2){
						lastmMatchLength += mmatch;
					} else {
						mmatchGems.length = lastmMatchLength;
					}
					mmatch = 1;
					mmatchGems[lastmMatchLength] = mcells[i];
				}
			}
			if (nmatch>2)
				lastnMatchLength += nmatch;
			else 
				nmatchGems.length = lastnMatchLength;
			if (mmatch>2)
				lastmMatchLength += mmatch;
			else
				mmatchGems.length = lastmMatchLength;
		}
		for(var i=0; i<nmatchGems.length; i++){
			if (nmatchGems[i]!==undefined && nmatchGems[i].used){
				add[nmatchGems[i].col] = (add[nmatchGems[i].col]!==undefined)? ++add[nmatchGems[i].col] : 1;
				nmatchGems[i].used = false;
				nmatchGems[i].gem = {};
			}
		}
		for(var i=0; i<mmatchGems.length; i++){
			if (mmatchGems[i]!==undefined && mmatchGems[i].used) {
				add[mmatchGems[i].col] = (add[mmatchGems[i].col]!==undefined)? ++add[mmatchGems[i].col] : 1;
				mmatchGems[i].used = false;
				mmatchGems[i].gem = {};
			}
		}
		handleShift();
	}

}

var flip, add = [], cycl=1;
/////////////////// SHIFT / //////////////////
function handleShift(){
	flip = 0;
	for (var j=0; j<field.x; j++){
		mcells = cells.filter(function(c){return (c.col==j);}).sort(function(a,b){return b.row - a.row; });
		for(var i =0;i<mcells.length; i++){
			if (!mcells[i].used){
				flip = 1;
				if (mcells[i+1]!==undefined){
					if (mcells[i+1].used){
						mcells[i].gem = mcells[i+1].gem;
						mcells[i].used = true;
						mcells[i+1].gem = {};
						mcells[i+1].used = false;
						++cycl;
						flip = 2;
						handleShift();
					}
				}
			}
		}
	}
	if (flip===1){
		if (cycl>1) 
			--cycl;
		else
			handleAdding(add);
	}
		
}

function handleAdding(add){
	var colour; 
	for (var i=0; i<add.length; i++){
		if (add[i]!==undefined){
			for(var j=0; j<add[i]; j++){
				colour = Math.floor(Math.random()*colors.length);
				gems.push(Gem({x: cells[j*field.x+i].x, y: field.margin, color: colors[colour], dcolor: dcolors[colour]}));
				cells[j*field.x+i].gem = gems[gems.length-1];
				cells[j*field.x+i].used = true;
			}
		}
	}
	add.length = 0;
}

function windowToCanvas(canvas, x, y) { var bbox = canvas.getBoundingClientRect(); return { x: x - bbox.left * (canvas.width / bbox.width), y: y - bbox.top * (canvas.height / bbox.height) }; }

});