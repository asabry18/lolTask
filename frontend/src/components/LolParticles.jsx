import React from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export const particlesOptions = {
  fullScreen: { enable: true },
  background: { color: "transparent" },
  particles: {
    number: { value: 80 },
    color: { value: "#0dcaf0" },
    shape: { type: "circle" },
    opacity: { value: 0.8 },
    size: { value: 3 },
    move: {
      enable: true,
      speed: 0.8,
      direction: "none",
      outModes: { default: "out" }
    },
    links: {
      enable: true,
      distance: 150,
      color: "#0dcaf0",
      opacity: 0.5,
      width: 3
    }
  }
};

export function LolParticles() {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };
  
  return <Particles init={particlesInit} options={particlesOptions} />;
}
