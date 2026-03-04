import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function TitleCard({ title, description, roblox_main_id }) {
  const navigate = useNavigate();
  const handleStartMission = () => {
    navigate(`/lesson/${roblox_main_id}`);
  };

  return (
    <Card
      onClick={handleStartMission}
      style={{ 
        width: '20rem', 
        cursor: 'pointer',
        backgroundColor: "#131a36", 
        minHeight: '10rem',
        maxHeight: '10rem',
        border: '2px solid transparent',
        transition: 'all 0.3s ease'
      }}
      className="shadow-sm rounded-4 overflow-hidden m-2 border-0 h-100 custom-card-hover"
    >
      <Card.Body className="d-flex flex-column text-start p-0">
        <Card.Title className="text-warning">{title}</Card.Title>
        <Card.Text className="text-light flex-grow-1">
          Start Mission→
        </Card.Text>
      </Card.Body>
    </Card>
  );
}