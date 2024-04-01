const message = (text: string | Error) => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    };
    const formattedDate = date.toLocaleString('en-US', options);

    console.log(`[${formattedDate}] ${text}`);
};

export default message;