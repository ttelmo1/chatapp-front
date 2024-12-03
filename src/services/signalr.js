import * as signalR from '@microsoft/signalr';

// const connectToSignalR = async () => {
//   const connection = new signalR.HubConnectionBuilder()
//     .withUrl('http://localhost:5125/chathub', 
//       {
//         accessTokenFactory: async () => {
//           const token = localStorage.getItem('token');
//           if (!token) {
//             throw new Error('Token not found');
//           }
//           return token
//       }
//     })
//     .withAutomaticReconnect()
//     .build();

//   try {
//     await connection.start();
//     console.log('Connected to SignalR');
//   } catch (error) {
//     console.error('SignalR Connection Error:', error);
//   }

//   return connection;
// };


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
    console.log('Connected to SignalR');
  } catch (error) {
    console.error('SignalR Connection Error:', error);
  }

  return connection;
};

export default connectToSignalR;
