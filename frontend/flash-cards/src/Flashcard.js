import React, {useState, useEffect} from 'react';
import './Flashcard.css';

export function Flashcard(props){
    const [flipped, setFlipped] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        setFlipped(false);
    }, [currentIndex]);

    const handleOnClick = () => {
        if (isFlipping) {
            return;
        }
        setFlipped(!flipped);
    };

    const changeCard = (direction) => {
        if (isFlipping) {
            return;
        }

        setIsFlipping(true);
        setFlipped(false);

        setTimeout(() => {
            switch(direction){
                case "forward":
                    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, props.cards.length - 1));
                    break;
                case "backward":
                    setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
                    break;
                default:
                    break;
            }
            setIsFlipping(false);
        }, 500);
    }

    const handleNextCard = () => {
        if (flipped) {
            changeCard("forward");
        } else {
            setCurrentIndex(prevIndex => Math.min(prevIndex + 1, props.cards.length - 1));
        }
        
    }

    const handlePrevCard = () => {
        if (flipped) {
            changeCard("backward");
        } else {
            setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
        }
        
    }

    return (
        <div>
            {(props.tableChosen && props.cards.length > 0) &&
                <div className={`fc ${flipped ? 'flipped' : ''}`} onClick={handleOnClick}>
                    <div className="fc-inner">
                        <div className="fc-front">
                            <p>{props.cards[currentIndex].question}</p>
                        </div>
                        <div className="fc-back">
                            <p>{props.cards[currentIndex].answer}</p>
                        </div>
                    </div>
                    <button onClick={handleNextCard}>Next Flashcard</button>
                    <button onClick={handlePrevCard}>Previous Flashcard</button>
                </div>
            }
        </div>
        
    );
};