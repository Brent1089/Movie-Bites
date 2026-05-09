/**
 * Renders the button that toggles between the movie table and add-movie form.
 */
export default function ShowHideAddMovie({updateShow, buttonText, showTable}) {

    /**
     * Toggles the add-movie form and updates the button label.
     */
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
