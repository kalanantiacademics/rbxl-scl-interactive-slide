import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import TitleCard from "./components/TitleCard";

function App() {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const sheetURL = import.meta.env.VITE_SHEETY_URL;

    fetch(sheetURL)
      .then((response) => response.json())
      .then((data) => {
        const sheetData = data.sheet1 || Object.values(data)[0];
        setMissions(sheetData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sheet:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
      console.log(missions);
    }, [missions]);

  return (
    <>
      <Layout title="ROBLOX STUDIO">
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {loading ? (
            <div className="text-primary fw-bold">Loading Lessons...</div>
          ) : (
            missions.map((item, index) => (
              <TitleCard
                key={index}
                title={item.title}
                description={item.description}
                roblox_main_id={item.robloxMainId || item.roblox_main_id}
              />
            ))
          )}
        </div>
      </Layout>
    </>
  );
}

export default App;
