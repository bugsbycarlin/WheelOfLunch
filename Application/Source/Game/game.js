//
// This file contains the root "game" class for Follow Through. This is the starting point.
//
// Copyright 2023 Alpha Zoo LLC.
// Written by Matthew Carlin
//

'use strict';

var log_performance = true;
var performance_result = null;

var first_screen = "display";

var subgames = ["display"];

var pixi = null;
var game = null;

function initialize() {
  game = new Game();  
}

class Game {
  constructor() {
    this.tracking = {};

    this.basicInit();

    this.keymap = {};

    // Useful place to load config, such as the map
    //this.content_config_length = Object.keys(content_config).length;

    document.addEventListener("keydown", (ev) => {this.handleKeyDown(ev)}, false);
    document.addEventListener("keyup", (ev) => {this.handleKeyUp(ev)}, false);
    document.addEventListener("mousemove", (ev) => {this.handleMouseMove(ev)}, false);
    document.addEventListener("mousedown", (ev) => {this.handleMouseDown(ev)}, false);
    document.addEventListener("mouseup", (ev) => {this.handleMouseUp(ev)}, false);

    window.onfocus = (ev) => {
      if (this.keymap != null) {
        this.keymap["ArrowDown"] = null;
        this.keymap["ArrowUp"] = null;
        this.keymap["ArrowLeft"] = null;
        this.keymap["ArrowRight"] = null;
      }
    };
    window.onblur = (ev) => {
      if (this.keymap != null) {
        this.keymap["ArrowDown"] = null;
        this.keymap["ArrowUp"] = null;
        this.keymap["ArrowLeft"] = null;
        this.keymap["ArrowRight"] = null;
      }
    };
  }


  basicInit() {
    this.width = 1400;
    this.height = 800;

    // Create the pixi application
    pixi = new PIXI.Application(this.width, this.height, {antialias: true});
    const initPromise = pixi.init({ background: '#CCCCCC', resizeTo: window });
    
    initPromise.then((thing) => {
      document.body.appendChild(pixi.canvas);

      // document.getElementById("mainDiv").appendChild(pixi.view);
      this.renderer = pixi.renderer;
      pixi.renderer.backgroundColor = 0xFFFFFF;
      pixi.renderer.resize(this.width,this.height);
      pixi.renderer.backgroundColor = 0xFFFFFF;

      // Set up rendering and tweening loop
      let ticker = PIXI.Ticker.shared;
      ticker.autoStart = false;
      ticker.stop();

      let fps_counter = 0;
      let last_frame = 0;
      let last_performance_update = 0;

      let animate = now => {
        
        fps_counter += 1;
        let diff = now - last_frame;
        last_frame = now

        if (!this.paused == true) {
          this.trackStart("tween");
          TWEEN.update(now);
          this.trackStop("tween");

          this.trackStart("update");
          this.update(diff);
          this.trackStop("update");

          this.trackStart("animate");
          ticker.update(now);
          pixi.renderer.render(pixi.stage);
          this.trackStop("animate");

          if (now - last_performance_update > 3000 && log_performance) {
            //There were 3000 milliseconds, so divide fps_counter by 3
            // console.log("FPS: " + fps_counter / 3);
            // this.trackPrint(["update", "tween", "animate"]);
            fps_counter = 0;
            last_performance_update = now;
          }
        }
        requestAnimationFrame(animate);
      }
      animate(0);

      this.preloadAnimations(() => {
        this.initializeScreens();
      });
    })

    
  }


  //
  // Tracking functions, useful for testing the timing of things.
  //
  trackStart(label) {
    if (!(label in this.tracking)) {
      this.tracking[label] = {
        start: 0,
        total: 0
      }
    }
    this.tracking[label].start = Date.now();
  }


  trackStop(label) {
    if (this.tracking[label].start == -1) {
      console.log("ERROR! Tracking for " + label + " stopped without having started.")
    }
    this.tracking[label].total += Date.now() - this.tracking[label].start;
    this.tracking[label].start = -1
  }


  trackPrint(labels) {
    var sum_of_totals = 0;
    for (var label of labels) {
      sum_of_totals += this.tracking[label].total;
    }
    for (var label of labels) {
      var fraction = this.tracking[label].total / sum_of_totals;
      console.log(label + ": " + Math.round(fraction * 100).toFixed(2) + "%");
    }
  }


  preloadAnimations(and_then) {
    let Assets = PIXI.Assets;

    // Pastel Buttons for Follow Through come from
    // https://villaniouscat.itch.io/pastelpixelbuttons/
    Assets.add({ alias: "vanna", src: "Art/vanna.png" });
    Assets.add({ alias: "empty_yellow_frame", src: "Art/empty_yellow_frame.png" });
    Assets.add({ alias: "Wonderbar.otf", src:"Wonderbar.otf", data: { scaleMode: PIXI.SCALE_MODES.NEAREST }});


    // Assets.add({ alias: "button_e", src: "Art/button_e.png" });
    // Assets.add({ alias: "trash", src: "Art/trash.png" });
    // Assets.add({ alias: "gear", src: "Art/gear.png" });
    // Assets.add({ alias: "x_mark", src: "Art/x_mark.png" });
    // Assets.add({ alias: "check_mark", src: "Art/check_mark.png" });
    // Assets.add({ alias: "left_button", src: "Art/left_button.png" });
    // Assets.add({ alias: "right_button", src: "Art/right_button.png" });
    // Assets.add({ alias: "BitOperator.ttf", src:"BitOperator.ttf", data: { scaleMode: PIXI.SCALE_MODES.NEAREST }});
    

    const assetsPromise = Assets.load(
      ["vanna", "empty_yellow_frame",
       "Wonderbar.otf",]
    );
    assetsPromise.then((assets) => {
      console.log("the assets");
      console.log(assets);
      and_then();
    });
  }


  handleMouseMove(ev) {
    if (this.screens != null
      && this.current_screen != null
      && this.screens[this.current_screen].mouseMove != null) {
      this.screens[this.current_screen].mouseMove(ev);
    }
  }


  handleMouseDown(ev) {
    if (this.screens != null
      && this.current_screen != null
      && this.screens[this.current_screen].mouseDown != null) {
      this.screens[this.current_screen].mouseDown(ev);
    }
  }


  handleMouseUp(ev) {
    console.log("le clicks")
    if (this.screens != null
      && this.current_screen != null
      && this.screens[this.current_screen].mouseUp != null) {
      this.screens[this.current_screen].mouseUp(ev);
    }
  }


  handleKeyUp(ev) {
    ev.preventDefault();

    this.keymap[ev.key] = null;

    if (this.screens != null
      && this.current_screen != null
      && this.screens[this.current_screen].keyUp != null) {
      this.screens[this.current_screen].keyUp(ev);
    }
  }


  handleKeyDown(ev) {
    if (ev.key === "Tab") {
      ev.preventDefault();
    }

    this.keymap[ev.key] = true;

    if (this.screens != null
      && this.current_screen != null
      && this.screens[this.current_screen].keyDown != null) {
      this.screens[this.current_screen].keyDown(ev);
    }
  }


  update(diff) {
    if (this.screens != null && this.current_screen != null) {
      this.screens[this.current_screen].update(diff);
    }
  }
}
