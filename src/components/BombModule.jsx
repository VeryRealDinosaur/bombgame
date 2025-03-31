// src/components/BombModule.jsx
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';

const BombModule = ({ module }) => {
    const { solveModule, addStrike } = useGame();
    const [attempt, setAttempt] = useState('');

    const handleSolve = () => {
        if (module.solved) return;

        // This is a simple simulation - in reality, each module would have its own solving logic
        if (attempt === module.solution) {
            solveModule(module.id);
        } else {
            addStrike();
            setAttempt('');
        }
    };

    // Render different modules based on type
    const renderModuleContent = () => {
        switch (module.type) {
            case 'wires':
                return (
                    <div className="module-wires">
                        {module.wires.map((wire, idx) => (
                            <div
                                key={idx}
                                className={`wire ${wire.color} ${wire.cut ? 'cut' : ''}`}
                                onClick={() => !wire.cut && setAttempt(idx.toString())}
                            />
                        ))}
                    </div>
                );

            case 'button':
                return (
                    <div className="module-button">
                        <button
                            className={`big-button ${module.color}`}
                            onMouseDown={() => setAttempt('press')}
                            onMouseUp={() => setAttempt('release')}
                        >
                            {module.label}
                        </button>
                    </div>
                );

            case 'keypad':
                return (
                    <div className="module-keypad">
                        {module.symbols.map((symbol, idx) => (
                            <button
                                key={idx}
                                onClick={() => setAttempt(prev => prev + idx)}
                            >
                                {symbol}
                            </button>
                        ))}
                    </div>
                );

            default:
                return <div>Unknown module type</div>;
        }
    };

    return (
        <div className={`bomb-module ${module.solved ? 'solved' : ''}`}>
            <h3>{module.name}</h3>
            {renderModuleContent()}
            {!module.solved && (
                <button onClick={handleSolve} className="submit-btn">
                    Submit
                </button>
            )}
        </div>
    );
};

export default BombModule;