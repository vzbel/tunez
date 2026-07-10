const express = require("express");

const { S3 } = require("../config/s3.js");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const ErrorNames = require("../config/errorNames.js");
const { pool } = require("../config/database.js");

// generates a temporary url through which the mp3 file
// denoted by "objectPath" can be uploaded to a bucket
const getPresignedUploadURL = async (req, res, next) => {
  if (!req.body) {
    const error = new Error();
    error.name = ErrorNames.NO_REQ_BODY;
    return next(error);
  }
  const { objectPath } = req.body;
  try {
    const putUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: process.env.R2_TRACKS_BUCKET,
        Key: objectPath,
        ContentType: "audio/mpeg",
      }),
      { expiresIn: 900 },
    );
    return res.status(200).json({ url: putUrl });
  } catch (error) {
    return next(error);
  }
};

// expects song metadata and a list of artist(s) names
const createTrack = async (req, res, next) => {
  if (!req.body) {
    const error = new Error();
    error.name = ErrorNames.NO_REQ_BODY;
    return next(error);
  }

  // transactions must be done with a client
  const client = await pool.connect();
  try {
    // track metadata
    const { title, genre, objectPath, artists } = req.body;
    const coverUrl = req.body.coverUrl || null;
    const description = req.body.description || null;
    if (!title || !genre || !objectPath || !artists || artists.length === 0) {
      return res.status(400).json({
        error: "User id, title, genre, object path, and artist(s) are required",
      });
    }

    // create song and artist entries atomically
    await client.query("BEGIN");
    const songResults = await client.query(
      `
      INSERT INTO songs(user_id, cover_url, title, genre, description, object_path)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *;
      `,
      [req.user.id, coverUrl, title, genre, description, objectPath],
    );
    const song = songResults.rows[0];
    for (const artist of artists) {
      await client.query(
        `
      INSERT INTO song_artists(song_id, artist)
      VALUES($1,$2);
      `,
        [song.id, artist],
      );
    }
    await client.query("COMMIT");

    // retrieve the inserted song and its artists names
    const insertedSongResults = await client.query(
      `
      SELECT *
      FROM songs INNER JOIN song_artists
        ON songs.id = song_artists.song_id
      WHERE songs.id = $1;
      `,
      [song.id],
    );

    // construct a single list of artists
    const insertedSong = insertedSongResults.rows[0];
    insertedSong.artists = [];
    for (const joinedSong of insertedSongResults.rows) {
      insertedSong.artists.push(joinedSong.artist);
    }

    // clean up redundant fields
    delete insertedSong.artist;
    delete insertedSong.song_id;
    return res.status(201).json(insertedSong);
  } catch (error) {
    await client.query("ROLLBACK");
    return next(error);
  }
};

module.exports = {
  getPresignedUploadURL,
  createTrack,
};
