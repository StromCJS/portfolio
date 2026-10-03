import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import MainContainer from "./components/MainContainer";
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <LoadingProvider>
      <MainContainer />
      <Analytics />
    </LoadingProvider>
  );
};

export default App;
