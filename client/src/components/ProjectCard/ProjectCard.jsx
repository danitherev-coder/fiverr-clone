import React from "react";
import "./ProjectCard.scss";
import { Link } from "react-router-dom";

const ProjectCard = ({ item }) => {
  return (
    <Link to="/" className="link">
      <div className="projectCard">
        <img src={item.img} alt="imagen del card" loading="lazy" />
        <div className="info">
          <img src={item.pp} alt="imagen del profil us" loading="lazy" />
          <div className="texts">
            <h2>{item.cat}</h2>
            <span>{item.username}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
