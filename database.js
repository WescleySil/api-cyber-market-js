const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            address TEXT NOT NULL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            address TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS organic_compounds(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            barcode TEXT NOT NULL UNIQUE,
            expiration_date TEXT NOT NULL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS non_organic_compounds(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            barcode TEXT NOT NULL UNIQUE,
            expiration_date TEXT NOT NULL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS appliances(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            brand TEXT NOT NULL UNIQUE,
            CHECK (category BETWEEN 'A' AND 'G')  -- CHECK constraint
        )
    `);
});

module.exports = db;