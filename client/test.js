function generateShortId() {
    // Generates a base64 string, removes special chars, takes the first 10
    return Math.random().toString(36).substring(2);
}

console.log(generateShortId())