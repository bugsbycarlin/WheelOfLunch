//
// This file contains the main wheel spinning program, desktop version.
//
// Copyright 2026 Alpha Zoo LLC.
// Written by Matthew Carlin with assistance from ChatGPT.
//


const TAG_MARGIN = 25;

// original
// const wheel_colors = [0xEF9585, 0xBADCE9, 0xFFFDCC];

// game show
// const wheel_colors = [0xF6E89A, 0x9CCEEA, 0xE88A7A];

// jewel tones
// const wheel_colors = [0xF2D87A, 0x67C6D8, 0xD96B74];

// modern board game
// const wheel_colors = [0xF3E6A3, 0x7EC8D8, 0xE79A87];

// Emerald Silver Ruby
// const wheel_colors = [0x2FA56B, 0xD8DDE3, 0xC2476B];

// TV game show Silver, Royal Blue, Purple, Gold
// const wheel_colors = [0xDCE2EA, 0x356FCE, 0x8455C8, 0xE4B83E];

// Jewel Silver, Royal Blue, Purple, Gold
// const wheel_colors = [0xD3D8E2, 0x245CB8, 0x6E42B8, 0xD5A42C];

// Stage Lighting Silver, Royal Blue, Purple, Gold
// const wheel_colors = [0xE0DCE7, 0x4A7EDC, 0x8C63CF, 0xE5BE58];

// WOF Silver, Royal Blue, Purple, Gold
// const wheel_colors = [0xE7EBEF, 0x2D7DE0, 0x8B49D5, 0xF2C84A];

// Alpha Zoo Gold, Purple, Silver, Royal Blue
const wheel_colors = [0xD9B14D, 0x7A5CC6, 0xD8DFE6, 0x4A88D9];



const wheel_x = 642;
const wheel_y = 407;
const wheel_scale = 0.86;


class Wheel extends Screen {
  // Set up the screen
  initialize(width, height) {
    console.log("THIS WAS CREATED ONCE")
    this.state = null;

    this.game_width = width;
    this.game_height = height;

    this.layers = {};
    let layers = this.layers;

    layers["background"] = new PIXI.Container();
    this.addChild(layers["background"]);

    layers["wheel"] = new PIXI.Container();
    this.addChild(layers["wheel"]);

    this.standard_font = {fontFamily: "Arial", fontSize: 24, fontWeight: 200, fill: 0x22242A, letterSpacing: 1, align: "left"};    
    this.white_font = {fontFamily: "Arial", fontSize: 24, fontWeight: 200, fill: 0xFFFFFF, letterSpacing: 1, align: "left"};    

    this.wheel_background = makeSprite("wheel_background_adjusted", layers["background"], 0, -50, 0, 0, false);

    let food_data = getFoodData();

    this.foods_master_list = food_data.foods_master_list;
    this.tag_groups = food_data.tag_groups;

    this.initTags();

    this.foods = [];

    this.filterFoods();

    this.initWheel();

    this.populateWheel();

    this.wheel.eventMode = "static";
  }


  initTags() {
    var self = this;
    let layers = this.layers;

    let y = 2 * TAG_MARGIN;

    for (let i = 0; i < this.tag_groups.length; i++) {
      for (const [key, value] of Object.entries(this.tag_groups[i])) {
        let tag_button = makeText(key, this.white_font, layers["background"], this.game_width - 150, y, 0, 0.5);
        tag_button.tint = 0x22242A;
        tag_button.interactive = true;
        tag_button.buttonMode = true;
        tag_button.on('click', () => {
          if (self.tag_groups[i][key] === false) {
            self.tag_groups[i][key] = true;
            tag_button.tint = 0x00FF00;
            self.filterFoods();
            self.populateWheel();
          } else if (self.tag_groups[i][key] === true) {
            self.tag_groups[i][key] = false;
            tag_button.tint = 0x22242A;
            self.filterFoods();
            self.populateWheel();
          }

        });
        y += TAG_MARGIN;
      }
      let spacer = makeBlank(layers["background"], 60, 5, this.game_width - 150, y, 0x22242A);
      y += TAG_MARGIN;
    }
  }


  makeBeveledWedge(color, radius, arc) {
    let wedge = new PIXI.Container();

    let dark_color = darkenColor(color, 0.24);
    let light_color = lightenColor(color, 0.12);

    //
    // Dark backing. Since it extends slightly beyond the main face,
    // it appears as a narrow outer bevel.
    //
    let backing = drawWedge(new PIXI.Graphics(),0,0,radius,arc);

    backing.fill(dark_color);
    wedge.addChild(backing);


    //
    // Main colored face.
    //
    let face = drawWedge(new PIXI.Graphics(),0,0,radius - 10,arc);

    face.fill(color);
    wedge.addChild(face);


    //
    // Slightly lighter inset face. This gives the slice some depth
    // without changing the underlying palette.
    //
    let inset = drawWedge(new PIXI.Graphics(),0,0,radius - 33,arc
    );

    inset.fill(light_color);
    inset.alpha = 0.42;
    wedge.addChild(inset);

    //
    // Add a light edge to one side of the wedge.
    //
    // let highlight_edge = new PIXI.Graphics();

    // highlight_edge
    //   .moveTo(0, 0)
    //   .lineTo(radius - 10, 0)
    //   .stroke({
    //     width: 8,
    //     color: 0xFFFFFF,
    //     alpha: 0.38
    //   });

    // wedge.addChild(highlight_edge);

    //
    // Add a darker edge to the other side.
    //
    let arc_radians = arc * Math.PI / 180;

    let shadow_edge = new PIXI.Graphics();

    shadow_edge
      .moveTo(0, 0)
      .lineTo(
        Math.cos(-arc_radians) * (radius - 10),
        Math.sin(-arc_radians) * (radius - 10)
      )
      .stroke({
        width: 8,
        color: 0x201727,
        alpha: 0.12
      });

    wedge.addChild(shadow_edge);


    //
    // A clear outline around the main face.
    //
    let outline = drawWedge(new PIXI.Graphics(),0,0,radius - 10,arc);

    outline.stroke({
      width: 2,
      color: 0x4A3C59,
      alpha: 0.85
    });

    wedge.addChild(outline);




    return wedge;
  }


  initWheel() {
    var self = this;
    let layers = this.layers;

    this.ticker = makeBlank(layers["background"], 30, 3, this.game_width / 2 + 320, this.game_height / 2, 0x22242A, 0, 0);

    this.wheel = new PIXI.Container();
    this.wheel.position.set(wheel_x, wheel_y);
    this.wheel.angle_velocity = 0;
    layers["wheel"].addChild(this.wheel);

    // let wheel_shadow = drawWedge(new PIXI.Graphics(),
    //       10,  10, 300, 360);
    // wheel_shadow.fill(0x000000);
    // wheel_shadow.alpha = 0.2;
    // this.wheel.addChild(wheel_shadow);

    let wheel_backing = drawWedge(new PIXI.Graphics(),
           0, 0, 302, 360);
    wheel_backing.fill(0x6d5837);
    this.wheel.addChild(wheel_backing);

    // xk.lineStyle(10, 0xFF0000);
    let wedge_count = 15;
    let wedge_arc = 360 / wedge_count;

    for (let i = 0; i < wedge_count; i++) {
      let wedge = this.makeBeveledWedge(
        wheel_colors[i % wheel_colors.length],
        300,
        wedge_arc
      );

      wedge.angle = wedge_arc * i + wedge_arc / 2;

      this.wheel.addChild(wedge);
    }

    this.wheel.gloss = makeWheelGloss(this.wheel,300);

    this.wheel.on('click', () => {
      console.log(this.wheel)
      this.wheel.last_tick_angle = this.wheel.angle;
      this.wheel.angle_velocity = 18 + Math.random() * 4;
    });

    this.wheel.textboxes = [];
    for (let i = 0; i < 15; i++) {
      let textbox = makeText("", this.standard_font, this.wheel, 0, 0, 0, 0.5);
      textbox.angle = 360 / 15 * i;
      this.wheel.textboxes.push(textbox);
    }

    this.wheel.scale.set(wheel_scale,wheel_scale);

    // this.hub = makeGoldHub(layers["wheel"], 44, 2);
    this.hub = makeGemstoneHub(layers["wheel"],0xC2476B,44, 2);
    this.hub.position.set(wheel_x, wheel_y);
  }


  populateWheel() {
    var self = this;
    let layers = this.layers;

    for (let i = 0; i < 15; i++) {
      if (this.foods.length > i) {
        this.wheel.textboxes[i].text = "            " + this.foods[i];
      } else {
        this.wheel.textboxes[i].text = "";
      }
    }
  }


  // Use the list of tags (which may be enabled/true or disabled/false)
  // to create a filtered list of available foods for the wheel.
  // Note: this is a very copy heavy way to do filtering, but it's easy
  // to understand, and the data is small, and the wheel isn't filtered
  // or spun many times.
  filterFoods() {
    // First, clear the foods, and copy over every active food on the master list
    this.foods = [];
    for (let i = 0; i < this.foods_master_list.length; i++) {
      let food = this.foods_master_list[i];
      if (food.active) {
        this.foods.push({
          name: food.name,
          tags: food.tags,
        })
      }
    }
    console.log("This is the food list before filtering:")
    console.log(this.foods);

    // Then, run through the tag groups
    for (let i = 0; i < this.tag_groups.length; i++) {
      let group = this.tag_groups[i];

      // Run through all the tags in the group. If no tag is enabled,
      // we don't filter.
      let filter_group = false;
      let filter_tags = [];
      for (const [key, value] of Object.entries(this.tag_groups[i])) {
        if (value === true) {
          console.log(key + " is on, filtering group.");
          filter_group = true;
          filter_tags.push(key);
        }
      }

      // If any tag is enabled, we filter, keeping any food that
      // has any of the enabled tags.
      if (filter_group) {
        this.foods.removeIf(function(food) {
          let discard = true;
          for (let tag of filter_tags) {
            if (food.tags.includes(tag)) discard = false;
          }

          return discard;
        });
      }
    }

    // Finally, boil the foods array down to just the names,
    console.log("This is the food list after filtering:")
    console.log(this.foods);
    let new_foods = [];
    for (let i = 0; i < this.foods.length; i++) {
      new_foods.push(this.foods[i].name);
    }
    this.foods = new_foods;

    // and shuffle it.
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

