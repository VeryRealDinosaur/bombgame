// src/components/GameLobby.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

const GameLobby = () => {
    const [gameId, setGameId] = useState('');
    const [role, setRole] = useState('');
    const { joinGame, connectedToServer } = useGame();
    const navigate = useNavigate();

    const handleJoin = (e) => {
        e.preventDefault();
        if (gameId && role) {
            joinGame(gameId, role);
            navigate(`/${role}/${gameId}`);
        }
    };

    if (!connectedToServer) {
        return <div className="lobby">Connecting to server...</div>;
    }

    return (
        <div className="lobby">
            <h1>Keep Talking Clone</h1>
            <form onSubmit={handleJoin}>
                <div>
                    <label>
                        Game ID:
                        <input
                            type="text"
                            value={gameId}
                            onChange={(e) => setGameId(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Role:
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="">Select a role</option>
                            <option value="defuser">Defuser</option>
                            <option value="manual">Manual Reader</option>
                        </select>
                    </label>
                </div>
                <button type="submit">Join Game</button>
            </form>
        </div>
    );
};

export default GameLobby;