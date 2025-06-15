import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RotateLoader } from 'react-spinners';
import { LolParticles } from '../components/LolParticles';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { io } from 'socket.io-client';
import '../assets/css/TeamStats.css';
import '../assets/css/global.css';

import playerHoverSound from '../assets/button-hover.wav';

import AmbessaProfile from '../assets/images/profile/Ambessa profile.png';
import ApheliosProfile from '../assets/images/profile/Aphelios profile.png';
import CorkiProfile from '../assets/images/profile/Corki profile.png';
import DianaProfile from '../assets/images/profile/Diana profile.png';
import LuluProfile from '../assets/images/profile/Lulu profile.png';
import NunuProfile from '../assets/images/profile/Nunu profile.png';
import RakanProfile from '../assets/images/profile/Rakan profile.png';
import RivenProfile from '../assets/images/profile/Riven profile.png';
import SmolderProfile from '../assets/images/profile/Smolder profile.png';
import TrundleProfile from '../assets/images/profile/Trundle profile.png';

const championImages = {
  'Ambessa': AmbessaProfile,
  'Aphelios': ApheliosProfile,
  'Corki': CorkiProfile,
  'Diana': DianaProfile,
  'Lulu': LuluProfile,
  'Nunu': NunuProfile,
  'Rakan': RakanProfile,
  'Riven': RivenProfile,
  'Smolder': SmolderProfile,
  'Trundle': TrundleProfile,
};

export default function TeamStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);  const navigate = useNavigate();

  const hoverAudio = new Audio(playerHoverSound);
  hoverAudio.volume = 1;

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.emit('getStats');
    socket.on('stats', (data) => {
      setStats(data);
      setLoading(false);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <>
        <LolParticles />
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 position-relative">
          <div className="bg-white rounded p-5 d-flex flex-column align-items-center bg-transparent">
            <RotateLoader color="#0d6efd" margin={4} size={20} />
            <h2 className="fw-bold mt-4 text-primary">Loading Match Data...</h2>
          </div>
        </div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <LolParticles />
        <div className="text-center mt-5 text-white">No data found.</div>
      </>
    );
  }

  const { playerStats, totalKills, winningTeamId } = stats;
  const teams = { 100: [], 200: [] };
  playerStats.forEach(p => {
    const kda = ((p.kills + p.assists) / (p.deaths || 1)).toFixed(2);
    if (p.teamId === 100) teams[100].push({ ...p, kda });
    else if (p.teamId === 200) teams[200].push({ ...p, kda });
  });

  const TeamCard = ({ teamId, players }) => {
    const isWinner = winningTeamId === teamId;
    const teamColor = teamId === 100 ? 'blue' : 'red';   

    const handlePlayerHover = () => {
      hoverAudio.currentTime = 0;
      hoverAudio.play().catch(error => console.error("Error playing sound:", error));
    };

    return (
      <div className={`team-card ${teamColor}-team ${isWinner ? 'winner' : ''}`}>
        <div className="team-header">
          <h2>{teamId === 100 ? 'Team Blue' : 'Team Red'} {isWinner && <span>- Winner!</span>}</h2>
          <p>Total Kills: {totalKills[teamId]}</p>
        </div>
        <div className="players-list">
          {players.map(player => (
            <div key={player.puuid} className="player-card" onMouseEnter={handlePlayerHover}>
              <img  src={championImages[player.championName]} alt={player.championName} className="champion-img" />
              <div className="player-info">
                <p className="summoner-name">{player.summonerName}</p>
                <p className="champion-name">{player.championName}</p>
              </div>
              <div className="player-stats">
                 <div className="stat-item">
                    <span className="stat-value kda-value">{player.kda} KDA</span>
                    <span className="stat-label">{player.kills} / {player.deaths} / {player.assists}</span>
                 </div>
                 <div className="stat-item">
                    <span className="stat-value">{player.totalDamageDealtToChampions.toLocaleString()}</span>
                    <span className="stat-label">Damage</span>
                 </div>
                 <div className="stat-item">
                    <span className="stat-value">{player.killParticipation}%</span>
                    <span className="stat-label">KP%</span>
                 </div>
              </div>
              <button className="view-btn" onClick={() => navigate(`/mvp/${player.puuid}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>      
      <LolParticles />
      <Container fluid className="mt-4 position-relative page-content-animate" style={{ zIndex: 1 }}> 
        <h1 className="text-center mb-4 text-white display-4 fw-bold page-title">Match Report</h1>
        <Row className="g-4 justify-content-center">
          <Col lg={6} xl={5} className="team-card-left-animate">
            <TeamCard teamId={100} players={teams[100]} />
          </Col>
          <Col lg={6} xl={5} className="team-card-right-animate">
            <TeamCard teamId={200} players={teams[200]} />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="auto">
            <Link to="/" className="back-button my-4">
              Back to Match Page
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}