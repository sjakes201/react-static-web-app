import React from 'react';

const TextDate = ({ unixTimeStamp }) => {
    try {
        const date = new Date(unixTimeStamp); 

        const dateOptions = {
            month: 'long',
            day: 'numeric',
        };

        const timeOptions = {
            hour: 'numeric',
            minute: '2-digit',
        };

        const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);

        return <span>{formattedDate}, {formattedTime}</span>;
    } catch (error) {
        console.log(error);
        return <div></div>;
    }
};

export default TextDate;
