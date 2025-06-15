function parsePlayers(players) {
  return players.map(p => {
    const teamId = p.teamId;
    const teamKills = players.filter(x => x.teamId === teamId)
      .reduce((sum, x) => sum + (x.kills || 0), 0) || 1;
    const killParticipation = ((p.kills + p.assists) / teamKills) * 100;

    return {
      puuid: p.puuid,
      summonerName: p.summonerName || p.riotIdGameName || 'Unknown',
      championName: p.championName,
      teamId: p.teamId,
      kills: p.kills,
      assists: p.assists,
      deaths: p.deaths,
      totalDamageDealtToChampions: p.totalDamageDealtToChampions,
      win: p.win,
      killParticipation: parseFloat(killParticipation.toFixed(2)),
    };
  });
}

function getTotalKills(players) {
  return {
    100: players.filter(p => p.teamId === 100).reduce((sum, p) => sum + (p.kills || 0), 0),
    200: players.filter(p => p.teamId === 200).reduce((sum, p) => sum + (p.kills || 0), 0),
  };
}

function getWinningTeamId(teams) {
  if (!Array.isArray(teams)) return null;
  const winner = teams.find(t => t.win);
  return winner ? winner.teamId : null;
}

module.exports = { parsePlayers, getTotalKills, getWinningTeamId };
