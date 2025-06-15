import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RotateLoader } from 'react-spinners';
import { io } from 'socket.io-client';
import { LolParticles } from '../components/LolParticles';
import '../assets/css/MVP.css'; 

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

import AmbessaBg from '../assets/images/landscape/Ambessa.jpg';
import ApheliosBg from '../assets/images/landscape/Aphelios.jpg';
import CorkiBg from '../assets/images/landscape/Corki.jpg';
import DianaBg from '../assets/images/landscape/Diana.jpg';
import LuluBg from '../assets/images/landscape/Lulu.jpg';
import NunuBg from '../assets/images/landscape/Nunu.jpg';
import RakanBg from '../assets/images/landscape/Rakan.jpeg';
import RivenBg from '../assets/images/landscape/Riven.jpg';
import SmolderBg from '../assets/images/landscape/Smolder.jpeg';
import TrundleBg from '../assets/images/landscape/Trundle.jpg';

const championImages = {
  'Ambessa': AmbessaProfile,
  'Aphelios': ApheliosProfile,
  'Corki': CorkiProfile,
  'Diana': DianaProfile,
  'Lulu': LuluProfile,
  'Nunu': NunuProfile,
  'Nunu & Willump': NunuProfile,
  'Rakan': RakanProfile,
  'Riven': RivenProfile,
  'Smolder': SmolderProfile,
  'Trundle': TrundleProfile,
};

const championBackgrounds = {
  'Ambessa': AmbessaBg,
  'Aphelios': ApheliosBg,
  'Corki': CorkiBg,
  'Diana': DianaBg,
  'Lulu': LuluBg,
  'Nunu': NunuBg,
  'Nunu & Willump': NunuBg,
  'Rakan': RakanBg,
  'Riven': RivenBg,
  'Smolder': SmolderBg,
  'Trundle': TrundleBg,
};


export default function MVP() {
  const { puuid } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.emit('getPlayerStats', puuid);
    socket.on('playerStats', (data) => {
      setPlayer(data);
      setLoading(false);
    });
    return () => {
      socket.disconnect();
    };
  }, [puuid]);

  if (loading) {
    return (
      <>
        <LolParticles />
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 position-relative">
          <RotateLoader color="#0d6efd" margin={4} size={20} />
          <h2 className="fw-bold mt-4 text-primary">Loading Player Details...</h2>
        </div>
      </>
    );
  }

  if (!player) return (
    <>
      <LolParticles />
      <div className="text-center mt-5 text-white">Player not found.</div>
    </>
  );

  const kda = ((player.kills + player.assists) / (player.deaths || 1)).toFixed(2);
  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(10, 20, 40, 0.8), rgba(0, 0, 0, 0.6)), url(${championBackgrounds[player.championName]})`
  };

  return (
    <>
      <LolParticles />
      <div className="mvp-page-container mvp-content-animate" style={backgroundStyle}>
        <div className="mvp-card">
          <div className="mvp-header">
            <img src={championImages[player.championName]} alt={player.championName} className="mvp-avatar"/>
            <h1 className="mvp-summoner-name">{player.summonerName}</h1>
            <h3 className="mvp-champion-name">{player.championName}</h3>
          </div>

          <div className="mvp-primary-stat">
            <div className="mvp-kda-value">{kda} KDA</div>
            <div className="mvp-kda-breakdown">{player.kills} / {player.deaths} / {player.assists}</div>
          </div>

          <div className="mvp-stats-grid">
            <div className="mvp-stat-item">
              <span className="mvp-stat-value">{player.totalDamageDealtToChampions.toLocaleString()}</span>
              <span className="mvp-stat-label">Damage to Champions</span>
            </div>
            <div className="mvp-stat-item">
              <span className="mvp-stat-value">{player.killParticipation}%</span>
              <span className="mvp-stat-label">Kill Participation</span>
            </div>
            <div className="mvp-stat-item">
              <span className="mvp-stat-value">{player.kills}</span>
              <span className="mvp-stat-label">Kills</span>
            </div>
            <div className="mvp-stat-item">
              <span className={`mvp-stat-value ${player.teamId === 100 ? 'blue-team-text' : 'red-team-text'}`}>
                Team {player.teamId === 100 ? 'Blue' : 'Red'}
              </span>
              <span className="mvp-stat-label">Team</span>
            </div>
          </div>

          <Link to="/stats" className="back-button">
            Back to Match Report
          </Link>
        </div>
      </div>
    </>
  );
}