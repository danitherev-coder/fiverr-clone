import React, { useEffect, useReducer, useState, Suspense, lazy } from "react";
import "./EditarGig.scss";
import { INITIAL_STATE, gigReducer } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ReactQuill = lazy(() => import("react-quill"));
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditarGig = () => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };
  const navigate = useNavigate();

  const [singleFile, setSingleFile] = useState(); // imagen cover del gig
  const [files, setFiles] = useState([]); // imagenes del gig
  const [uploading, setUploading] = useState(false); // esperar a que se suban las imagenes y el cover, para ello desactivaremos el boton de crear gigi hasta que se suban

  // FUNCION PARA EDITAR EL GIG
  //   const queryClient = useQueryClient();
  const mutation = useMutation((gig) => newRequest.put(`/api/gigs/${id}`, gig));

  const [formData, setFormData] = useState({});
  const [isFormDataLoaded, setIsFormDataLoaded] = useState(false);

  useEffect(() => {
    const getGigData = async () => {
      try {
        const res = await newRequest.get(`/api/gigs/single/${id}`);
        setFormData(res.data);
        setIsFormDataLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    getGigData();
  }, [id]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // si el usuario que vista la pagina no es el que creo el gig, redigiri al home
  // si el usuario que visita la página no es el que creó el gig, redirigir al home
  useEffect(() => {
    if (isFormDataLoaded && currentUser?.user?._id !== formData?.userId) {
      navigate("/");
    }
  }, [isFormDataLoaded, currentUser, formData, navigate]);

  console.log(formData, "este es el form data");
  console.log(typeof currentUser?.user?._id, "tipo de dato current");
  console.log(typeof formData?.userId, "tipo de dato formdata");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleQuillChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      desc: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verificar si formData está definido
      if (!formData || Object.keys(formData).length === 0) {
        toast.error("Error: Los datos del formulario no están disponibles");
        return;
      }

      // Validar los campos requeridos antes de iniciar la carga de imágenes
      if (
        !formData.title ||
        !formData.price ||
        !formData.cat ||
        !formData.shortTitle ||
        !formData.shortDesc ||
        !formData.deliveryTime ||
        !formData.features
      ) {
        toast.error("Completa todos los campos obligatorios");
        return;
      }

      let cover, images;
      try {
        setUploading(true);
        if (singleFile) {
          cover = await upload(singleFile);
        } else {
          cover = formData?.cover; // Mantener la imagen anterior si no se selecciona un nuevo archivo
        }
        if (files?.length > 0) {
          images = await Promise.all([...files].map(upload));
        } else {
          images = formData?.images; // Mantener las imágenes anteriores si no se selecciona un nuevo archivo
        }
        dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
      } catch (error) {
        toast.error("Error al cargar las imágenes");
        console.log(error);
        setUploading(false);
        return; // Detener el proceso si hay un error en la carga de imágenes
      }

      // Continuar con el envío del formulario
      try {
        const gigData = { ...formData, cover, images };
        const response = await mutation.mutateAsync(gigData);
        console.log(response, "que hay en response");
        if (response.data === "OK") {
          toast.success("¡El GIG fue modificado correctamente");
          setTimeout(() => {
            navigate("/mygigs");
            // window.location.reload();
          }, 2000);
        }
      } catch (error) {
        // toast.error("Error al crear el GIG");
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Configurando módulos y formatos de ReactQuill
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
    ".ql-ordered-list[data-list='ordered']": {
      paddingLeft: "20px",
    },
  };

  console.log(currentUser, "que hay en currentUser");

  return (
    <div className="add">
      <div className="container">
        <div style={{ display: "flex", gap: "5px" }}>
          <span>
            <img src="/img/izq.png" alt="regresar" width={25} height={25} />
          </span>
          <span>
            <Link className="link" to="/mygigs">
              Regresar a mis Gigs
            </Link>
          </span>
        </div>
        <h1>Update Gig</h1>
        <div className="sections">
          <div className="left">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleFormChange}
              value={formData?.title || ""}
            />
            <label htmlFor="">Category</label>
            <select
              name="cat"
              id="cat"
              onChange={handleFormChange}
              value={formData?.cat}
            >
              <option disabled>Seleccione una Categoria</option>
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
            </div>
            <label htmlFor="">Upload Video Presentation</label>
            <input type="text" name="" id="" />
            <label htmlFor="">Description</label>
            <Suspense fallback={<div>Loading...</div>}>
              <div>
                <ReactQuill
                  theme="snow"
                  className="editor"
                  value={formData?.desc || ""}
                  onChange={handleQuillChange}
                  formats={formats}
                  modules={modules}
                  style={customStyles}
                />
              </div>
            </Suspense>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="right">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              value={formData?.shortTitle}
              onChange={handleFormChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              id=""
              cols="30"
              value={formData?.shortDesc}
              rows="10"
              placeholder="Short description of your service"
              onChange={handleFormChange}
            ></textarea>
            <label htmlFor="">Delivery Time(e.g. 3 days)</label>
            <input
              type="number"
              name="deliveryTime"
              value={formData?.deliveryTime}
              min={1}
              onChange={handleFormChange}
            />
            <label htmlFor="">Revisión Number</label>
            <input
              name="revision"
              value={formData?.revision}
              type="number"
              min={1}
              onChange={handleFormChange}
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
            <input
              type="number"
              min={1}
              onChange={handleFormChange}
              name="price"
              value={formData?.price}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarGig;

// import React, { useEffect, useReducer, useState, Suspense, lazy } from "react";
// import "./EditarGig.scss";
// import { INITIAL_STATE, gigReducer } from "../../reducers/gigReducer";
// import upload from "../../utils/upload";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import newRequest from "../../utils/newRequest";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// const ReactQuill = lazy(() => import("react-quill"));
// import "react-quill/dist/quill.snow.css";

// const EditarGig = () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // buscar con react-query al gig

//   const { isLoading, error, data } = useQuery({
//     queryKey: ["myGigs"],
//     queryFn: () =>
//       newRequest.get(`/api/gigs/single/${id}`).then((res) => {
//         return res.data;
//       }),
//   });

//   console.log(data, "datos del gig a editar");
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//   if (error) {
//     return <div>{error}</div>;
//   }

//   // si no existe el usuario, redirigir a login
//   useEffect(() => {
//     // si no existe el usuario, redirigir a login
//     if (!currentUser) {
//       navigate("/login");
//     }

//     // si existe el usuario, pero no es vendedor, redirigir a home
//     if (currentUser && !currentUser?.user?.isSeller) {
//       navigate("/");
//     }
//   }, [currentUser, navigate]);

//   const [singleFile, setSingleFile] = useState(undefined); // imagen cover del gig
//   const [files, setFiles] = useState([]); // imagenes del gig
//   const [uploading, setUploading] = useState(false); // esperar a que se suban las imagenes y el cover, para ello desactivaremos el boton de crear gigi hasta que se suban

//   const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

//   //   const handleChange = (e) => {
//   //     dispatch({
//   //       type: "CHANGE_INPUT",
//   //       payload: { name: e.target.name, value: e.target.value },
//   //     });
//   //   };
//   const handleFeature = (e) => {
//     e.preventDefault();
//     dispatch({
//       type: "ADD_FEATURE",
//       payload: e.target[0].value,
//     });
//     e.target[0].value = "";
//   };

//   // FUNCION PARA EDITAR EL GIG
//   const queryClient = useQueryClient();
//   const mutation = useMutation({
//     mutationFn: (gig) => {
//       return newRequest.put(`/api/gigs/${id}`, gig);
//       // return newRequest.post("review", review);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["myGigs"]);
//     },
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validar los campos requeridos antes de iniciar la carga de imágenes
//     if (
//       !formData.title ||
//       !formData.price ||
//       !formData.cat ||
//       !formData.shortTitle ||
//       !formData.shortDesc ||
//       !formData.deliveryTime ||
//       !formData.features
//     ) {
//       toast.error("Completa todos los campos obligatorios");
//       return;
//     }

//     let cover, images;
//     try {
//       setUploading(true);
//       if (singleFile) {
//         cover = await upload(singleFile);
//       } else {
//         cover = data.cover; // Mantener la imagen anterior si no se selecciona un nuevo archivo
//       }
//       if (files.length > 0) {
//         images = await Promise.all([...files].map(upload));
//       } else {
//         images = data.images; // Mantener las imágenes anteriores si no se selecciona un nuevo archivo
//       }
//       dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
//     } catch (error) {
//       toast.error("Error al cargar las imágenes");
//       console.log(error);
//       setUploading(false);
//       return; // Detener el proceso si hay un error en la carga de imágenes
//     }

//     // Continuar con el envío del formulario
//     try {
//       const gigData = { ...formData, cover, images };
//       const response = await mutation.mutateAsync(gigData);
//       console.log(response, "que hay en response");
//       if (response.data === "OK") {
//         toast.success("¡El GIG fue modificado correctamente");
//         // navigate("/mygigs");
//       }
//     } catch (error) {
//       // toast.error("Error al crear el GIG");
//       console.log(error);
//     }
//   };

//   // Configuring modules and formats
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, 4, 5, 6, false] }],
//       ["bold", "italic", "underline"],
//       ["blockquote"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ align: [] }],
//       ["clean"],
//       [{ color: [] }],
//     ],
//   };
//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "list",
//     "bullet",
//     "align",
//     "link",
//     "image",
//     "color",
//   ];

//   const customStyles = {
//     '.ql-ordered-list[data-list="ordered"]': {
//       paddingLeft: "20px",
//     },
//   };
//   const [formData, setFormData] = useState({});
//   useEffect(() => {
//     // ...

//     // Actualiza el estado formData con los datos iniciales
//     setFormData(data);

//     // ...
//   }, [data]);
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };
//   const handleQuillChange = (value) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       desc: value,
//     }));
//   };
//   return (
//     <div className="add">
//       <div className="container">
//         <div style={{ display: "flex", gap: "5px" }}>
//           <span>
//             <img src="/img/izq.png" alt="regresar" width={25} height={25} />
//           </span>
//           <span>
//             <a className="link" href="/mygigs">
//               Regresar a mis Gigs
//             </a>
//           </span>
//         </div>
//         <h1>Update Gig</h1>
//         <div className="sections">
//           <div className="left">
//             <label htmlFor="">Title</label>
//             <input
//               type="text"
//               name="title"
//               placeholder="e.g. I will do something I'm really good at"
//               onChange={handleFormChange}
//               value={formData?.title || ""}
//             />
//             <label htmlFor="">Category</label>
//             <select
//               name="cat"
//               id="cat"
//               onChange={handleFormChange}
//               value={formData?.cat}
//             >
//               <option aria-readonly>Seleccione una Categoria</option>
//               <option value="ai-artists">AI Artists</option>
//               <option value="artes-gráficas-y-diseño">
//                 Artes gráficas y diseño
//               </option>
//               <option value="programacion-y-tecnologia">
//                 Programacion y Tecnologia
//               </option>
//               <option value="musica-y-video">Música y audio.</option>
//               <option value="video-y-animacion">Video & Animation</option>
//               <option value="redaccion-y-traduccion">
//                 Redaccion y Traduccion
//               </option>
//               <option value="marketing">Marketing</option>
//               <option value="negocio">Negocio</option>
//             </select>
//             <div className="images">
//               <div className="imagesInputs">
//                 <label htmlFor="">Cover Image</label>
//                 <input
//                   type="file"
//                   onChange={(e) => setSingleFile(e.target.files[0])}
//                 />
//                 <label htmlFor="">Upload Images</label>
//                 <input
//                   type="file"
//                   multiple
//                   onChange={(e) => setFiles(e.target.files)}
//                 />
//               </div>
//             </div>
//             <label htmlFor="">Upload Video Presentation</label>
//             <input type="text" name="" id="" />
//             <label htmlFor="">Description</label>
//             <Suspense fallback={<div>Loading...</div>}>
//               <dir>
//                 <ReactQuill
//                   theme="snow"
//                   className="editor"
//                   value={formData?.desc || ""}
//                   onChange={handleQuillChange}
//                   formats={formats}
//                   modules={modules}
//                   style={customStyles}
//                 />
//               </dir>
//             </Suspense>
//             <button onClick={handleSubmit}>Create</button>
//           </div>
//           <div className="right">
//             <label htmlFor="">Service Title</label>
//             <input
//               type="text"
//               name="shortTitle"
//               placeholder="e.g. One-page web design"
//               value={formData?.shortTitle}
//               onChange={handleFormChange}
//             />
//             <label htmlFor="">Short Description</label>
//             <textarea
//               name="shortDesc"
//               id=""
//               cols="30"
//               value={formData?.shortDesc}
//               rows="10"
//               placeholder="Short description of your service"
//               onChange={handleFormChange}
//             ></textarea>
//             <label htmlFor="">Delivery Time(e.g. 3 days)</label>
//             <input
//               type="number"
//               name="deliveryTime"
//               value={formData?.deliveryTime}
//               min={1}
//               onChange={handleFormChange}
//             />
//             <label htmlFor="">Revisión Number</label>
//             <input
//               name="revision"
//               value={formData?.revision}
//               type="number"
//               min={1}
//               onChange={handleFormChange}
//             />
//             <label htmlFor="">Add Features</label>
//             <form action="" className="add" onSubmit={handleFeature}>
//               <input type="text" placeholder="e.g. page design" />
//               <button type="submit">Add</button>
//             </form>
//             <div className="addedFeatures">
//               {state?.features?.map((f) => (
//                 <div className="item" key={f}>
//                   <button
//                     onClick={() =>
//                       dispatch({ type: "REMOVE_FEATURE", payload: f })
//                     }
//                   >
//                     {f}
//                     <span>X</span>
//                   </button>{" "}
//                 </div>
//               ))}
//             </div>
//             <label htmlFor="">Price</label>
//             <input
//               type="number"
//               min={1}
//               onChange={handleFormChange}
//               name="price"
//               value={formData?.price}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditarGig;
