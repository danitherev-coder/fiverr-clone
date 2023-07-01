import axios from "axios";

// esta funcion estaba en mi page de Register, pero lo movi aca para que se pueda utilizar en otras partes para subir una imagen
const upload = async (file) => {

    if (!file) return null // si no hay file, retornamos null para que no nos de error si el usuario no quiere subir una imagen de perfil


    const data = new FormData();

    data.append("file", file); // aca pasamos el file que tenemos arriba en nuestro estado(useState)
    data.append("upload_preset", "fiverr"); // aca ponemos el nombre de nuestro preset que creamos en cloudinary y el nombre de ese preset, recordar que al folder tambien puse de nombre fiverr

    try {
        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dpyr2wyaf/image/upload",
            data
        );

        // cuando cloudinary nos responda, vamos a retornar la url de la imagen que subimos, puedo hacer un console.log(res) para ver que nos responde cloudinary y de ahi saco la URL para poder retornarla y enviarlo a mi servidor para que guarde esa url en mi base de datos

        console.log(res, 'que sale en res ptmre');
        const { public_id } = res.data;

        return public_id

    } catch (error) {
        console.log(error);
    }
};

export default upload;