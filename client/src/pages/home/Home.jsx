import React, { Suspense, lazy, memo } from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
// import TrustedBy from "../../components/trustedBy/TrustedBy";
const TrustedBy = lazy(() => import("../../components/trustedBy/TrustedBy"));
import Slide from "../../components/Slides/Slide";
// import CategoryCard from "../categoryCard/CategoryCard";
import { cards, projects } from "../../data";
// import CategoryCard from "../../components/categoryCard/CategoryCard";
const CategoryCard = lazy(() =>
  import("../../components/categoryCard/CategoryCard")
);
// import ProjectCard from "../../components/ProjectCard/ProjectCard";
const ProjectCard = lazy(() =>
  import("../../components/ProjectCard/ProjectCard")
);

// este memo sirve para memorizar el componente y poder cargar cuando ya cargo 1 vez, rapido
const MemoizedTrustedBy = memo(() => (
  <Suspense fallback={<div>Loading...</div>}>
    <TrustedBy />
  </Suspense>
));
MemoizedTrustedBy.displayName = "MemoizedTrustedBy";

const MemoizedCategoryCard = memo(({ item }) => (
  <CategoryCard key={item.id} item={item} />
));

MemoizedCategoryCard.displayName = "MemoizedCategoryCard";

const MemoizedProjectCard = memo(({ item }) => (
  <ProjectCard key={item.id} item={item} />
));
MemoizedProjectCard.displayName = "MemoizedCategoryCard";

const Home = () => {
  return (
    <div className="home">
      <Featured />
      <Suspense fallback={<div>Loading...</div>}>
        <MemoizedTrustedBy />
      </Suspense>
      <h2
        style={{
          marginLeft: "250px",
          marginBottom: "-55px",
          marginTop: "30px",
          fontSize: "25pt",
          fontWeight: "500",
        }}
      >
        Servicios Populares
      </h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Slide slidesToShow={5} arrowsScroll={4}>
          {cards.map((card) => (
            <MemoizedCategoryCard key={card.id} item={card} />
          ))}
        </Slide>
      </Suspense>
      <div className="features">
        <div className="container">
          <div className="item">
            <h1>A Whole world of freelance talent at your fingertips</h1>
            <div className="title">
              <img src="./img/check.webp" alt="check" loading="lazy" />
              The Best For Every Budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly
              rates,Just project-based pricing.
            </p>
            <div className="title">
              <img src="./img/check.webp" alt="check" loading="lazy" />
              The Best For Every Budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly
              rates,Just project-based pricing.
            </p>
            <div className="title">
              <img src="./img/check.webp" alt="check" loading="lazy" />
              The Best For Every Budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly
              rates,Just project-based pricing.
            </p>
            <div className="title">
              <img src="./img/check.webp" alt="check" loading="lazy" />
              The Best For Every Budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly
              rates,Just project-based pricing.
            </p>
          </div>
          <div className="item">
            {/* <video src="./img/video.mp4" controls></video> */}
            <Suspense fallback={<div>Loading video...</div>}>
              <video
                src="https://res.cloudinary.com/dpyr2wyaf/video/upload/v1687141240/fiverr/LOGOS/video_ctlfuh.mp4"
                controls
              ></video>
            </Suspense>
          </div>
        </div>
      </div>
      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>fiverr business</h1>
            <h1>Una solución creada para negocios</h1>
            <p>
              Mejora tu experiencia para acceder a un profesional con talento
              seleccionado y herramientas exclusivas
            </p>
            <div className="title">
              <img src="./img/check.webp" alt="check" loading="lazy" />
              Coincidencia de talentos
            </div>
            <div className="title">
              <img src="./img/check.webp" alt="check" loading="lazy" />
              Gestión de cuentas especializada
            </div>
            <div className="title">
              <img src="./img/check.webp" alt="check" loading="lazy" />
              Herramientas para la colaboración en equipo
            </div>
            <div className="title">
              <img src="./img/check.webp" alt="check" loading="lazy" />
              Soluciones de pago para negocios
            </div>
            <button>Explora Fiverr Business</button>
          </div>
          <div className="item">
            <img src="/img/fiverr.webp" alt="" />
          </div>
        </div>
      </div>
      <h2
        style={{
          marginLeft: "250px",
          marginBottom: "-55px",
          marginTop: "30px",
          fontSize: "25pt",
          fontWeight: "500",
        }}
      >
        Trabajo inspirador Made on Fiverr
      </h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Slide slidesToShow={4} arrowsScroll={4}>
          {projects.map((card) => (
            <MemoizedProjectCard key={card.id} item={card} />
          ))}
        </Slide>
      </Suspense>
    </div>
  );
};

export default Home;
