//
// This file contains the one and only screen for the application.
// This is the meat of the program.
//
// Copyright 2024 Alpha Zoo LLC.
// Written by Matthew Carlin
//


class Display extends Screen {
  // Set up the screen
  initialize(width, height) {
    this.state = null;

    this.game_width = width;
    this.game_height = height;

    this.albums = [];

    this.layers = {};
    let layers = this.layers;

    layers["background"] = new PIXI.Container();
    this.addChild(layers["background"]);

    layers["wheel"] = new PIXI.Container();
    this.addChild(layers["wheel"]);

    this.wheel_font = {fontFamily: "Arial", fontSize: 24, fontWeight: 200, fill: 0x000000, letterSpacing: 1, align: "left"};    

    this.vanna = makeSprite("vanna", layers["background"], -40, this.game_height - 420, 0, 0, false)
    this.vanna.scale.set(0.4, 0.4);

    this.ticker = makeBlank(layers["background"], 30, 3, this.game_width / 2 + 320, this.game_height / 2, 0x000000, 0, 0);

    let wheel_shadow = drawWedge(new PIXI.Graphics(),
          this.game_width / 2 + 10, this.game_height / 2 + 10, 300, 360);
    wheel_shadow.fill(0x000000);
    wheel_shadow.alpha = 0.2;
    layers["background"].addChild(wheel_shadow);

    let wheel_backing = drawWedge(new PIXI.Graphics(),
          this.game_width / 2 + 1, this.game_height / 2 + 5, 300, 360);
    wheel_backing.fill(0x555555);
    layers["background"].addChild(wheel_backing);

    this.wheel = new PIXI.Container();
    this.wheel.position.set(this.game_width / 2, this.game_height / 2);
    layers["wheel"].addChild(this.wheel);

    this.wheel.angle_velocity = 0;

    let wheel_colors = [0xEF9585, 0xBADCE9, 0xFFFDCC];

    // xk.lineStyle(10, 0xFF0000);
    for (let i = 0; i < 15; i++) {
      let obj = drawWedge(new PIXI.Graphics(),
          0, 0, 300, 360/15);
      obj.fill(wheel_colors[i % 3]);
      obj.angle = 360 / 15 * i + 12;
      this.wheel.addChild(obj);
    }

    this.tags = {
      "clara": true,
      "near": true,
      "mid": true,
      "far": true,
      "healthy": true,
      "meaty": true,
      "dessert": true,
    }
    this.foods = [];

    this.setFoods();

    for (let i = 0; i < 15; i++) {
      let wheel_text = makeText("            " + this.foods[i], this.wheel_font, this.wheel, 0, 0, 0, 0.5);
      wheel_text.angle = 360 / 15 * i
    }

    let y = 50;
    for (const [key, value] of Object.entries(this.tags)) {
      let tag_text = makeText(key, this.wheel_font, layers["background"], this.game_width - 150, y, 0, 0.5);
      y += 50;
      console.log(tag_text.text);
      console.log(tag_text);
    }


    this.wheel.eventMode = "static"
    this.wheel.on('click', () => {
      console.log(this.wheel)
      this.wheel.last_tick_angle = this.wheel.angle;
      this.wheel.angle_velocity = 18 + Math.random() * 4;
    });
  }


  setFoods() {
    for (let i = 0; i < foods_master_list.length; i++) {
      let add_food = false;
      for (let t = 1; t < foods_master_list[i].length; t++) {
        if (foods_master_list[i][t] in tags && this.tags[foods_master_list[i][t]] == true) {
          add_food = true;
        }
      }

      if (add_food) {
        this.foods.push(foods_master_list[i][0]);
      }
    }

    shuffleArray(this.foods);
  }


  // Regular update method
  update(diff) {
    let fractional = diff / (1000/30.0) * 2;

    if (this.wheel && this.wheel.angle_velocity && this.wheel.angle_velocity > 0) {
      this.wheel.angle += this.wheel.angle_velocity;
      this.wheel.angle_velocity *= 0.99;

      if (Math.abs(this.wheel.angle - this.wheel.last_tick_angle) > 360/15) {
        soundEffect("tick");
        this.wheel.last_tick_angle = this.wheel.angle;
      }

      if (this.wheel.angle_velocity < 0.02) {
        this.wheel.angle_velocity = 0;
        soundEffect("ding");
      }
    }
  }
}

