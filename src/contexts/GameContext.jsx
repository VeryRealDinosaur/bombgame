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
        // Use the server URL from environment or fallback to localhost
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
        const newSocket = io(serverUrl);

        // Debug connection issues
        console.log('Attempting to connect to server...');

        newSocket.on('connect', () => {
            console.log('Connected to server with ID:', newSocket.id);
            setConnectedToServer(true);
            setSocket(newSocket);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setConnectedToServer(false);
        });

        newSocket.on('gameState', (newState) => {
            console.log('Received game state update:', newState);
            setGameState(prevState => {
                // Only update if this is for our game
                if (newState.gameId !== prevState.gameId) {
                    return prevState;
                }

                // Handle different types of updates
                if (newState.type === 'timerUpdate') {
                    // For timer updates, only update the time
                    return {
                        ...prevState,
                        timeRemaining: newState.timeRemaining
                    };
                } else if (newState.type === 'fullUpdate') {
                    // For full updates, update everything except the timer
                    return {
                        ...prevState,
                        ...newState,
                        timeRemaining: prevState.timeRemaining // Preserve current timer
                    };
                }
                
                // Default case: merge all updates
                return { ...prevState, ...newState };
            });
        });

        newSocket.on('chatMessage', (message) => {
            console.log('Received chat message:', message);
            setChatMessages(prev => [...prev, message]);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setConnectedToServer(false);
        });

        return () => {
            console.log('Cleaning up socket connection');
            newSocket.disconnect();
        };
    }, []);

    const joinGame = (gameId, role) => {
        if (socket) {
            console.log(`Joining game ${gameId} as ${role}`);
            socket.emit('joinGame', { gameId, role });

            // Initialize local state for this game
            setGameState(prev => ({
                ...prev,
                gameId,
                role
            }));

            // Clear previous chat messages when joining a new game
            setChatMessages([]);
        } else {
            console.error('Cannot join game: socket not connected');
        }
    };

    const sendChatMessage = (content) => {
        if (socket && gameState.gameId) {
            const message = {
                gameId: gameState.gameId,
                sender: gameState.role,
                content,
                timestamp: new Date().toISOString()
            };
            console.log('Sending chat message:', message);
            socket.emit('chatMessage', message);

            // Don't add to local state yet - wait for server to broadcast it back
            // This ensures consistent ordering of messages
        } else {
            console.error('Cannot send message: socket not connected or game not joined');
        }
    };

    const solveModule = (moduleId) => {
        if (socket && gameState.gameId) {
            console.log(`Attempting to solve module ${moduleId}`);
            socket.emit('solveModule', { gameId: gameState.gameId, moduleId });
        } else {
            console.error('Cannot solve module: socket not connected or game not joined');
        }
    };

    const addStrike = () => {
        if (socket && gameState.gameId) {
            console.log('Adding strike');
            socket.emit('addStrike', { gameId: gameState.gameId });
        } else {
            console.error('Cannot add strike: socket not connected or game not joined');
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