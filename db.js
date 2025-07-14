const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./sqlite/xd.db");
//const db = new sqlite3.Database(":memory:");

module.exports = {
    createTables: () => db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS animes(
                 name VARCHAR(255) NOT NULL COLLATE NOCASE
                );`);
        db.run(`CREATE TABLE IF NOT EXISTS episodes(
                 anime_id INTEGER, 
                 no INTEGER, 
                 watched BOOLEAN NOT NULL CHECK(watched IN(0,1))
              );`);
    }),
    showAnimes: () => {
        db.serialize(() => {
            db.each(`SELECT rowid as id, name
                     FROM animes;`, (err, row) => {
                console.log(row);
            });
        })
    },
    showEpisodes: () => {
        db.serialize(() => {
            db.each(`SELECT rowid as id, anime_id, no, watched
                     FROM episodes;`, (err, row) => {
                console.log(row);
            });
        })
    },
    show: () => {
        db.serialize(() => {
            db.each(`SELECT e.no, a.name as anime_name 
                     FROM episodes as e 
                     LEFT OUTER JOIN animes as a 
                     ON e.anime_id = a.rowid`, (err, row) => {
                console.log(row.anime_name + "#" + row.no);
            });
        })
    },
    getAnime: (anime_name) => new Promise((resolve, reject) => {
        db.get(`SELECT rowid as id, name FROM animes WHERE name='${anime_name}';`,
            (err, row) => {
                if (row === undefined)
                    resolve(JSON.parse("{}"));
                else
                    resolve(row);
                if (err)
                    reject(err);
            })
    }),
    getAnimeEp: (anime_name, no) => new Promise((resolve, reject) => {
        db.get(`SELECT rowid as anime_id FROM animes WHERE name='${anime_name}';`,
            (err, row) => {
                if (row === undefined)
                    resolve(JSON.parse("{}"));
                else {
                    let anime_id = row.anime_id;
                    db.get(`SELECT * FROM episodes 
                            WHERE anime_id=${anime_id} AND no=${no};`,
                        (err, row) => {
                            if (row === undefined)
                                resolve(JSON.parse("{}"));
                            else
                                resolve(row);
                            if (err)
                                reject(err);
                        })
                }
                if (err)
                    reject(err);
            })
    }),
    getAnimeEpisodes: (anime_name) => new Promise((resolve, reject) => {
        db.get(`SELECT rowid as anime_id FROM animes WHERE name='${anime_name}';`,
            (err, row) => {
                if (row === undefined)
                    resolve(JSON.parse("{}"));
                else {
                    let anime_id = row.anime_id;
                    db.all(`SELECT * FROM episodes 
                            WHERE anime_id=${anime_id};`,
                        (err, row) => {
                            if (row === undefined)
                                resolve(JSON.parse("{}"));
                            else
                                resolve(row);
                            if (err)
                                reject(err);
                        })
                }
                if (err)
                    reject(err);
            })
    }),
    addAnime: (anime_name) => new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `INSERT INTO animes VALUES ('${anime_name}')`;
            let stmt = db.prepare(sql);
            stmt.run();
            stmt.finalize();
            resolve(sql);
        })
    }),
    addAnimeEp: (anime_id, no) => new Promise((resolve, reject) => {
        db.serialize(() => {
            let stmt = db.prepare(
                `INSERT INTO episodes VALUES (
                                    ${anime_id}, 
                                    ${no},
                                    FALSE
                                   );`
            );
            stmt.run();
            stmt.finalize();
            resolve();
        })
    }),
    markEpisodeAsWatched: (anime_id, no) => new Promise((resolve, reject) => {
        db.serialize(() => {
            let stmt = db.prepare(
                `UPDATE episodes 
                SET watched = 1
                WHERE anime_id = ${anime_id}
                AND no = ${no};`
            );
            stmt.run();
            stmt.finalize();
            resolve();
        })
    }),
    markEpisodeAsNotWatched: (anime_id, no) => new Promise((resolve, reject) => {
        db.serialize(() => {
            let stmt = db.prepare(
                `UPDATE episodes 
                SET watched = 0
                WHERE anime_id = ${anime_id}
                AND no = ${no};`
            );
            stmt.run();
            stmt.finalize();
            resolve();
        })
    }),
    clear: () => new Promise((resolve, reject) => db.serialize(() => {
        db.run("DELETE FROM episodes;");
        db.run("DELETE FROM animes;");
        //db.run("DROP TABLE episodes;");
        //db.run("DROP TABLE animes;");
        resolve("Database was cleared");
    }))
}