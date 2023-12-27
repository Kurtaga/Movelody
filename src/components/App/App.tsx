import Visualizer from "../Visualizer/Visualizer";
import "./App.css";
import Header from "../Header/Header";
import { AppProvider } from "../AppProvider/AppProvider";
// import Logs from "../Logs/Logs";
import Footer from "../Footer/Footer";
import HandTracking from "../HandTracking/HandTracking";
import Loading from "../Loading/Loading";
// import Gestures from "../Gestures/Gestures";
import SampleSynthesizer from "../SampleSynthesizer/SampleSynthesizer";
// import Gestures from "../Gestures/Gestures";
import { GameStateEnum } from "../AppContext/AppContext";

const App = () => {
  return (
    <AppProvider>
      <Loading type={GameStateEnum.LOADING} />
      <div className="app-container">
        <div className="app-padding">
          <Header />
          <div className="app-middle">
            <SampleSynthesizer />
            <Visualizer />
            {/* <div
              className="webcam-gestures"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                gap: "0px",
              }}
            > */}
            <HandTracking />
            {/* </div> */}
            {/* <Logs /> */}
          </div>
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default App;
