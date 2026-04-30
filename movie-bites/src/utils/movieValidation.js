import {
    isRequired,
    characterLimit,
    yearValidate,
    imageLinkValidate,
    starRatingValidate,
    ageRatingValidate
} from "./Validators";

function validateMovieData(movie) {
    const newErrors = {};

    for (let key in movie) {
        // Ignore ID
        if (key === "id") continue;

        const value = movie[key];

        // Skip other validation if required check fails unless key is poster_url
        if (!isRequired(value) && key !== "poster_url") {
            newErrors[key] = `${key} is required.`;
            continue;
        }

        // Character limit validators
        if (key === "title" && !characterLimit(value, 1, 32)) {
            newErrors.title = "Title must be between 1 and 32 characters.";
            continue;
        }
        if (key === "year" && !characterLimit(value, 4, 4)) {
            newErrors.year = "Year must be between 1 and 4 characters.";
            continue;
        }
        if (key === "genre" && !characterLimit(value, 3, 16)) {
            newErrors.genre = "Genre must be between 3 and 16 characters.";
            continue;
        }
        if (key === "age_rating" && !characterLimit(value, 1, 5)) {
            newErrors.age_rating = "Age Rating must be between 1 and 5 characters.";
            continue;
        }
        if (key === "description" && !characterLimit(value, 1, 255)) {
            newErrors.description = "Description must be between 1 and 255 characters.";
            continue;
        }
        if (key === "comment" && !characterLimit(value, 1, 255)) {
            newErrors.comment = "Comment must be between 1 and 255 characters.";
            continue;
        }

        // Year validation.
        if (key === "year" && !yearValidate(value)) {
            newErrors.year = "Must be a valid year.";
            continue;
        }

        // URL can be null but if filled it must be valid.
        if (key === "poster_url" && !imageLinkValidate(value) && value !== "") {
            newErrors.poster_url = "Poster URL must be a valid link format.";
            continue;
        }

        // Star rating validation.
        if (key === "star_rating" && !starRatingValidate(value)) {
            newErrors.star_rating = "Must be a number between 0 and 5.";
            continue;
        }

        // Age rating validation.
        if (key === "age_rating" && !ageRatingValidate(value)) {
            newErrors.age_rating = "Must be a valid age rating.";
            continue;
        }
    }

    return newErrors;
}

export { validateMovieData };
