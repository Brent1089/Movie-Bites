export default function ShowHideAddMovie({updateShow, buttonText, showTable}) {

    // Set the show / hide button back and forth.
    const handleShowHideButton = () => {
        if (showTable) {
            updateShow(false, 'Hide');
        } else {
            updateShow(true, 'Add Movie')
        }
    };

    return(
        <div>
            <button type='button' onClick={handleShowHideButton} className='btn btn-rust'>{buttonText}</button>
        </div>
    );
}