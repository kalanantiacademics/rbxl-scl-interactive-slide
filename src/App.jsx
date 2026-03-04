import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import TitleCard from "./components/TitleCard";
import { Spinner } from "react-bootstrap";

function App() {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

  const fetchMissions = async () => {
    try {
      const response = await fetch(APPS_SCRIPT_URL);
      const rawData = await response.json();

      const mainSheet = rawData.roblox_main;
      if (mainSheet && mainSheet.length > 0) {
        const headers = mainSheet[0];
        const formattedMissions = mainSheet.slice(1).map((row) => {
          let obj = {};
          row.forEach((cell, i) => {
            const key = headers[i].replace(/_([a-z])/g, (g) =>
              g[1].toUpperCase(),
            );
            obj[key] = cell;
          });
          return obj;
        });

        setMissions(formattedMissions);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching missions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  return (
    <Layout title="ROBLOX STUDIO">
      <div className="d-flex flex-wrap justify-content-center gap-3">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="warning" />
            <div className="text-warning fw-bold mt-2">Loading Lessons...</div>
          </div>
        ) : (
          missions.map((item, index) => (
            <TitleCard
              key={index}
              title={item.title}
              description={item.description || "Learn to build in Roblox!"}
              robloxMainId={item.robloxMainId} 
            />
          ))
        )}
      </div>
    </Layout>
  );
}

export default App;