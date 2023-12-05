import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

import AdinPlayAd from "../../AdinPlayAd";

function AnimalsTopBar({ setManager }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "80vw",
        height: "90px",
        background: "var(--menu_light)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: '0.5vw 0.5vw 1vw 2vw',
        position: "relative",
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/grass1.png), url(${process.env.PUBLIC_URL}/assets/images/grass2.png)`,
        backgroundRepeat: "repeat, repeat",
      }}
    >
      <div
        style={{
          maxWidth: "9%",
          maxHeight: "100%",
          objectFit: "contain",
          boxSizing: "border-box",
          boxShadow:
            "0 0 0 1px var(--black), 0 0 0 3px var(--border_orange), 0 0 0 5px var(--border_shadow_orange), 0 0 0 7px var(--black)",
          zIndex: "3",
          background: "var(--menu_light)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/animal_manage.png`}
          style={{
            width: "100%",
            maxHeight: "100%",
            cursor: "pointer",
            objectFit: "contain",
          }}
          onClick={() => setManager(true)}
        />
      </div>
    </div>
  );
}

export default AnimalsTopBar;
