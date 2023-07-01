import React, { useEffect, useState } from "react";
import "./EditarPerfil.scss";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditarPerfil = () => {
  const { id } = useParams();

  const [file, setFile] = useState(null);
  const [userEdit, setUserEdit] = useState(null);
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await newRequest.get(`/api/user/${id}`);
        setUserEdit(res.data);
        setEditedUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeller = (e) => {
    const { checked } = e.target;
    if (!checked) {
      // Si el usuario desmarca la opción de ser vendedor, se debe reiniciar el valor del campo 'desc'
      setEditedUser((prev) => ({ ...prev, isSeller: false }));
    } else {
      setEditedUser((prev) => ({ ...prev, isSeller: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = await upload(file || null);
    try {
      const updatedUser = {
        username: editedUser.username || userEdit.username,
        email: editedUser.email || userEdit.email,
        password: editedUser.password || userEdit.password,
        img: url || userEdit.img,
        country: editedUser.country || userEdit.country,
        isSeller: editedUser.isSeller, // Cambiar aquí
        desc: editedUser.desc || userEdit.desc,
        phone: editedUser.phone || userEdit.phone,
        wishList: editedUser.wishList || userEdit.wishList,
      };

      const updatedUserEdit = { ...userEdit, ...updatedUser };

      await newRequest.put(`/api/user/editar-perfil/${id}`, updatedUserEdit);

      const storedCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (storedCurrentUser) {
        const updatedCurrentUser = {
          ...storedCurrentUser,
          user: {
            ...storedCurrentUser.user,
            img: url || storedCurrentUser.user.img,
            username: editedUser.username || storedCurrentUser.user.username,
            email: editedUser.email || storedCurrentUser.user.email,
            country: editedUser.country || storedCurrentUser.user.country,
            isSeller: editedUser.isSeller, // Cambiar aquí
            desc: editedUser.desc || storedCurrentUser.user.desc,
            phone: editedUser.phone || storedCurrentUser.user.phone,
            wishList: editedUser.wishList || storedCurrentUser.user.wishList,
          },
        };

        localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Update your Profile</h1>
          <label htmlFor="username">Username</label>
          <input
            name="username"
            type="text"
            value={editedUser?.username || ""}
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            value={editedUser?.email || ""}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input name="password" type="password" onChange={handleChange} />
          <label htmlFor="img">Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            name="img"
          />
          <label htmlFor="country">Country</label>
          <input
            name="country"
            type="text"
            value={editedUser?.country || ""}
            onChange={handleChange}
          />
          <button type="submit">Update</button>
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            {/* <label htmlFor="isSeller">Activate the seller account</label> */}
            <label htmlFor="isSeller">
              {editedUser?.isSeller
                ? "Deactivate being a seller"
                : "Activate to become a seller"}
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={editedUser?.isSeller || false}
                onChange={handleSeller}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <label htmlFor="phone">Phone Number</label>
          <input
            name="phone"
            type="text"
            value={editedUser?.phone || ""}
            onChange={handleChange}
          />
          <label htmlFor="desc">Description</label>
          <textarea
            name="desc"
            cols="30"
            rows="10"
            value={editedUser?.desc || ""}
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default EditarPerfil;
