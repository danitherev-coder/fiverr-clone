import React, { useEffect, useReducer, useState, Suspense, lazy } from "react";
import "./Add.scss";
import { INITIAL_STATE, gigReducer } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ReactQuill = lazy(() => import("react-quill"));
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Add = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  // si no existe el usuario, redirigir a login
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

  const [singleFile, setSingleFile] = useState(undefined); // imagen cover del gig
  const [files, setFiles] = useState([]); // imagenes del gig
  const [uploading, setUploading] = useState(false); // esperar a que se suban las imagenes y el cover, para ello desactivaremos el boton de crear gigi hasta que se suban

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };
  // const handleUpload = async () => {
  //   setUploading(true);
  //   try {
  //     const cover = await upload(singleFile);
  //     const images = await Promise.all(
  //       // ponermos [...files] para convertir el objeto files en un array y poder usar el map
  //       [...files].map(async (file) => {
  //         const url = await upload(file);
  //         return url;
  //       })
  //     );
  //     setUploading(false);
  //     dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // FUNCION PARA CREAR EL GIG
  const queryClient = useQueryClient();

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ["reviews"],
  //   queryFn: () =>
  //     newRequest.get(`review/${gigId}`).then((res) => {
  //       return res.data;
  //     }),
  // });

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/api/gigs", gig);
      // return newRequest.post("review", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar los campos requeridos antes de iniciar la carga de imágenes
    if (
      !state.title ||
      !state.price ||
      !state.cat ||
      !state.shortTitle ||
      !state.shortDesc ||
      !state.deliveryTime ||
      !state.features
    ) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    let cover, images;
    try {
      setUploading(true);
      // cover = await upload(singleFile);
      // images = await Promise.all([...files].map(upload));
      cover = await upload(singleFile);
      images = await Promise.all(
        // ponermos [...files] para convertir el objeto files en un array y poder usar el map
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (error) {
      toast.error("Error al cargar las imágenes");
      console.log(error);
      setUploading(false);
      return; // Detener el proceso si hay un error en la carga de imágenes
    }

    // Continuar con el envío del formulario
    try {
      const gigData = { ...state, cover, images };
      const response = await mutation.mutateAsync(gigData);
      if (response.status === 201) {
        toast.success("¡El GIG fue creado correctamente");
        navigate("/mygigs");
      }
      // else {
      //   toast.error("Error al crear el GIG");
      //   console.log(response.data);
      // }
    } catch (error) {
      // toast.error("Error al crear el GIG");
      console.log(error);
    }
  };

  // Configuring modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline"],
      ["blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["clean"],
      [{ color: [] }],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "color",
  ];

  const customStyles = {
    '.ql-ordered-list[data-list="ordered"]': {
      paddingLeft: "20px",
    },
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add new Gig</h1>
        <div className="sections">
          <div className="left">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option aria-readonly>Seleccione una Categoria</option>
              <option value="ai-artists">AI Artists</option>
              <option value="artes-gráficas-y-diseño">
                Artes gráficas y diseño
              </option>
              <option value="programacion-y-tecnologia">
                Programacion y Tecnologia
              </option>
              <option value="musica-y-video">Música y audio.</option>
              <option value="video-y-animacion">Video & Animation</option>
              <option value="redaccion-y-traduccion">
                Redaccion y Traduccion
              </option>
              <option value="marketing">Marketing</option>
              <option value="negocio">Negocio</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              {/* <button onClick={handleSubmit}>
                {uploading ? "Loading" : "Upload"}
              </button> */}
            </div>
            <label htmlFor="">Upload Video Presentation</label>
            <input type="text" name="" id="" />
            <label htmlFor="">Description</label>
            {/* <textarea
              name="desc"
              cols="30"
              rows="16"
              placeholder="Brief descriptionsto introduce your service to customers"
              onChange={handleChange}
            ></textarea> */}

            <Suspense fallback={<div>Loading...</div>}>
              <dir>
                <ReactQuill
                  theme="snow"
                  className="editor"
                  value={state.desc}
                  onChange={(value) =>
                    dispatch({
                      type: "CHANGE_INPUT",
                      payload: { name: "desc", value },
                    })
                  }
                  formats={formats}
                  modules={modules}
                  style={customStyles}
                />
              </dir>
            </Suspense>

            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="right">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              id=""
              cols="30"
              rows="10"
              placeholder="Short description of your service"
              onChange={handleChange}
            ></textarea>
            <label htmlFor="">Delivery Time(e.g. 3 days)</label>
            <input
              type="number"
              name="deliveryTime"
              min={1}
              onChange={handleChange}
            />
            <label htmlFor="">Revisión Number</label>
            <input
              name="revision"
              type="number"
              min={1}
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">Add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>{" "}
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" min={1} onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
