// Ensure passed value isn't empty.
function isRequired(value) {
    return value.trim() !== '';
}

// Check value against passed limits.
function characterLimit(value, min, max) {
    const valueLength = value.trim().length;
    return valueLength >= min && valueLength <= max;
}

// Validate year.
function yearValidate(value) {
    return /\b(19|20)\d\d\b/.test(value);
}

// Validate image link.
function imageLinkValidate(value) {
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg)(?:\?.*)?$/i.test(value);
}

// Validate star rating.
function starRatingValidate(value) {
    return /^[0-5]$/.test(value);
}

// Validate email.
function emailValidate(value) {
    return /^[^@]+@[^@]+\.[^@]+$/.test(value);
}

// Validate age rating.
function ageRatingValidate(value) {
    const validRatings = ["G", "PG", "PG-13", "R", "NC-17"];
    const trimmedValue = value.trim().toUpperCase();
    return validRatings.includes(trimmedValue);
}

export { isRequired, characterLimit, yearValidate, imageLinkValidate, starRatingValidate, ageRatingValidate, emailValidate };
