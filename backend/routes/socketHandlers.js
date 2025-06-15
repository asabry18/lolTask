const mongoose = require('mongoose');
const Match = require('../models/Match');

mongoose.connect('mongodb+srv://ahmedsabry102010:RApVK83uQrtQ8PIX@cluster0.yd571b8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {

    socket.on('getStats', async () => {
      try {
        const match = await Match.findOne();
        if (!match) {
          socket.emit('stats', { error: 'No match data found in database.' });
          return;
        }
        socket.emit('stats', {
          playerStats: match.players.map(p => ({
            puuid: p.puuid,
            summonerName: p.summonerName,
            championName: p.championName,
            teamId: p.teamId,
            kills: p.kills,
            assists: p.assists,
            deaths: p.deaths,
            totalDamageDealtToChampions: p.totalDamageDealtToChampions,
            killParticipation: p.killParticipation,
          })),
          totalKills: match.totalKills,
          winningTeamId: match.winningTeamId
        });
      } catch (err) {
        socket.emit('stats', { error: 'Failed to fetch match stats from database.' });
      }
    });

    socket.on('getPlayerStats', async (puuid) => {
      try {
        const match = await Match.findOne({ 'players.puuid': puuid });
        if (!match) {
          socket.emit('playerStats', { error: 'No match data found in database.' });
          return;
        }
        const player = match.players.find(p => p.puuid === puuid);
        if (!player) {
          socket.emit('playerStats', { error: 'Player not found.' });
          return;
        }
        socket.emit('playerStats', player);
      } catch (err) {
        socket.emit('playerStats', { error: 'Failed to fetch player stats from database.' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = setupSocketHandlers;
