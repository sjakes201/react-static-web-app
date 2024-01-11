import React, { useState, useContext, useEffect } from "react";
import ANIMALINFO from "../../ANIMALINFO";
import { useWebSocket } from "../../WebSocketContext";
import { GameContext } from "../../GameContainer";

function AnimalCard({ animal }) {
  const { waitForServerResponse } = useWebSocket();
  const { setBarn, setCoop, coop, setAnimalsInfo, setDisableKeyBinds } = useContext(GameContext)

  const type = animal.Animal_type;
  const Animal_ID = animal.Animal_ID;
  const name = animal.Name;

  // Generate heart images (make this less ratchet, better ways to do it with mod)
  const hearts = [0, 0, 0, 0, 0];
  let happiness = animal.Happiness;
  happiness = Math.round(happiness * 100) / 100

  for (let i = 0; i < 5; ++i) {
    if (happiness >= 0.2) {
      hearts[i] = 1;
      happiness -= 0.2;
    } else if (happiness < 0.2 && happiness > 0.08) {
      hearts[i] = 0.5;
      happiness = 0;
    } else {
      hearts[i] = 0;
    }
  }

  const [newName, setNewName] = useState("");
  const [renameAppear, setRenameAppear] = useState(false);

  useEffect(() => {
    setDisableKeyBinds(renameAppear)

    return () => setDisableKeyBinds(false)
  }, [renameAppear])

  const handleRename = async (e) => {
    console.log("rename call");
    e.preventDefault();
    setRenameAppear(false);

    if (coop.filter((a) => a.Animal_ID === Animal_ID).length > 0) {
      // is coop animal
      setCoop((old) => {
        return old.map((animal) => {
          if (animal.Animal_ID === Animal_ID) {
            let newAnimal = { ...animal };
            newAnimal.Name = newName;
            return newAnimal;
          } else {
            return animal;
          }
        });
      });
    } else {
      // is barn animal
      setBarn((old) => {
        return old.map((animal) => {
          if (animal.Animal_ID === Animal_ID) {
            let newAnimal = { ...animal };
            newAnimal.Name = newName;
            return newAnimal;
          } else {
            return animal;
          }
        });
      });
    }

    if (waitForServerResponse) {
      // Ensure `waitForServerResponse` is defined
      const response = await waitForServerResponse("nameAnimal", {
        name: newName,
        Animal_ID: Animal_ID,
      });
      console.log(response);
    }
    setNewName("");
  };

  const deleteAnimal = async (AnimalID) => {
    let location;
    if (coop.filter((a) => a.Animal_ID === AnimalID).length > 0) {
      location = "coop";
      setCoop((old) => {
        return old.filter((animal) => animal.Animal_ID !== AnimalID);
      });
      setAnimalsInfo((old) => {
        let newInfo = { ...old };
        newInfo.coopCount -= 1;
        return newInfo;
      });
    } else {
      location = "barn";
      setBarn((old) => {
        return old.filter((animal) => animal.Animal_ID !== AnimalID);
      });
      setAnimalsInfo((old) => {
        let newInfo = { ...old };
        newInfo.barnCount -= 1;
        return newInfo;
      });
    }
    if (waitForServerResponse) {
      const response = await waitForServerResponse("deleteAnimal", {
        AnimalID: AnimalID,
        location: location,
      });
    }
  };

  return (
    <div
      style={{
        border: "1px solid black",
        width: "calc(100% - 14px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        margin: "7px",
        boxShadow:
          "0 0 0 1px var(--black),0 0 0 3px var(--border_yellow),0 0 0 5px var(--border_shadow_yellow),0 0 0 7px var(--black)",
        fontSize: "2vh",
        position: "relative",
        padding: "2%",
      }}
    >
      {renameAppear && (
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            top: "20%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleRename}
            style={{
              border: "2px solid black",
              background: "var(--menu_lighter)",
            }}
          >
            <label>
              New Name:
              <input
                style={{
                  width: "80%",
                  border: "1px solid black",
                  borderRadius: "5%",
                }}
                maxLength={10}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              ></input>
            </label>
            <button
              type="submit"
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/write.png`}
                style={{
                  width: "16px",
                }}
                alt={"submit"}
                onClick={handleRename}
              />
            </button>
          </form>
        </div>
      )}

      <p
        style={{
          textTransform: "capitalize",
          height: "15%",
        }}
      >
        {name === "" ? type : name}
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/change_name.png`}
          style={{
            height: "1.2vh",
            marginLeft: ".2vw",
            cursor: "pointer",
          }}
          onClick={() => {
            setRenameAppear((old) => !old);
          }}
          alt={"animal rename prompt button"}
        />
      </p>

      <div
        id="pic-and-stats"
        style={{
          display: "flex",
          flexDirection: "row",
          height: "70%",
        }}
      >
        <div
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/${type}_standing_right.png`}
            style={{
              objectFit: "cover",
              width: "100%",
              overflow: "hidden",
            }}
            alt={"animal icon"}
          />
          <div
            style={{
              margin: "0",
              fontSize: ".9vw",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                padding: "0 3% 2% 3%",
              }}
            >
              {hearts.map((num) => {
                if (num === 1) {
                  return (
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/animal_reactions/fullheart.png`}
                      style={{
                        width: "10%",
                      }}
                    />
                  );
                } else if (num === 0.5) {
                  return (
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/animal_reactions/halfheart.png`}
                      style={{
                        width: "10%",
                      }}
                    />
                  );
                } else {
                  return (
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/animal_reactions/emptyheart.png`}
                      style={{
                        width: "10%",
                      }}
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>

        <div
          id="happiness"
          style={{
            width: "40%",
            fontSize: ".6vw",
          }}
        >
          <div
            id="foodpreferences"
            style={{
              textAlign: "center",
              textDecoration: "underline",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div>
              <p style={{ fontSize: ".85vw" }}>Loves</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {ANIMALINFO.foodPreferences?.[type].like.map((name) => {
                  return (
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/${name}.png`}
                      style={{
                        width: `${100 / ANIMALINFO.foodPreferences?.[type].like.length >
                          50
                          ? 50
                          : 100 /
                          ANIMALINFO.foodPreferences?.[type].like.length
                          }%`,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <p style={{ fontSize: ".85vw" }}>Hates</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {ANIMALINFO.foodPreferences?.[type].dislike.map((name) => {
                  return (
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/${name}.png`}
                      style={{
                        width: `${100 /
                          ANIMALINFO.foodPreferences?.[type].dislike.length >
                          50
                          ? 50
                          : 100 /
                          ANIMALINFO.foodPreferences?.[type].dislike.length
                          }%`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        style={{
          margin: "3%",
          background: "var(--menu_lighter)",
          padding: "1.6%",
          borderRadius: "10%",
          fontSize: "1.8vh",
          height: "15%",
        }}
        onClick={() => deleteAnimal(Animal_ID)}
      >
        Release
      </button>
    </div>
  );
}

export default AnimalCard;
