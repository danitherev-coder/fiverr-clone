import React, { useEffect, useRef, useState, memo } from "react";
import "./Gigs.scss";

import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

const Gigs = () => {
  const [sort, setSort] = useState("sales"); // para ordenar los gigs por ventas o por fecha de creacion
  const [open, setOpen] = useState(false); // para abrir el menu de sort
  const minRef = useRef(); // referenciar el precio minimo que escribo en el input
  const maxRef = useRef(); // referenciar el precio maximo que escribo en el input

  const { search } = useLocation(); // para obtener el query string de la url

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(
          `/api/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  console.log(data);

  const reSort = (type) => {
    setSort(type); // para cambiar el tipo de ordenamiento
    setOpen(false); // para cerrar el menu de sort
  };

  useEffect(() => {
    refetch(); // para que se vuelva a ejecutar el query cuando cambie el sort
  }, [sort]);

  const apply = () => {
    refetch(); // para que se vuelva a ejecutar el query cuando cambie el precio
  };

  console.log(data, "data de los gigs");

  // aca estamos arreglando el nombre de la categoria para que se vea bien en la pagina, ya que por defecto viene en minuscula y con guiones, por ejemplo: diseño-grafico, con esto lo arreglamos para que se vea asi: Diseño Grafico
  const arreglarCat = data?.[0]?.cat;
  const formatearCat = arreglarCat
    ? arreglarCat
        .toUpperCase()
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">FIVERR &gt; {formatearCat}</span>
        {/* <span className="breadcrumbs">FIVERR &gt; GRAPHICS & DESIGN</span> */}
        <h1>{formatearCat}</h1>
        {/* <h1>AI Artists</h1> */}
        <p>
          Explora los límites del arte y la tecnología con los artistas de IA de
          Fiverr
        </p>
        <div className="menu">
          <div className="left">
            <span>Budged</span>
            <input ref={minRef} type="text" placeholder="min" />
            <input ref={maxRef} type="text" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">SortBy:</span>
            <span className="sortType" onClick={() => setOpen(!open)}>
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img
              src="./img/down.webp"
              alt="bajar"
              loading="lazy"
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                {/* <span onClick={() => reSort("sales")}>Popular</span> */}
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong"
            : data?.map((gig) => <GigCard key={gig?._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
};

export default memo(Gigs);
