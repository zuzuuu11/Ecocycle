'use strict';

const fs = require('fs');
const path = require('path');
const { products, disposalPartners, recyclers, rewardTiers } = require('./seedData');

const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');

function defaultDb() {
  return {
    users: [],
    products: JSON.parse(JSON.stringify(products)),
    disposalPartners: JSON.parse(JSON.stringify(disposalPartners)),
    recyclers: JSON.parse(JSON.stringify(recyclers)),
    rewardTiers: JSON.parse(JSON.stringify(rewardTiers)),
  };
}

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const fresh = defaultDb();
      writeDb(fresh);
      return fresh;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const data = JSON.parse(raw);
    if (!data.products?.length) data.products = defaultDb().products;
    if (!data.disposalPartners?.length) data.disposalPartners = defaultDb().disposalPartners;
    if (!data.recyclers?.length) data.recyclers = defaultDb().recyclers;
    if (!data.rewardTiers?.length) data.rewardTiers = defaultDb().rewardTiers;
    if (!Array.isArray(data.users)) data.users = [];
    return data;
  } catch {
    const fresh = defaultDb();
    writeDb(fresh);
    return fresh;
  }
}

function writeDb(data) {
  const dir = path.dirname(DB_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function findUserByEmail(email) {
  const db = readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  const db = readDb();
  return db.users.find((u) => u.id === id);
}

function saveUser(user) {
  const db = readDb();
  const i = db.users.findIndex((u) => u.id === user.id);
  if (i === -1) db.users.push(user);
  else db.users[i] = user;
  writeDb(db);
  return user;
}

function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    impactKgCo2: u.impactKgCo2,
    points: u.points,
    pointsGoal: u.pointsGoal,
  };
}

function findProductByBarcode(barcode) {
  const db = readDb();
  return db.products.find((p) => p.barcode === barcode) || null;
}

module.exports = {
  readDb,
  writeDb,
  findUserByEmail,
  findUserById,
  saveUser,
  publicUser,
  findProductByBarcode,
  defaultDb,
};
