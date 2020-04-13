
var grid;
var grid_dim;
var origin_x;
var origin_y;

var cube_dim;

var user_x;
var user_y;
var user_z;
var user_dir;
var lookat_x;
var lookat_y;
var fov;
var view_range;

var speed;
var turn_speed;

function setup(){
	createCanvas(768, 768, WEBGL);
	perspective(PI/3, 1, 1, 100);
	
	grid = [];
	grid_dim = 64*4;
	cube_dim = 16;

	origin_x = -512*4;
	origin_y = -512*4;

	view_range = 256;
	fov = 50;
	user_x = 0;
	user_y = 0;
	user_z = 0;
	user_dir = 180;
	lookat_x = user_x + cos(radians(user_dir))*fov;
	lookat_y = user_y + sin(radians(user_dir))*fov;

	speed = 1;
	turn_speed = 5;
	
	for(let i = 0; i < grid_dim; ++i){
		grid[i] = [];
	}
	
	for(let i = 0; i < grid_dim; ++i){
		for(let k = 0; k < grid_dim; ++k){
			grid[i][k] = Math.floor(random(2));
		}
	}
}

function draw(){
	background(0);

	if(keyIsDown(87)){//W
		user_x += cos(radians(user_dir))*speed;
		user_y += sin(radians(user_dir))*speed;
	}	
	if(keyIsDown(65)){//A
		user_x += cos(radians(user_dir+90))*speed;
		user_y += sin(radians(user_dir+90))*speed;
	}	
	if(keyIsDown(83)){//S
		user_x += cos(radians(user_dir-180))*speed;
		user_y += sin(radians(user_dir-180))*speed;
	}	
	if(keyIsDown(68)){//D
		user_x += cos(radians(user_dir-90))*speed;
		user_y += sin(radians(user_dir-90))*speed;
	}	
	if(keyIsDown(81) || keyIsDown(LEFT_ARROW)){//Q
		user_dir += turn_speed;
	}
	if(keyIsDown(69) || keyIsDown(RIGHT_ARROW)){//E
		user_dir -= turn_speed;
	}
	if(keyIsDown(32)){//SPACE
		for(let i = 0; i < 400; ++i){
			let gridposx = Math.floor((user_x+cos(radians(user_dir))*i-origin_x)/cube_dim);
			let gridposy = Math.floor((user_y+sin(radians(user_dir))*i-origin_y)/cube_dim);
			if(gridposx == null || gridposy == null)
				break;	
			if(gridposx > grid_dim || gridposx < 0 || gridposy > grid_dim || gridposy < 0)
				break;
			if(grid[gridposx][gridposy] == 1)
				grid[gridposx][gridposy] = 0;
		}
	}

	lookat_x = user_x + cos(radians(user_dir))*fov;
	lookat_y = user_y + sin(radians(user_dir))*fov;

	camera(user_x, user_y, user_z, lookat_x, lookat_y, user_z, 0, 0, 1)
	ambientLight(80);

	normalMaterial();
	noStroke();
	for(let i = 0; i < grid_dim; ++i){
		for(let k = 0; k < grid_dim; ++k){
			if(Math.abs(i*cube_dim - (user_x-origin_x)) > view_range || Math.abs(k*cube_dim - (user_y-origin_y)) > view_range){
				continue;
			}
			if(grid[i][k]){
				push();
					translate(origin_x + i*cube_dim, origin_y + k*cube_dim, 0)
					box(cube_dim);
				pop();
			}
		}
	}

	push();
		fill(200, 0, 200);
		translate(0, 0, 10);
		plane(grid_dim*cube_dim, grid_dim*cube_dim);
	pop();

	console.log(getFrameRate());
}
