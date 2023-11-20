import React, { useEffect, useState, useMemo } from "react";
import ANIMALINFO from "../../ANIMALINFO";
import SmallInfoTile from "../Atoms/SmallInfoTile";
import CONSTANTS from "../../CONSTANTS";

function CompAnimal({
  type,
  onCollect,
  onFeed,
  sizeWidth,
  sizeHeight,
  walkingInfo,
  collectible,
  Animal_ID,
  name,
  lastFed,
  visible,
  moreInfo,
  timeUntilCollect
}) {
  const [hover, setHover] = useState(false);
  const [feedGif, setFeedGif] = useState(null);

  const [infoTile, setInfoTile] = useState(false);

  const handleClick = () => {
    if (sessionStorage.getItem("equipped") in ANIMALINFO.FoodHappinessYields) {
      if (Date.now() - lastFed >= ANIMALINFO.VALUES.FEED_COOLDOWN) {
        let feed = sessionStorage.getItem("equipped");
        onFeed(Animal_ID, feed);
        if (ANIMALINFO.foodPreferences[type].like.includes(feed)) {
          setFeedGif("love.gif");
        } else if (ANIMALINFO.foodPreferences[type].dislike.includes(feed)) {
          setFeedGif("hate.gif");
        } else {
          setFeedGif("neutral.gif");
        }
        // 583ms = 7 frames at 12fps
        setTimeout(() => {
          setFeedGif(null);
        }, 583);
      } else {
        // cooldown on feed
      }
    } else {
      onCollect(Animal_ID, type);
    }
  };

  const imgURL = () => {
    if (collectible) {
      if (walkingInfo.walking && visible) {
        // left animation is just right animation but mirrored
        return `${process.env.PUBLIC_URL
          }/assets/images/${type}_collectible_walking_${walkingInfo.direction === "left" ? "right" : walkingInfo.direction
          }.gif`;
      }
      return `${process.env.PUBLIC_URL
        }/assets/images/${type}_collectible_standing_${walkingInfo.direction === "left" ? "right" : walkingInfo.direction
        }.png`;
    } else {
      if (walkingInfo.walking && visible) {
        return `${process.env.PUBLIC_URL}/assets/images/${type}_walking_${walkingInfo.direction === "left" ? "right" : walkingInfo.direction
          }.gif`;
      }
      return `${process.env.PUBLIC_URL}/assets/images/${type}_standing_${walkingInfo.direction === "left" ? "right" : walkingInfo.direction
        }.png`;
    }
  };

  const timeUntilNextFeed = () => {
    const secondsRemaining = Math.round((ANIMALINFO.VALUES.FEED_COOLDOWN - (Date.now() - lastFed)) * (1 / 1000));
    if (secondsRemaining <= 0) {
      return ' (hungry)';
    }
    if (secondsRemaining >= 60) {
      return ` (${Math.floor(secondsRemaining / 60)} min)`;
    }
    return ` (${secondsRemaining} secs)`
  }

  const moreInfoMenu = () => {
    const getTimeString = () => {
      let totalSeconds = timeUntilCollect;
      if (totalSeconds <= 0) return "Done"

      let minString = '';
      if (totalSeconds > 60) {
        minString = `${Math.floor(totalSeconds / 60)}m `;
        totalSeconds = totalSeconds % 60;
      }
      let secString = '';
      if (totalSeconds > 0) {
        secString = `${Math.floor(totalSeconds)}s`;
      }
      return minString + secString;
    }

    return (
      <SmallInfoTile>
        <p>Animal: {CONSTANTS.InventoryDescriptions[type]?.[0]}</p>
        {name && <p>Name: {name}</p>}
        <p>Time: {getTimeString()}</p>
      </SmallInfoTile>
    )
  }

  const left = walkingInfo?.coordinates?.[0] ? walkingInfo.coordinates?.[0] : 0;
  const top = walkingInfo?.coordinates?.[1] ? walkingInfo.coordinates?.[1] : 0;

  let imgStyle = {
    height: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    // border: '1px dotted purple',
    transform: walkingInfo.direction === "left" ? "scaleX(-1)" : "scaleX(1)",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    draggable: "false",
  };

  if (sessionStorage.getItem("equipped") === "" && !moreInfo) {
    imgStyle.cursor = collectible ? "grab" : "default";
  }

  let divStyle = {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: `${sizeWidth}`,
    height: `${sizeHeight}`,
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    draggable: "false",
  };
  if (visible === "visible") {
    divStyle.transition = "all 3s";
    divStyle.transitionTimingFunction = "linear";
  }

  if (Object.keys(walkingInfo).length === 0) {
    return <div></div>;
  }
  return (
    <div
      style={divStyle}
      onMouseEnter={() => {
        if(moreInfo) {
          setInfoTile(true)
        } else {
          setHover(true);
        }
      }}
      onMouseLeave={() => {
        setHover(false);
        setInfoTile(false)
      }}
      onMouseDown={handleClick}
      draggable={false}
    >
      {infoTile && moreInfoMenu()}
      {hover &&
        sessionStorage.getItem("equipped") in
        ANIMALINFO.FoodHappinessYields && (
          <div
            style={{
              position: "absolute",
              top: "-2vh",
              fontSize: "2vh",
              textAlign: "center",
              zIndex: '5',
              textWrap: "nowrap"
            }}
          >
            {name === "" ? type : name}
            <span style={{ fontSize: '1.8vh', color: 'black' }}>{timeUntilNextFeed()}</span>
          </div>
        )}
      {feedGif && (
        <div
          style={{
            position: "absolute",
            top: "-3vh",
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/animal_reactions/${feedGif}`}
            style={{ width: "3vw" }}
          />
        </div>
      )}
      <img src={imgURL()} alt={type} style={imgStyle} draggable={false} />
    </div>
  );
}

export default CompAnimal;
