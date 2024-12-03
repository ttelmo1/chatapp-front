import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import connectToSignalR from '../services/signalr';
import api from '../services/api';

const ChatPage = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);


    const fetchInitialMessages = async () => {
      try {
          const response = await api.get(`/chat/rooms/${roomId}/messages`);
          if (!response.status === 200) {
              throw new Error(`Failed to fetch messages: ${response.statusText}`);
          }
          const data = await response.data;
          setMessages(
              data.map(msg => ({
                  username: msg.userId,
                  text: msg.content,
                  timestamp: new Date(msg.timestamp)
              }))
          );
      } catch (error) {
          console.error('Error fetching initial messages:', error);
      } finally {
          setLoading(false);
      }
  };
  
    const sendMessage = async () => {
      if (message.trim()) {
        const username = localStorage.getItem('username');
        const connection = await connectToSignalR();
        
        try {
          await connection.invoke("SendMessageToRoom", roomId, username, message);
          setMessage('');
        } catch (err) {
          console.error("Error sending message:", err);
        }
      }
    };

    const leaveRoom = async () => {
      const connection = await connectToSignalR();
      await connection.invoke("LeaveRoom", roomId);
      await connection.stop

      window.location.replace("/rooms");
    };
    

    useEffect(() => {
      fetchInitialMessages();
      const setupSignalRConnection = async () => {

          const connection = await connectToSignalR();
          await connection.invoke("JoinRoom", roomId);
          connection.on("ReceiveMessage", (userId, text, timestamp) => {
            setMessages(prev => [...prev.slice(-49), 
                { 
                    username: userId, 
                    text, 
                    timestamp: timestamp ? new Date(timestamp) : new Date() 
                }
            ]);
        });
          return connection;
      };
      
      const connectionPromise = setupSignalRConnection();
      return () => {
          connectionPromise.then(async connection => {
              await connection.stop();
          });
      };
  }, [roomId]);

  
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <header className="p-4 bg-gray-800 text-white flex justify-between">
          <span>Room ID: {roomId}</span>
          <button onClick={() => leaveRoom()} className="bg-red-500 p-2 rounded">
            Leave Room
          </button>
        </header>
        <div className="flex-1 p-4 overflow-y-scroll bg-white">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{msg.username}</strong>: {msg.text}{' '}
              <span className="text-sm text-gray-500">
                -- {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
        <footer className="p-4 bg-gray-200 flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
            className="flex-1 border p-2 mr-2 rounded"
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">
            Send
          </button>
        </footer>
      </div>
    );
  };

export default ChatPage;
  