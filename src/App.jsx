import { useState } from "react";
import SplashScreen from "./components/SplashScreen";

function WelcomePage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080b20",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1>Welcome to Dudu HR</h1>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
        />
      ) : (
        <WelcomePage />
      )}
    </>
  );
}

export default App;