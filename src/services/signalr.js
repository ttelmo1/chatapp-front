import * as signalR from '@microsoft/signalr';

const connectToSignalR = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token not found');
  }

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`http://localhost:5125/chathub?access_token=${token}`)
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
  } catch (error) {
    console.error('SignalR Connection Error:', error);
  }

  return connection;
};

export default connectToSignalR;
