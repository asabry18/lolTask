const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Match = require('../models/Match');
const { parsePlayers, getTotalKills, getWinningTeamId } = require('./playerUtils');

const MongoLink = 'mongodb+srv://ahmedsabry102010:RApVK83uQrtQ8PIX@cluster0.yd571b8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function importMatchToDb() {
  try {
    await mongoose.connect(MongoLink, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const filePath = path.join(__dirname, '../routes', 'GAME_NA1_5299363459.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const matchData = JSON.parse(raw);

    const players = parsePlayers(matchData.info.participants);
    const totalKills = getTotalKills(matchData.info.participants);
    const winningTeamId = getWinningTeamId(matchData.info.teams);

    const matchDoc = new Match({
      matchId: matchData.metadata.matchId,
      players,
      totalKills,
      winningTeamId,
    });

    await matchDoc.save();
    console.log('Match data loaded into MongoDB.');
  } catch (err) {
    console.error('Error loading match data:', err);
  } finally {
    mongoose.disconnect();
  }
}

importMatchToDb();
