import "./App.css";
import MainContainer from "./components/MainContainer";
import { LoadingProvider } from "./context/LoadingProvider";
import { SpeedInsights } from "@vercel/speed-insights/react";

const App = () => {
  return (
    <LoadingProvider>
      <MainContainer />
      <SpeedInsights />
    </LoadingProvider>
  );
};

export default App;
