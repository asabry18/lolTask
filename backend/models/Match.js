const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  puuid: String,
  summonerName: String,
  championName: String,
  teamId: Number,
  kills: Number,
  assists: Number,
  deaths: Number,
  totalDamageDealtToChampions: Number,
  win: Boolean,
}, { strict: false });

const matchSchema = new mongoose.Schema({
  matchId: String,
  players: [playerSchema],
  totalKills: Object,
  winningTeamId: Number,
}, { strict: false });

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
