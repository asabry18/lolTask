import React from 'react';
import { Link } from 'react-router-dom';
import { LolParticles } from '../components/LolParticles';
import '../assets/css/global.css';
import '../assets/css/home.css';
import { Col, Row } from 'react-bootstrap';

export default function Home() {

  const pageTitle = "Teambuilder-Match";
  const matchName = "ID of Match: 5299363459";
  const welcomeMessage = "This match report offers a deep dive into the game's statistics. Identify the victorious team, review the total number of kills, deaths, and assists, and examine crucial player metrics such as KDA, damage dealt to champions, and overall kill participation.";
  const buttonText = "Enter the match report";

  return (
    <>
      <LolParticles />

      <div className="lol-theme-page-container">
        <div className="lol-theme-card lol-theme-card-animate">
          <div className="lol-theme-card-header">
            <h1 className="lol-theme-title">{pageTitle}</h1>
            <h2 className="lol-theme-subtitle">{matchName}</h2>
          </div>
          <div className="lol-theme-card-body">
            <p className="lol-theme-text">
              {welcomeMessage}
            </p>
            <Row className="justify-content-center">
              <Col xs="auto">
                <Link to="/stats" className="back-button my-4">
                 {buttonText}
                </Link>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}
