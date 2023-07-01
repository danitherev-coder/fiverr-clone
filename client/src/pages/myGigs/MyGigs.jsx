import React, { useEffect } from "react";
import "./MyGigs.scss";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify";

const MyGigs = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  // si no existe el usuario, redirigir a login
  // window.location.reload();
  useEffect(() => {
    // si no existe el usuario, redirigir a login
    if (!currentUser) {
      navigate("/login");
    }

    // si existe el usuario, pero no es vendedor, redirigir a home
    if (currentUser && !currentUser?.user?.isSeller) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest
        .get(`/api/gigs?userId=${currentUser?.user?._id}`)
        .then((res) => {
          return res.data;
        }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/api/gigs/${id}`);
      // return newRequest.post("review", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this gig?"
      );
      if (confirmDelete) {
        deleteMutation.mutate(id);
      }
      toast.success("Gig deleted successfully");
    } catch (error) {
      toast.error("Error deleting gig");
      console.log(error);
    }
  };

  return (
    <div className="myGigs">
      {isLoading ? (
        "Loading"
      ) : error ? (
        "Error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            <Link to="/add">
              <button>Add new Gig</button>
            </Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Sales</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data?.map((gig) => (
                  <tr key={gig?._id}>
                    <td>
                      <img
                        className="image"
                        src={`https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${gig?.cover}`}
                        alt="upload"
                        loading="lazy"
                      />
                    </td>
                    <td>{gig?.title}</td>
                    <td>{gig?.price}</td>
                    <td>{gig?.sales}</td>
                    <td>
                      <img
                        className="delete"
                        src="/img/delete.webp"
                        alt="boton de eliminar"
                        title="Eliminar Gig"
                        loading="lazy"
                        onClick={() => handleDelete(gig?._id)}
                      />
                      <Link to={`/gig/${gig?._id}`}>
                        <img
                          src="/img/ojo.webp"
                          alt="boton de ver"
                          loading="lazy"
                          title="Ver Gig"
                          className="delete"
                          style={{ marginLeft: "10px" }}
                        />
                      </Link>
                      <Link to={`/editar-gig/${gig?._id}`}>
                        <img
                          src="/img/edit.png"
                          alt="boton de editar"
                          title="Editar Gig"
                          loading="lazy"
                          style={{ marginLeft: "10px", width: "20px" }}
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyGigs;
