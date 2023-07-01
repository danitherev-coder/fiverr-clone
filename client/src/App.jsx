import React, { Suspense, lazy, memo } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Navbar from "./components/navbar/Navbar";
const Navbar = lazy(() => import("./components/navbar/Navbar"));
// import Footer from "./components/footer/Footer";
const Footer = lazy(() => import("./components/footer/Footer"));
// import NotFound from "./pages/404/NotFound";
const NotFound = lazy(() => import("./pages/404/NotFound"));
import "./app.scss";
// import EditarPerfil from "./pages/EditarPerfil/EditarPerfil";
const EditarPerfil = lazy(() => import("./pages/EditarPerfil/EditarPerfil"));
const EditarGig = lazy(() => import("./pages/EditarGig/EditarGig"));
// import ConfirmarEmail from "./pages/ConfirmarEmail/ConfirmarEmail";
// import ConfirmarTokenPassword from "./pages/ConfirmarTokenPassword/ConfirmarTokenPassword";
// import RestablecerPassword from "./pages/RestablecerPassword/RestablecerPassword";

const ConfirmarEmail = lazy(() =>
  import("./pages/ConfirmarEmail/ConfirmarEmail")
);
const ConfirmarTokenPassword = lazy(() =>
  import("./pages/ConfirmarTokenPassword/ConfirmarTokenPassword")
);
const RestablecerPassword = lazy(() =>
  import("./pages/RestablecerPassword/RestablecerPassword")
);
// import Home from "./pages/home/Home";
// import Gigs from "./pages/gigs/Gigs";
// import MyGigs from "./pages/myGigs/MyGigs";
// import Gig from "./pages/gig/Gig";
// import Orders from "./pages/orders/Orders";
// import Add from "./pages/add/Add";
// import Messages from "./pages/messages/Messages";
// import Message from "./pages/message/Message";
// import Login from "./pages/login/Login";
// import Register from "./pages/register/Register";
// import Pay from "./pages/pay/Pay";
// import Success from "./pages/Success/Success";
// import Wishlist from "./pages/wishList/Wishlist";

const Home = lazy(() => import("./pages/home/Home"));
const Gigs = lazy(() => import("./pages/gigs/Gigs"));
const Gig = lazy(() => import("./pages/gig/Gig"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const MyGigs = lazy(() => import("./pages/myGigs/MyGigs"));
const Add = lazy(() => import("./pages/add/Add"));
const Messages = lazy(() => import("./pages/messages/Messages"));
const Message = lazy(() => import("./pages/message/Message"));
const Login = lazy(() => import("./pages/login/Login"));
const ForgotPassword = lazy(() =>
  import("./pages/ForgotPassword/ForgotPassword")
);
const Register = lazy(() => import("./pages/register/Register"));
const Pay = lazy(() => import("./pages/pay/Pay"));
const Success = lazy(() => import("./pages/Success/Success"));
const Wishlist = lazy(() => import("./pages/wishList/Wishlist"));

const MemoizedNavbar = memo(() => (
  <Suspense fallback={<div>Loading...</div>}>
    <Navbar />
  </Suspense>
));
MemoizedNavbar.displayName = "Navbar";

const MemoizedFooter = memo(() => (
  <Suspense fallback={<div>Loading...</div>}>
    <Footer />
  </Suspense>
));
MemoizedFooter.displayName = "Footer";

const MemoizedNotFound = memo(() => (
  <Suspense fallback={<div>Loading...</div>}>
    <NotFound />
  </Suspense>
));
MemoizedNotFound.displayName = "NotFound";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="app">
          <QueryClientProvider client={queryClient}>
            <MemoizedNavbar />
            <Outlet />
            <MemoizedFooter />
            <ToastContainer position="bottom-left" />
          </QueryClientProvider>
        </div>
      </Suspense>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/mygigs",
          element: <MyGigs />,
        },
        {
          path: "/editar-gig/:id",
          element: <EditarGig />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/editar-perfil/:id",
          element: <EditarPerfil />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/confirmar-email/:token",
          element: <ConfirmarEmail />,
        },
        {
          path: "/olvide-password",
          element: <ForgotPassword />,
        },
        {
          path: "/olvide-password/:token",
          element: <ConfirmarTokenPassword />,
        },
        {
          path: "/restablecer-password/:token",
          element: <RestablecerPassword />,
        },
        {
          path: "/pay/:id",
          element: <Pay />,
        },
        {
          path: "/success",
          element: <Success />,
        },
        {
          path: "/wishlist",
          element: <Wishlist />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
    {
      path: "/message/:id",
      element: (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div>Loading...</div>}>
            <Message />
          </Suspense>
        </QueryClientProvider>
      ),
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
