import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await api.get('/chat/rooms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(response.data);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
      window.location.replace("/");
    }
  };

  const createRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/chat/rooms', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/chat/${response.data}`);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const Logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.replace("/");
  }


  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-96 bg-white p-4 shadow-md rounded">
        <h1 className="text-2xl font-semibold mb-4 text-center">Rooms</h1>
        <ul className="mb-4">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="p-2 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/chat/${room.id}`)}
            >
              {room.name || `Room ${room.id}`}
            </li>
          ))}
        </ul>
        <button
          onClick={createRoom}
          className="bg-green-500 text-white p-2 w-full rounded hover:bg-green-600"
        >
          Create Room
        </button>
        <button
          onClick={Logout}
          className="bg-green-500 text-white p-2 w-full rounded hover:bg-green-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default RoomPage;
