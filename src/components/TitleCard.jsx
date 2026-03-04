import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function TitleCard({ title, description, robloxMainId }) {
  const navigate = useNavigate();
  const handleStartMission = () => {
    navigate(`/lesson/${robloxMainId}`);
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
      className="shadow-sm rounded-4 overflow-hidden m-1 border-0 h-100 custom-card-hover"
    >
      <Card.Body className="d-flex flex-column text-start p-0">
        <h6 className="text-warning">{title}</h6>
        <Card.Text className="text-light flex-grow-1">
          Start Mission→
        </Card.Text>
      </Card.Body>
    </Card>
  );
}