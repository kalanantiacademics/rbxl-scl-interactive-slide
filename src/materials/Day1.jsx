import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Card, Spinner, Accordion, Form} from "react-bootstrap";
import Layout from "../components/Layout";


export default function Day1() {
  const [pages, setPages] = useState([]);
  const [details, setDetails] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const cleanAndParse = (raw, type = "array") => {
    if (!raw || typeof raw !== "string") return type === "array" ? [] : {};

    try {
      let clean = raw.replace(/""/g, '"').trim();
      clean = clean.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

      if (clean.startsWith('"') && clean.endsWith('"')) {
        clean = clean.substring(1, clean.length - 1);
      }

      return JSON.parse(clean);
    } catch (e) {
      console.error("Gagal parse JSON. Mencoba pembersihan tahap kedua...", e);
      try {
        const secondAttempt = raw.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
        return JSON.parse(secondAttempt);
      } catch (err) {
        return type === "array" ? [] : {};
      }
    }
  };

  const SHEET_CONFIG = {
    kamus_coder_page: { prop: "parsedKamus", type: "object" },
    interactive_checklist_page: { prop: "parsedChecklist", type: "array" },
    interactive_multiplechoice_question: { prop: "parsedQuiz", type: "array" },
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_APPS_SCRIPT_URL);
        const rawData = await response.json();
        console.log(rawData);
        const processSheet = (data) => {
          if (!data || data.length < 2) return [];
          const headers = data[0];
          return data.slice(1).map((row) => {
            let obj = {};
            row.forEach((cell, i) => {
              const key = headers[i].replace(/_([a-z])/g, (g) =>
                g[1].toUpperCase(),
              );
              obj[key] = cell;
            });
            return obj;
          });
        };

        const masterMap = {};

        Object.keys(rawData).forEach((sheetName) => {
          if (sheetName === "roblox_page" || sheetName === "roblox_main") return;

          const rows = processSheet(rawData[sheetName]);
          const config = SHEET_CONFIG[sheetName];

          rows.forEach((item) => {
            const pageId = item.robloxPageId;
            if (!pageId) return;


            if (config) {
              item[config.prop] = cleanAndParse(item.contentJson, config.type);
            }


            masterMap[pageId] = { ...masterMap[pageId], ...item };
          });
        });

        const sequence = processSheet(rawData.roblox_page);
        setPages(
          sequence
            .filter((p) => p.robloxMainId === "RBXL_1")
            .sort((a, b) => a.robloxPageOrder - b.robloxPageOrder),
        );
        
        setDetails(masterMap);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    loadData();
  }, []);

  if (loading)
    return (
      <Layout title="Day 1 - Introduction and Building with Parts">
        <div className="d-flex flex-column justify-content-between h-100 w-100">
          <div
            className="flex-grow-1 p-4 d-flex flex-column"
            style={{
              minHeight: "600px",
              maxHeight: "600px",
              overflowY: "auto",
              backgroundColor: "#0b0e18",
            }}
          >
            <div className="text-center p-5">
              <Spinner animation="border" variant="warning" />
              <div className="text-warning fw-bold mt-2">
                Loading Lessons...
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );

  const activePage = pages[currentIndex];
  const activeDetail = details[activePage?.robloxPageId];

  return (
    <Layout title="Day 1 - Introduction and Building with Parts">
      <div className="d-flex flex-column justify-content-between h-100 w-100">
        <div
          className="flex-grow-1 p-4 d-flex flex-column overflow-auto"
          style={{
            minHeight: "600px",
            maxHeight: "600px",
            overflowY: "auto",
            backgroundColor: "#0b0e18",
          }}
        >
          <div className="flex-grow-1">
            {activePage?.robloxPageType === "title" && (
              <div className="text-center d-flex flex-column justify-content-center align-items-center h-100">
                <h1 className="text-light fw-bold mb-2">
                  {activeDetail?.robloxPageTitle}
                </h1>
                <h3 className="text-warning mb-4">
                  {activeDetail?.robloxPageSubtitle}
                </h3>
                <div
                  className="rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25"
                  style={{ width: "60%", height: "350px" }}
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
              <div className="row align-items-center h-100">
                <div className="col-md-6 text-start p-4">
                  <h1 className="text-warning mb-4">{activeDetail?.title}</h1>
                  <p className="h4 text-light lh-base">
                    {activeDetail?.contentText}
                  </p>
                </div>
                <div className="col-md-6 text-center">
                  {activeDetail?.imageUrl && (
                    <div className="rounded-4 overflow-hidden shadow-lg border border-warning border-opacity-25">
                      <img
                        src={activeDetail?.imageUrl}
                        alt="Material Illustration"
                        className="img-fluid"
                        style={{ maxHeight: "450px" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePage?.robloxPageType === "slide" && (
              <div className="text-center d-flex flex-column justify-content-center align-items-center h-100 w-100">
                <div className="h-100 w-100">
                  <iframe
                    src={activeDetail?.contentUrl}
                    title="Google Slide"
                    frameBorder="0"
                    allowFullScreen={true}
                    style={{ height: "100%", width: "100%" }}
                  ></iframe>
                </div>
              </div>
            )}

            {activePage?.robloxPageType === "kamus_coder" && (
              <div className="text-start p-2 animate__animated animate__fadeIn">
                <div className="mb-4 border-start border-warning border-4 ps-3">
                  <h2 className="h1 text-warning fw-bold mb-1">
                    {activeDetail?.title || "KAMUS CODER"}
                  </h2>
                  {activeDetail?.subtitle && (
                    <p className="h5 text-secondary italic">
                      {activeDetail?.subtitle}
                    </p>
                  )}
                </div>
                <div className="row g-4 align-items-start">
                  <div
                    className={activeDetail?.imageUrl ? "col-md-7" : "col-12"}
                  >
                    <div className="d-flex flex-column gap-3">
                      {activeDetail?.parsedKamus &&
                        Object.entries(activeDetail.parsedKamus).map(
                          ([term, definition], index) => (
                            <div
                              key={index}
                              className="p-3 rounded-3 bg-black border border-warning border-opacity-10 shadow-sm"
                              style={{ borderLeft: "4px solid #f6a03a" }}
                            >
                              <h4 className="text-warning mb-1 d-flex align-items-center fw-bold">
                                {/* <span className="badge bg-warning text-dark me-2" style={{ fontSize: "0.7rem" }}>CODE</span> */}
                                {term}
                              </h4>
                              <p className="text-light mb-0 opacity-75 fs-5">
                                {definition}
                              </p>
                            </div>
                          ),
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage?.robloxPageType === "interactive_checklist" && (
              <div className="text-start p-2 animate__animated animate__fadeIn">
                <div className="mb-4 border-start border-warning border-4 ps-3">
                  <h2 className="text-warning fw-bold mb-1">
                    {activeDetail?.title || "MISSION CHECKLIST"}
                  </h2>
                  <p className="text-secondary">{activeDetail?.subtitle}</p>
                </div>
                <Accordion className="custom-accordion">
                  {Array.isArray(activeDetail?.parsedChecklist) &&
                    activeDetail.parsedChecklist.map((item, index) => (
                      <Accordion.Item
                        eventKey={index.toString()}
                        key={index}
                        className="mb-3 rounded-3 overflow-hidden border-warning border-opacity-25"
                      >
                        <Accordion.Header>
                          <div className="d-flex align-items-center w-100">
                            <Form.Check
                              type="checkbox"
                              className="me-3 custom-checkbox"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-light">{item.task}</span>
                          </div>
                        </Accordion.Header>

                        <Accordion.Body className="border-top border-warning border-opacity-10">
                          <div className="d-flex flex-column gap-3">
                            {item.taskImage && (
                              <div
                                className="rounded-3 overflow-hidden border border-secondary border-opacity-25 mb-2"
                                style={{ maxWidth: "300px" }}
                              >
                                <img
                                  src={item.taskImage}
                                  alt={item.task}
                                  className="img-fluid"
                                />
                              </div>
                            )}
                            <ul className="mb-0 opacity-75 fs-5">
                              {item.steps?.map((step, sIdx) => (
                                <li key={sIdx} className="text-light">
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                </Accordion>
              </div>
            )}

            {activePage?.robloxPageType ===
              "interactive_multiplechoice_question" && (
              <div className="text-start p-2 animate__animated animate__fadeIn">
                <div className="mb-4 border-start border-warning border-4 ps-3">
                  <h2 className="h1 text-warning fw-bold mb-1">
                    {activeDetail?.title || "Question Time!"}
                  </h2>
                  <p className="text-secondary">{activeDetail?.subtitle}</p>
                </div>
                <div className="d-flex flex-column gap-4">
                  {Array.isArray(activeDetail?.parsedQuiz) &&
                  activeDetail.parsedQuiz.length > 0 ? (
                    activeDetail.parsedQuiz.map((q, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-4 bg-black border border-warning border-opacity-10 shadow-sm"
                      >
                        <h4 className="text-light mb-4 d-flex align-items-start">
                          <span className="text-warning me-3 fw-bold">
                            {i + 1}.
                          </span>
                          {q.question}
                        </h4>
                        <div className="row g-3">
                          {q.options?.map((opt, oi) => (
                            <div className="col-md-6" key={oi}>
                              <Button
                                variant="outline-warning"
                                className="w-100 text-start p-3 opacity-75 quiz-opt-btn"
                                onClick={() =>
                                  alert(
                                    opt === q.answer
                                      ? "Correct! 🎉"
                                      : "Try again! ❌",
                                  )
                                }
                              >
                                <span className="fw-bold me-2">
                                  {String.fromCharCode(65 + oi)}.
                                </span>{" "}
                                {opt}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-5 text-secondary border border-dashed border-secondary rounded-4">
                      Loading mission questions...
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePage?.robloxPageType === "interactive_submit_form" && (
              <div className="text-start p-2 animate__animated animate__fadeIn">
                <div className="mb-4 border-start border-warning border-4 ps-3">
                  <h2 className="h1 text-warning fw-bold mb-1">
                    {activeDetail?.title}
                  </h2>
                  {activeDetail?.subtitle && (
                    <p className="h5 text-secondary">
                      {activeDetail?.subtitle}
                    </p>
                  )}
                </div>
                <div className="row g-4">
                  <div className="col-md-5">
                    <p
                      className="fs-5 text-light opacity-75 lh-base"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {activeDetail?.contentText}
                    </p>
                    <Button
                      variant="warning"
                      href={activeDetail?.formUrl}
                      target="_blank"
                      className="fw-bold px-4 py-2 mt-3"
                    >
                      OPEN FORM IN NEW TAB ↗
                    </Button>
                  </div>
                  <div className="col-md-7">
                    <div
                      className="rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25 bg-light"
                      style={{
                        height: "300px",
                        position: "relative",
                      }}
                    >
                      <iframe
                        src={activeDetail?.embedUrl}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                        title="Submission Form"
                      >
                        Loading…
                      </iframe>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="p-2 d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25"
          style={{
            backgroundColor: "#0b0e18",
            boxShadow: "0 -10px 30px rgba(246, 160, 58, 0.1)",
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
                    onClick={() => setCurrentIndex(index)}
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