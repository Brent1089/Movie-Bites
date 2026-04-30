import { useState } from "react";
import RandomScore from "./RandomScore";

function ScoreCard() {
    const [score, setScore] = useState(0);

    function updateScore(newScore) {
        setScore(newScore);
    }

    return(
        <div>
            <p><strong>Score: </strong>{score}</p>
            <RandomScore updateScore={updateScore} />
        </div>
    );
}