export function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        // Use Math.random() to pick a random index from the characters string
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function convertToExcelFriendlyDate(isoDate) {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const padNumber = (num) => {
    return num.toString().padStart(2, '0');
}

export const dateConverter = (date) => {
    let d = new Date(date);
    return `${padNumber(d.getDate())}/${padNumber(d.getMonth() + 1)}/${d.getFullYear()}`
}

export const dateConverterOnlyMonthAndYear = (date) => {
    let d = new Date(date);
    return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`
}

export const dateGetReadableString = (date) => {
    let d = new Date(date);
    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // for am/pm format
    };
    return d.toLocaleDateString("en-US", options)
}

export function isValidDate(dateString) {
    const date = new Date(dateString);

    return !isNaN(date.getTime());
}

export const dateConverterUSFormat = (date) => {
    let d = new Date(date);
    return `${d.getFullYear()}-${padNumber(d.getMonth() + 1)}-${padNumber(d.getDate())}`
}

export const dateConverterGetTimeOnly = (date) => {
    let d = new Date(date);
    return `${padNumber(d.getHours())}:${padNumber(d.getMinutes())}`
}

export const htmlDateTimeToDate = (date, time) => {
    if (date.length > 0) {
        let combined = `${date}`;
        if (time.length > 0) {
            combined += `T${time}:00`
        }
        return new Date(combined);
    } else {
        return new Date()
    }
}

export const getMinDate = () => {
    return new Date("1970-01-01T00:00:00Z"); // 'Z' explicitly indicates UTC
};

export const getMaxDate = () => {
    return new Date("2125-11-08T00:00:00Z");
};

export const isDateValid = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.length > 0;
}

export const getUrlEncodedDate = (dateObj) => {
    const date = new Date(dateObj);
    const isoString = date.toISOString();
    return encodeURIComponent(isoString);
}