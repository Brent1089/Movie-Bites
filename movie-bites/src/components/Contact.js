import { useState } from 'react';
import { isRequired, characterLimit, emailValidate } from "../utils/Validators";

export default function Contact() {
    const [contactMessage, setContactMessage] = useState({
        title: "",
        email: "",
        message: ""
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // Update state on input change
    function handleChange(event) {
        const { name, value } = event.target;
        setContactMessage(prevcontactMessage => ({ ...prevcontactMessage, [name]: value }));
    }

    // Validate input and display message / show errors.
    function handleSubmit(event) {
        event.preventDefault();
        const newErrors = {};

        for (let key in contactMessage) {
            let value = contactMessage[key];

            // Skip other validation if required check fails
            if (!isRequired(value)) {
                newErrors[key] = `${key} is required.`;
                continue
            }

            // Character limit validators
            if (key === "title" && !characterLimit(value, 1, 32)) {
                newErrors.title = "Title must be between 1 and 32 characters.";
                continue;
            }
            if (key === "email" && !characterLimit(value, 6, 32)) {
                newErrors.email = "Email must be between 6 and 32 characters.";
                continue;
            }
            if (key === "message" && !characterLimit(value, 1, 255)) {
                newErrors.message = "Message must be between 1 and 255 characters.";
                continue;
            }

            // Validate email
            if (key === "email" && !emailValidate(value)) {
                newErrors.email = "Must be a valid email.";
                continue;
            }
        }

        // If errors exist, add errors to state and return
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        // Display submitted message
        setSubmitted(true);
    }

    return (
        <div>
            {/* render only if setSubmitted is true */}
            {submitted && (
                <div className="rounded-2 border border-secondary py-3 mt-3 w-75 mx-auto shadow-lg bg-blur mb-2">
                    <p className="mb-2"><strong>Title:</strong> {contactMessage.title}</p>
                    <p className="mb-2"><strong>Email:</strong> {contactMessage.email}</p>
                    <p className="mb-2"><strong>Message:</strong> {contactMessage.message}</p>
                </div>
            )}
            <div className='container p-4 text-start bg-rust rounded-2 text-rust-cream'>
                <h2 className="text-center">Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <div className='row mb-3'>
                        <div className='col'>
                            <label className="form-label me-2 mb-1">Title: </label>
                            <input type='text' className="form-control" name='title' value={contactMessage.title} onChange={handleChange} />
                            {errors.title && <p className="text-primary">{errors.title}</p>}
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <div className='col'>
                            <label className="form-label me-2 mb-1">Title: </label>
                            <input type='text' className="form-control" name='email' value={contactMessage.email} onChange={handleChange} />
                            {errors.email && <p className="text-primary">{errors.email}</p>}
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <div className='col'>
                            <label className="form-label me-2 mb-1">Message: </label>
                            <textarea className="form-control" name='message' value={contactMessage.message} onChange={handleChange} rows="3" />
                            {errors.message && <p className="text-primary">{errors.message}</p>}
                        </div>
                    </div>
                    <div className="text-center">
                        <button type='submit' className='btn btn-rust mt-4 mb-3' onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}