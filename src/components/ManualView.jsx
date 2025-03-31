// src/components/ManualView.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import Timer from './Timer';
import ChatBox from './ChatBox';

const ManualView = () => {
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

    // This is a simplified view showing static manual content
    // In a full implementation, you would have different manual sections
    return (
        <div className="manual-container">
            <div className="game-header">
                <h2>Manual Reader - Game {gameId}</h2>
                <Timer />
            </div>

            <div className="main-content">
                <div className="manual-content">
                    <div className="manual-section">
                        <h3>Wire Module Instructions</h3>
                        <p>If there are no red wires, cut the second wire.</p>
                        <p>Otherwise, if the last wire is white, cut the last wire.</p>
                        <p>Otherwise, if there is more than one blue wire, cut the last blue wire.</p>
                        <p>Otherwise, cut the last wire.</p>
                    </div>

                    <div className="manual-section">
                        <h3>Button Module Instructions</h3>
                        <p>If the button is blue, hold the button and release when the countdown has a 4 in any position.</p>
                        <p>If the button is red, press and immediately release.</p>
                        <p>If the button is yellow, hold the button and release when the countdown has a 5 in any position.</p>
                    </div>

                    <div className="manual-section">
                        <h3>Keypad Module Instructions</h3>
                        <p>Press the symbols in order from top to bottom as they appear in these sequences:</p>
                        <p>Sequence 1: Ϙ, ϗ, Ͽ, ϡ, Ͼ, Ϟ</p>
                        <p>Sequence 2: Ϟ, ϗ, Ϛ, ϡ, Ͽ, Ͼ</p>
                        <p>Sequence 3: Ϛ, Ͼ, Ϟ, ϡ, ϗ, Ϙ</p>
                    </div>
                </div>

                <ChatBox />
            </div>
        </div>
    );
};

export default ManualView;