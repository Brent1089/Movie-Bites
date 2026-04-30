export default function RandomScore({updateScore}) {

    function handleNewScore() {
        updateScore(Math.floor(Math.random() * 100)+1);
    }

    return(
        <div>
            <button onClick={handleNewScore}>Update</button>
        </div>
    );
}