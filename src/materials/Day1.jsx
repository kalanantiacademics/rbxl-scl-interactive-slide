import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Card, Spinner } from "react-bootstrap";
import Layout from "../components/Layout";

export default function Day1() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [details, setDetails] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Define all your Sheety endpoints
    const ENDPOINTS = {
      sequence: import.meta.env.VITE_SHEETY_PAGES_URL,
      titles: import.meta.env.VITE_SHEETY_TITLE_PAGES_URL,
      materials: import.meta.env.VITE_SHEETY_MATERIAL_PAGES_URL,
      slides: import.meta.env.VITE_SHEETY_SLIDE_PAGES_URL,
    };

    const loadDay1 = async () => {
      try {
        const [resSeq, resTit, resMat, resSli] = await Promise.all([
          fetch(ENDPOINTS.sequence).then((r) => r.json()),
          fetch(ENDPOINTS.titles).then((r) => r.json()),
          fetch(ENDPOINTS.materials).then((r) => r.json()),
          fetch(ENDPOINTS.slides).then((r) => r.json()),
        ]);

        // Filter sequence for Day 1 only
        const day1Sequence = (resSeq.robloxPage || Object.values(resSeq)[0])
          .filter((p) => p.robloxMainId === "RBXL_1")
          .sort((a, b) => a.robloxPageOrder - b.robloxPageOrder);

        // Map all details into one searchable object by roblox_page_id
        const detailMap = {};
        [
          ...(resTit.titlePage || []),
          ...(resMat.materialPage || []),
          ...(resSli.slidePage || []),
        ].forEach((item) => {
          detailMap[item.robloxPageId] = item;
        });

        setPages(day1Sequence);
        setDetails(detailMap);
        setLoading(false);
      } catch (err) {
        console.error("Data Load Error:", err);
      }
    };

    loadDay1();
  }, []);

  if (loading)
    return (
      <Container className="p-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  const activePage = pages[currentIndex];
  const activeDetail = details[activePage?.robloxPageId];

  return (
    <Layout title="Day 1 - Introduction and Building with Parts">
      <div className="d-flex flex-column justify-content-between h-100 w-100">
        <div
          className="flex-grow-1 p-1 d-flex flex-column"
          style={{
            minHeight: "600px",
            maxHeight: "600px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div className="flex-grow-1 p-1">
            {activePage?.robloxPageType === "title" && (
              <div
                className="text-center d-flex flex-column justify-content-center align-items-center h-100 w-100"
                // style={{ border: "1px solid white" }}
              >
                {/* <small class="text-warning">{activeDetail?.featuredText}</small> */}
                <h1 className="h1 text-light">
                  {activeDetail?.robloxPageTitle}
                </h1>
                <h3 className="text-warning mb-4">
                  {activeDetail?.robloxPageSubtitle}
                </h3>
                <div
                  className="rounded-4 overflow-hidden shadow border border-secondary border-opacity-25"
                  style={{ width: "50%", height: "350px" }}
                >
                  <img
                    src={activeDetail?.imageUrl}
                    alt="Banner"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}

            {activePage?.robloxPageType === "material" && (
              <div
                className="text-center d-flex flex-column justify-content-center align-items-center h-100 w-100"
                // style={{ border: "1px solid white" }}
              >
                {/* <small class="text-warning">{activeDetail?.featuredText}</small> */}
                <h2 className="h1 text-warning">{activeDetail?.title}</h2>
                <p className="h5 text-light mb-4">
                  {activeDetail?.contentText}
                </p>
                {activeDetail?.imageUrl && (
                  <div
                    className="rounded-4 overflow-hidden shadow border border-secondary border-opacity-25"
                    style={{ width: "50%", height: "360px" }}
                  >
                    <img
                      src={activeDetail?.imageUrl}
                      alt="Banner"
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
            )}

            {activePage?.robloxPageType === "slide" && (
              <div
                className="text-center d-flex flex-column justify-content-center align-items-center h-100 w-100"
                // style={{ border: "1px solid white" }}
              >
                {/* <h2 className="h1 text-warning">{activeDetail?.title}</h2> */}
                <div className="h-100 w-100">
                  <iframe
                    src={activeDetail?.contentUrl}
                    title="Google Slide"
                    frameborder="0"
                    allowfullscreen="true"
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    style={{ height: "100%", width: "100%" }}
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="p-2 d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25"
          style={{
            backgroundColor: "#0b0e18", // Darker blue to match your reference
            boxShadow: "0 -10px 30px rgba(246, 160, 58, 0.1)", // Subtle bottom-to-top glow
          }}
        >
          <Button
            variant="outline-warning"
            size="sm"
            className="rounded-3 fw-bold px-4"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            ⬅️PREVIOUS
          </Button>

          <div
            className="text-center d-flex flex-column align-items-center"
            style={{ minWidth: "350px" }}
          >
            <div className="text-white fw-bold small tracking-wider mb-3">
              MISSION PROGRESS
            </div>

            <div className="d-flex align-items-center gap-2">
              {pages.map((_, index) => (
                <div key={index} className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all"
                    style={{
                      width: "25px",
                      height: "25px",
                      fontSize: "0.8rem",
                      border:
                        index <= currentIndex
                          ? "2px solid #f6a03a"
                          : "2px solid rgba(255,255,255,0.2)",
                      backgroundColor:
                        index === currentIndex ? "#f6a03a" : "transparent",
                      color:
                        index === currentIndex
                          ? "#0b0e18"
                          : index < currentIndex
                            ? "#f6a03a"
                            : "rgba(255,255,255,0.4)",
                      boxShadow:
                        index === currentIndex
                          ? "0 0 15px rgba(246, 160, 58, 0.5)"
                          : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => setCurrentIndex(index)} // Allows jumping to slides
                  >
                    {index + 1}
                  </div>

                  {index < pages.length - 1 && (
                    <div
                      className="ms-2 transition-all"
                      style={{
                        width: "15px",
                        height: "2px",
                        backgroundColor:
                          index < currentIndex
                            ? "#f6a03a"
                            : "rgba(255,255,255,0.1)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="warning"
            size="sm"
            className="rounded-3 fw-bold px-4 text-dark shadow-warning-btn"
            disabled={currentIndex === pages.length - 1}
            onClick={() => setCurrentIndex((i) => i + 1)}
          >
            {currentIndex === pages.length - 1 ? "FINISH🎉" : "NEXT STEP➡️"}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
