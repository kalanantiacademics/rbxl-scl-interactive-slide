import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Container, Card } from 'react-bootstrap';

export default function LessonView() {
  const { unitId } = useParams(); // Gets "RBXL_1" from the URL
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with your Sheety URL for the 'roblox_page' tab
    const PAGES_URL = import.meta.env.VITE_SHEETY_PAGES_URL;

    fetch(PAGES_URL)
      .then(res => res.json())
      .then(data => {
        const allPages = Object.values(data)[0];
        // Filter pages that match the Day we clicked (e.g., RBXL_1)
        const dayPages = allPages
          .filter(p => p.robloxMainId === unitId)
          .sort((a, b) => a.robloxPageOrder - b.robloxPageOrder);
        
        setPages(dayPages);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [unitId]);

  const activePage = pages[currentPage];

  if (loading) return <Container className="p-5 text-center">Loading Lesson...</Container>;

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" onClick={() => navigate('/')} className="mb-4">
        ← Back to Menu
      </Button>

      <Card className="shadow-lg border-primary border-3 rounded-4">
        <Card.Header className="bg-primary text-white p-3">
          <h2 className="mb-0 text-center">Day {unitId.split('_')[1]}</h2>
        </Card.Header>
        <Card.Body style={{ minHeight: '500px' }} className="d-flex flex-column justify-content-center text-center">
          {activePage ? (
            <div>
              <h1 className="display-4 fw-bold">{activePage.robloxPageType.toUpperCase()}</h1>
              <p className="lead">{activePage.description || "Follow the instructions below"}</p>
              {activePage.robloxPageType === 'slide' && (
                <div className="ratio ratio-16x9 mt-4">
                  <iframe src="YOUR_CANVA_OR_GOOGLE_URL" title="slide"></iframe>
                </div>
              )}
            </div>
          ) : (
            <p>No content found for this slide.</p>
          )}
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between align-items-center bg-white p-3">
          <Button 
            disabled={currentPage === 0} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          >Previous</Button>

          <span className="fw-bold">Step {currentPage + 1} of {pages.length}</span>

          <Button 
            disabled={currentPage === pages.length - 1} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          >Next</Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}