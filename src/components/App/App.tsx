import Visualizer from "../Visualizer/Visualizer";
import Synthesizer from "../Synthesizer/Synthesizer";
import "./App.css";
import Header from "../Header/Header";
import { AppProvider } from "../AppProvider/AppProvider";
import Logs from "../Logs/Logs";
import Footer from "../Footer/Footer";
import HandTracking from "../HandTracking/HandTracking";
import Loading from "../Loading/Loading";

const App = () => {
  return (
    <AppProvider>
      <Loading />
      <div className="app-container">
        <div className="app-padding">
          <Header />
          <div className="app-middle">
            <Synthesizer />
            <Visualizer />
            <HandTracking />
            <Logs />
          </div>
        </div>

        <Footer />
      </div>
    </AppProvider>
  );
};

export default App;
