import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState({
        gameId: null,
        role: null, // 'defuser' or 'manual'
        partnerId: null,
        timeRemaining: 300, // 5 minutes in seconds
        modules: [],
        solved: 0,
        strikes: 0,
        gameOver: false,
        winner: false,
    });
    const [chatMessages, setChatMessages] = useState([]);
    const [connectedToServer, setConnectedToServer] = useState(false);

    // Connect to the server
    useEffect(() => {
        // Use the local network IP where your server is running
        const newSocket = io('http://192.168.x.x:3001'); // Replace with your actual IP

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setConnectedToServer(true);
            setSocket(newSocket);
        });

        newSocket.on('gameState', (newState) => {
            setGameState(prevState => ({ ...prevState, ...newState }));
        });

        newSocket.on('chatMessage', (message) => {
            setChatMessages(prev => [...prev, message]);
        });

        newSocket.on('disconnect', () => {
            setConnectedToServer(false);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const joinGame = (gameId, role) => {
        if (socket) {
            socket.emit('joinGame', { gameId, role });
        }
    };

    const sendChatMessage = (message) => {
        if (socket) {
            socket.emit('chatMessage', {
                gameId: gameState.gameId,
                sender: gameState.role,
                content: message,
                timestamp: new Date().toISOString()
            });
        }
    };

    const solveModule = (moduleId) => {
        if (socket) {
            socket.emit('solveModule', { gameId: gameState.gameId, moduleId });
        }
    };

    const addStrike = () => {
        if (socket) {
            socket.emit('addStrike', { gameId: gameState.gameId });
        }
    };

    return (
        <GameContext.Provider value={{
            gameState,
            chatMessages,
            connectedToServer,
            joinGame,
            sendChatMessage,
            solveModule,
            addStrike
        }}>
            {children}
        </GameContext.Provider>
    );
};