import React from "react";

function TweetButton({ message }) {
  const tweetURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <a href={tweetURL} target="_blank" rel="noopener noreferrer">
      <button
        style={{
          height: "2.5vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          border: "1px solid black",
          borderRadius: "3px",
          padding: ".1vh",
        }}
      >
        <img
          style={{ height: "100%" }}
          src={`${process.env.PUBLIC_URL}/assets/images/external/Twitter_logo_blue_32.png`}
        />
      </button>
    </a>
  );
}

export default TweetButton;
