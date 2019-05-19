document.addEventListener('DOMContentLoaded', domloaded, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var rightPressed = false;
var leftPressed = false;


function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}


function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function domloaded() {


    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    function new_element(type, x, y, color, point, active) {

        if (type === "brick" && active === true) {
            let obj = {x, y, w: 80, h: 20, color, point};
            context.fillStyle = obj.color;
            context.fillRect(obj.x, obj.y, obj.w, obj.h);

            return obj;
        }

        if (type === "obstacle") {
            let obj = {x, y, w: 100, h: 5};
            context.fillStyle = "black";
            context.fillRect(obj.x, obj.y, obj.w, obj.h);

            return obj;
        }

        if (type === "slider") {
            let obj = {x, y, w: 50, h: 10};
            context.fillStyle = "dodgerblue";
            context.fillRect(obj.x, obj.y, obj.w, obj.h);

            return obj;
        }

        if (type === "ball") {

            let obj = {x, y, r: ball_r, color};
            context.beginPath();
            context.fillStyle = obj.color;
            context.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
            context.fill();
            context.closePath();

            return obj;

        }

        if (type === "deathpit") {
            let obj = {start_x: 0, end_x: canvas.width, y: 320};
            context.beginPath();
            context.moveTo(obj.start_x, obj.y);
            context.lineTo(obj.end_x, obj.y);
            context.stroke();

            return obj;
        }

        if (type === "score") {
            let obj = {x, y, font: "30px Verdana"};
            context.fillStyle = "black";
            context.font = obj.font;
            context.fillText("Score: " + score, 50, 400)

            return obj;
        }

        if (active == false) {
            return null;
        }


    }


    function collision(element) {

        let testX = ball_x;
        let testY = ball_y;

        if (ball_x < element.x) testX = element.x;
        else if (ball_x > element.x + element.w) testX = element.x + element.w;

        if (ball_y < element.y) testY = element.y;
        else if (ball_y > element.y) testY = element.y + element.h;

        let distX = ball_x - testX;
        let distY = ball_y - testY;

        let distance = Math.sqrt((distX * distX) + distY * distY);

        return distance < ball_r;

    }

    var ball_x = 300;
    var ball_y = 250;
    var ball_speed_x = 1;
    var ball_speed_y = 1;
    var ball_r = 5;
    var ball_color = "dodgerblue";
    var slider_x = 275;

    var score = 0;

    let active_r = true;
    let active_b = true;
    let active_y = true;
    let active_p = true;
    let active_g = true;
    var active = [active_r, active_b, active_y, active_p, active_g];

    function draw() {

        if (score >= 230) {


            if (confirm("You won. Wanna try again?")) {
                clearInterval(interval);
                document.location.reload();
            }
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        var red_brick = new_element("brick", 160, 100, "red", 40, active[0]);

        var blue_brick = new_element("brick", 260, 100, "blue", 20, active[1]);

        var yellow_brick = new_element("brick", 310, 140, "yellow", 50, active[2]);

        var purple_brick = new_element("brick", 210, 140, "purple", 60, active[3]);

        var green_brick = new_element("brick", 360, 100, "green", 80, active[4]);


        var obstacle = new_element("obstacle", 220, 210);

        var slider = new_element("slider", slider_x, 280);

        var playball = new_element("ball", ball_x, ball_y, ball_color);

        var line = new_element("deathpit");

        var Score_text = new_element("score");


        var bricks = [red_brick, blue_brick, yellow_brick, purple_brick, green_brick];


        ball_x += ball_speed_x;
        ball_y += ball_speed_y;

        if (ball_y + ball_speed_y < 0) ball_speed_y = -ball_speed_y;
        if (ball_y + ball_speed_y >= line.y) {
            clearInterval(interval);
            if (confirm("You lost. Wanna try again?")) {
                document.location.reload();
            }
        }

        if (ball_x + ball_speed_x < 0 || ball_x + ball_speed_x >= canvas.width) ball_speed_x = -ball_speed_x;


        if (rightPressed && slider_x < canvas.width - slider.w) {
            slider_x += 5;
        } else if (leftPressed && slider_x > 0) {
            slider_x -= 5;
        }

        if (collision(slider) || collision(obstacle)) {
            ball_speed_y = -ball_speed_y;

        } else for (let i of bricks) {
            if (i && collision(i)) {
                score += i.point;
                active[bricks.indexOf(i)] = false;
                ball_color = i.color;
                ball_speed_y = -ball_speed_y;

            }
        }

    }


    function startInterval() {

        return setInterval(draw, 10);
    }


    let interval = startInterval();


}
