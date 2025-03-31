// src/components/DefuserView.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import Timer from './Timer';
import ChatBox from './ChatBox';
import BombModule from './BombModule';

const DefuserView = () => {
    const { gameId } = useParams();
    const { gameState } = useGame();

    if (gameState.gameOver) {
        return (
            <div className="game-over">
                <h2>{gameState.winner ? 'Bomb Defused!' : 'BOOM! Game Over'}</h2>
                <p>Return to <a href="/">lobby</a> for a new game.</p>
            </div>
        );
    }

    return (
        <div className="defuser-container">
            <div className="game-header">
                <h2>Defuser View - Game {gameId}</h2>
                <div className="status-bar">
                    <Timer />
                    <div className="strikes">
                        Strikes: {Array(gameState.strikes).fill('X').join('')}
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="bomb-container">
                    {gameState.modules.map(module => (
                        <BombModule
                            key={module.id}
                            module={module}
                        />
                    ))}
                </div>

                <ChatBox />
            </div>
        </div>
    );
};

export default DefuserView;