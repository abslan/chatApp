import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";


import './App.css';
import Page404 from "./pages/misc/Page404";
import Nav from "./pages/app/Nav";
import UserChats from "./pages/user/UserChats";
import ErrorBoundary from "./components/Common/ErrorBoundary";

// const basename = process.env.NODE_ENV === 'production'
//   ? process.env.PUBLIC_URL
//   : '';

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "/chatApp",
      element: <ErrorBoundary><Nav /></ErrorBoundary>,
      errorElement: <Page404 />,
      children: [{ 
        index: true,
        element: <UserChats/>
      }]
    }, {
  path: "/",
  loader: () => {
    window.location.replace("/chatApp");
    return null;
    }
  },
  ]);

  return (
    <div id="App" className="dark_theme">
      <Provider store={store}>
        <RouterProvider router={browserRouter} />
      </Provider>
    </div>
  );
}

export default App;
