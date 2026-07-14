//
// This file contains the interface for a sqlite database of foods.
//
// Copyright 2026 Alpha Zoo LLC.
// Written by ChatGPT.
//

const path = require('path');
const Database = require('better-sqlite3');
const { app } = require('electron');

let db = null;

const seed_data = require('./seed_data');

function getDb() {
  if (db != null) return db;

  let db_path = path.join(app.getPath('userData'), 'wheel_of_lunch.db');

  db = new Database(db_path);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      tag_group TEXT NOT NULL DEFAULT 'general',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS food_tags (
      food_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (food_id, tag_id),
      FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);

  return db;
}


function getFoodData() {
  let db = getDb();

  let foods = db.prepare(`
    SELECT id, name, active
    FROM foods
    ORDER BY name
  `).all();

  let tags = db.prepare(`
    SELECT tags.name, tags.tag_group, food_tags.food_id
    FROM tags
    JOIN food_tags ON tags.id = food_tags.tag_id
    ORDER BY tags.sort_order, tags.name
  `).all();

  let tag_groups = db.prepare(`
    SELECT name, tag_group, sort_order
    FROM tags
    ORDER BY tag_group, sort_order, name
  `).all();

  let tags_by_food = {};

  for (let row of tags) {
    if (!(row.food_id in tags_by_food)) {
      tags_by_food[row.food_id] = [];
    }

    tags_by_food[row.food_id].push(row.name);
  }

  let foods_master_list = [];

  for (let food of foods) {
    foods_master_list.push({
      id: food.id,
      name: food.name,
      active: food.active == 1,
      tags: tags_by_food[food.id] || []
    });
  }

  return {
    foods_master_list: foods_master_list,
    tag_groups: buildTagGroups(tag_groups)
  };
}


function buildTagGroups(rows) {
  let groups = [];
  let group_lookup = {};

  for (let row of rows) {
    if (!(row.tag_group in group_lookup)) {
      group_lookup[row.tag_group] = {};
      groups.push(group_lookup[row.tag_group]);
    }

    group_lookup[row.tag_group][row.name] = false;
  }

  return groups;
}

function seedDatabase(force=false) {
  let db = getDb();

  let existing_food_count = db.prepare(`
    SELECT COUNT(*) AS count
    FROM foods
  `).get().count;

  if (existing_food_count > 0 && !force) {
    console.log("Database already has food data; skipping seed.");
    return;
  }

  if (force) {
    db.exec(`
      DELETE FROM food_tags;
      DELETE FROM foods;
      DELETE FROM tags;
    `);
  }

  let insert_food = db.prepare(`
    INSERT OR IGNORE INTO foods
    (name, active)
    VALUES (?, ?)
  `);

  let insert_tag = db.prepare(`
    INSERT OR IGNORE INTO tags
    (name, tag_group, sort_order)
    VALUES (?, ?, ?)
  `);

  let get_food = db.prepare(`
    SELECT id
    FROM foods
    WHERE name = ?
  `);

  let get_tag = db.prepare(`
    SELECT id
    FROM tags
    WHERE name = ?
  `);

  let insert_food_tag = db.prepare(`
    INSERT OR IGNORE INTO food_tags
    (food_id, tag_id)
    VALUES (?, ?)
  `);

  let transaction = db.transaction(() => {
    for (let group_index = 0; group_index < seed_data.tag_groups.length; group_index++) {
      let group = seed_data.tag_groups[group_index];

      for (const [tag_name, value] of Object.entries(group)) {
        insert_tag.run(
          tag_name,
          "group_" + group_index,
          group_index
        );
      }
    }

    for (let food of seed_data.foods_master_list) {
      insert_food.run(
        food.name.trim(),
        food.active ? 1 : 0
      );

      let food_row = get_food.get(food.name.trim());

      for (let tag_name of food.tags) {
        let cleaned_tag = tag_name.trim();

        insert_tag.run(
          cleaned_tag,
          "general",
          999
        );

        let tag_row = get_tag.get(cleaned_tag);

        insert_food_tag.run(
          food_row.id,
          tag_row.id
        );
      }
    }
  });

  transaction();

  console.log("Seeded Wheel of Lunch database.");
}


module.exports = {
  getDb,
  getFoodData,
  seedDatabase
};