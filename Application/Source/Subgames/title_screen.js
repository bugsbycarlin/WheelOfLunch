//
// This file contains the title screen.
//
// Copyright 2026 Alpha Zoo LLC.
// Written by Matthew Carlin with assistance from ChatGPT.
//


class TitleScreen extends Screen {
  // Set up the screen
  initialize(width, height) {
    let self = this;

    this.mode = "ready";

    this.game_width = width;
    this.game_height = height;

    this.layers = {};
    let layers = this.layers;

    layers["background"] = new PIXI.Container();
    this.addChild(layers["background"]);

    // this.standard_font = {fontFamily: "Arial", fontSize: 24, fontWeight: 200, fill: 0x000000, letterSpacing: 1, align: "left"};    
    // this.white_font = {fontFamily: "Arial", fontSize: 24, fontWeight: 200, fill: 0xFFFFFF, letterSpacing: 1, align: "left"};

    this.title_screen = makeSprite("title_screen", layers["background"], 0, -50, 0, 0);

    this.play_button = makeSquishButton("play_button", layers["background"],
      this.game_width - 300, this.game_height/3, false, "pop",
      () => {
        self.mode = "clicked";
        game.createScreen("wheel");
        game.switchScreens("title_screen","wheel")
      }, () => {
        return self.mode === "ready";
    });

    this.setup_button = makeSquishButton("setup_button", layers["background"],
      this.game_width - 300, 2 * this.game_height/3, false, "pop",
      () => {
        self.mode = "clicked";
      }, () => {
        return self.mode === "ready";
    });
  }


  // Regular update method
  update(diff) {
    let fractional = diff / (1000/30.0) * 2;
  }
}

