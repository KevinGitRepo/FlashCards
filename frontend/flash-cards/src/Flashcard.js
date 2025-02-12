import React, {useState} from 'react';
import './Flashcard.css';

export function Flashcard(props){
    const [flipped, setFlipped] = useState(false);

    const handleOnClick = () => {
        setFlipped(!flipped);
    };

    return (
        <div className={`fc ${flipped ? 'flipped' : ''}`} onClick={handleOnClick}>
            <div className="fc-inner">
                <div className="fc-front">
                    <p>{props.Front}</p>
                </div>
                <div className="fc-back">
                    <p>{props.Back}</p>
                </div>
            </div>
        </div>
    );
};