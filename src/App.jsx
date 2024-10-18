import { ArrowRight, Copy, ImagePlus, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import user from "../src/assets/user.png";

export default function App() {
  const textareaRef = useRef();
  const hiddenTextareaRef = useRef();
  const [log, setLog] = useState("");
  const [logArr, setLogArr] = useState([]);
  const [people, setPeople] = useState([]);
  const [isHtmlVisible, setIsHtmlVisible] = useState(true);
  const [code, setCode] = useState({ html: "", css: "" });
  const [photoArr, setPhotoArr] = useState([]);
  const fReader = new FileReader();

  function parseMessage(text) {
    const regex = /\[([^\]]+)\] \[([^\]]+)\] (.+)/;
    const match = text.match(regex);

    if (match) {
      const [, name, time, msg] = match;
      setPeople((prev) => {
        if (prev.filter((v) => v?.name === name).length) return prev;
        else return [...prev, { name: name, color: "#7eb1d9", photo: "" }];
      });
      return { name, time, msg };
    }

    return null;
  }

  function changeColor(hex) {
    if (hex) {
      hex = hex.replace("#", "");

      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);

      r = Math.floor(r * 0.7);
      g = Math.floor(g * 0.7);
      b = Math.floor(b * 0.7);

      const newHex =
        "#" +
        ((1 << 24) + (r << 16) + (g << 8) + b)
          .toString(16)
          .slice(1)
          .toUpperCase();

      return newHex;
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code.html);
      alert("코드가 복사되었습니다!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  useEffect(() => {
    textareaRef.current.style.height = "128px";
  }, []);

  useEffect(() => {
    for (const idx in log.split("\n")) {
      const data = parseMessage(log.split("\n")[idx]);
      if (data == null) return;
      else {
        if (data.msg == "사진") {
          setPhotoArr((prev) => {
            return [...prev, { src: "", idx }];
          });
        }
      }
    }
  }, [log]);

  useEffect(() => {
    for (const v of log.split("\n")) {
      if (parseMessage(v) == null) return;
    }

    setCode((prev) => {
      const tailColors = [];
      const msgColors = [];
      for (const person of people) {
        tailColors.push(`
.TailColor${person.color.split("#")[1]} {
    background: linear-gradient(135deg, ${person.color} 50%, ${changeColor(
          person.color
        )} 50%)
}
    `);
        msgColors.push(`
.MsgColor${person.color.split("#")[1]} {
    background: linear-gradient(180deg, ${person.color} 50%, ${changeColor(
          person.color
        )} 50%)
}
    `);
      }
      const tailSet = new Set(tailColors);
      const msgSet = new Set(msgColors);
      const htmlFront = `<div style="background: #000;
width: 330px; 
height: 500px; 
color: #eee; 
border-radius: 8px; 
padding: 1rem; 
overflow-y: scroll; 
box-sizing: border-box;">\n`;
      const htmlMid = [];
      const htmlBack = `</div>`;

      for (let i = 0; i < log.split("\n").length; i++) {
        const parsedData = parseMessage(log.split("\n")[i]);
        if (!parsedData) continue;

        const person = people.find((v) => v.name == parsedData.name);

        if (parsedData.msg === "사진") {
          htmlMid.push(
            `<div style="margin-block: 1rem; 
    display: flex; 
    gap: 0.2rem;
    align-items: center;">
    <div style="width: 50px; 
    text-align: center; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    gap: 0.2rem; ">
      <div style="width: 2rem; 
    height: 2rem; 
    background: #000; 
    border: 2px solid #eee; 
    overflow: hidden; 
    position: relative; ">
        <img src="프로필_사진_주소" style="height: 2rem;" />
      </div>
      <div style="font-size: 0.9rem;">${parsedData.name}</div>
    </div>
    <div style="font-size: 0.6rem; 
    color: #eee;
    display: flex; 
    gap: 0.4rem; 
    align-items: stretch;">
      <div style="display: flex;
    align-items: center;"><div style="width: 0.7rem; 
    height: 0.7rem; 
    transform: rotate(45deg); 
    border: 2px solid #eee; 
    border-top: 0; 
    border-right: 0; 
    position: relative; 
    margin-left: -0.5rem; 
    right: -0.85rem; 
    position: relative;
    z-index: 1;
    background: linear-gradient(135deg, ${person?.color} 50%, ${changeColor(
              person?.color
            )} 50%);"></div>
    </div>
    <div style="max-width: 150px; 
    box-sizing: border-box; 
    font-size: 0.8rem; 
    padding: 0.5rem; 
    border-radius: 8px; 
    border: 2px solid #eee; 
    word-break: break-all;
    overflow-x: hidden;
    background: linear-gradient(180deg, ${person?.color} 50%, ${changeColor(
              person?.color
            )} 50%);">
      <img src="채팅_사진_주소" style="position: relative;
    z-index: 2;
    height: 5rem;
    border-radius: 8px;"/>
    </div>
    <div style="font-size: 0.6rem;
    display: flex;
    align-items: flex-end;">${parsedData.time}</div>
  </div>
</div>
`
          );
        } else {
          htmlMid.push(
            `<div style="margin-block: 1rem; 
    display: flex; 
    gap: 0.2rem;
    align-items: center;">
    <div style="width: 50px; 
    text-align: center; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    gap: 0.2rem; ">
      <div style="width: 2rem; 
    height: 2rem; 
    background: #000; 
    border: 2px solid #eee; 
    overflow: hidden; 
    position: relative; ">
        <img src="프로필_사진_주소" style="height: 2rem;" />
      </div>
      <div style="font-size: 0.9rem;">${parsedData.name}</div>
    </div>
    <div style="font-size: 0.6rem; 
    color: #eee;
    display: flex; 
    gap: 0.4rem; 
    align-items: stretch;">
      <div style="display: flex;
    align-items: center;"><div style="width: 0.7rem; 
    height: 0.7rem; 
    transform: rotate(45deg); 
    border: 2px solid #eee; 
    border-top: 0; 
    border-right: 0; 
    position: relative; 
    margin-left: -0.5rem; 
    right: -0.85rem; 
    position: relative;
    z-index: 1;
    background: linear-gradient(135deg, ${person?.color} 50%, ${changeColor(
              person?.color
            )} 50%);"></div>
    </div>
    <div style="max-width: 150px; 
    box-sizing: border-box; 
    font-size: 0.8rem; 
    padding: 0.5rem; 
    border-radius: 8px; 
    border: 2px solid #eee; 
    word-break: break-all;
    overflow-x: hidden;
    background: linear-gradient(180deg, ${person?.color} 50%, ${changeColor(
              person?.color
            )} 50%);">
      ${parsedData.msg}
    </div>
    <div style="font-size: 0.6rem;
    display: flex;
    align-items: flex-end;">${parsedData.time}</div>
  </div>
</div>
`
          );
        }
      }

      prev.css =
        `
  @import url("https://cdn.jsdelivr.net/gh/fonts-archive/AppleSDGothicNeo/AppleSDGothicNeo.css");

.ChatBox {

}

.ChatBox, .ChatBox * { 
    font-family: "Apple SD Gothic Neo"; 
} 

.Chat { 
    
} 

.Chat > div:first-child { 
    width: 50px; 
    text-align: center; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    gap: 0.2rem; -----
} 

.Chat > div:first-child > div:first-child { 
    width: 2rem; 
    height: 2rem; 
    background: #000; 
    border: 2px solid #eee; 
    overflow: hidden; 
    position: relative; ----
} 

.Chat > div:first-child > div:first-child img { 
    height: 2rem; -----
} 

.Chat > div:first-child > div:first-child label { 
    width: 2rem; 
    height: 2rem; 
    backdrop-filter: brightness(0.4); 
    display: none; 
    position: absolute; ----
} 

.Chat > div:first-child > div:first-child:hover label { 
    display: flex; 
    align-items: center; 
    justify-content: center;----
} 

.Chat > div:first-child > div:first-child #edit { 
    height: 1rem; 
    width: 1rem; ----
} 

.Chat > div:first-child > div:first-child > input { 
    display: none; ----
}

.Chat > div:first-child > div:nth-child(2) {
    font-size: 0.9rem; ---
}

.Chat > div:nth-child(2) { 
    font-size: 0.6rem; 
    color: #eee; ----
} 

.Chat > div:nth-child(2) { 
    display: flex; 
    gap: 0.4rem; 
    align-items: stretch; -----
} 

.Chat > div:nth-child(2) > input { 
    width: 0; 
    height: 0; 
    padding: 0; 
    border: 0; -----
}

.Chat > div:nth-child(2) > div:last-child {
    font-size: 0.6rem;
    display: flex;
    align-items: flex-end;
}

.Tail { 
    width: 0.7rem; 
    height: 0.7rem; 
    transform: rotate(45deg); 
    border: 2px solid #eee; 
    border-top: 0; 
    border-right: 0; 
    position: relative; 
    margin-left: -0.5rem; 
    right: -0.85rem; 
    position: relative;
    z-index: 1; ----
} 

.TailCon {
    display: flex;
    align-items: center; ------
}

.Message { 
    max-width: 150px; 
    box-sizing: border-box; 
    font-size: 0.8rem; 
    padding: 0.5rem; 
    border-radius: 8px; 
    border: 2px solid #eee; 
    word-break: break-all;
    overflow-x: scroll; ------
}

.Message::-webkit-scrollbar {
  display: none;
}

.Message img {
    position: relative;
    z-index: 2;
    height: 5rem;
    border-radius: 8px;
}
` +
        [...tailSet].join(`\n`) +
        [...msgSet].join(`\n`);

      prev.html = htmlFront + htmlMid.join("") + htmlBack;
      return prev;
    });
  }, [log, people]);

  return (
    <Wrapper length={logArr.length}>
      <Title>채팅 로그 커스터마이저</Title>
      <InputBox log={log}>
        <textarea
          ref={textareaRef}
          placeholder="여기에 채팅 로그 텍스트를 입력하세요.
형식 : [닉네임] [오전/오후 XX:XX] 메시지"
          onChange={(e) => {
            const textarea = textareaRef.current;
            const hiddenTextarea = hiddenTextareaRef.current;
            hiddenTextarea.value = e.target.value;
            setLog(e.target.value);
            hiddenTextarea.style.height = "auto";
            if (hiddenTextarea.scrollHeight > 256) return;
            textarea.style.height = `${
              hiddenTextarea.scrollHeight < 128
                ? 128
                : hiddenTextarea.scrollHeight
            }px`;
          }}
        ></textarea>
        <div>
          <div
            onClick={() => {
              for (const v of log.split("\n")) {
                if (parseMessage(v) == null) {
                  alert(
                    "형식을 제대로 맞춰주세요. (마지막 채팅 이후 줄바꿈이 있다면 지워주세요!)"
                  );
                  return;
                }
              }

              setPeople([]);
              setLogArr(log.split("\n").map((v) => parseMessage(v)));
            }}
          >
            <ArrowRight size={16} color={log ? "#1d2532" : "#aaa"} />
          </div>
        </div>
        <textarea
          ref={hiddenTextareaRef}
          style={{
            width: "100%",
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "-1",
            color: "transparent",
            border: "0",
          }}
        ></textarea>
      </InputBox>
      {logArr.length ? (
        <ContentWrapper>
          <ChatBox>
            <SmallTitle>채팅</SmallTitle>
            {logArr.map(({ name, time, msg }, idx) => {
              const person = people.find((v) => v.name === name) || {};
              const photo = photoArr.find((v) => v.idx == idx) || {};
              return (
                <Chat key={idx}>
                  <div>
                    <div>
                      <label htmlFor={`profile${idx}`}>
                        <Pencil id="edit" />
                      </label>
                      <img src={person.photo || user} alt="" />
                      <input
                        type="file"
                        id={`profile${idx}`}
                        onInput={(e) => {
                          fReader.readAsDataURL(e.target.files[0]);
                          fReader.onloadend = (readEvent) => {
                            setPeople((prev) => {
                              const tempArr = [...prev];
                              for (const personIdx in tempArr) {
                                if (tempArr[personIdx].name === name) {
                                  tempArr[personIdx].photo =
                                    readEvent.target.result;
                                }
                              }
                              return tempArr;
                            });
                          };
                        }}
                      />
                    </div>
                    <div>{person.name}</div>
                  </div>
                  <div>
                    <TailCon>
                      <BubbleTail
                        color={person.color}
                        changecolor={changeColor(person.color)}
                      >
                        {/* 말풍선 꼬리용 div */}
                      </BubbleTail>
                    </TailCon>
                    <BubbleLabel
                      htmlFor={`color${idx}`}
                      color={person.color}
                      changecolor={changeColor(person.color)}
                    >
                      {msg == "사진" ? (
                        photo.src ? (
                          <img src={photo.src} />
                        ) : (
                          <div>
                            <ImageLabel htmlFor={`photo${idx}`}>
                              <ImagePlus />
                            </ImageLabel>
                            <input
                              type="file"
                              style={{ display: "none" }}
                              id={`photo${idx}`}
                              onInput={(e) => {
                                fReader.readAsDataURL(e.target.files[0]);
                                fReader.onloadend = (readEvent) => {
                                  setPhotoArr((prev) => {
                                    return prev.map((item) =>
                                      item.idx == idx
                                        ? {
                                            ...item,
                                            src: readEvent.target.result,
                                          }
                                        : item
                                    );
                                  });
                                };
                              }}
                            />
                          </div>
                        )
                      ) : (
                        msg
                      )}
                    </BubbleLabel>
                    <input
                      type="color"
                      id={`color${idx}`}
                      onChange={(e) => {
                        setPeople((prev) => {
                          const tempArr = [...prev];
                          for (const personIdx in tempArr) {
                            if (tempArr[personIdx].name === name) {
                              tempArr[personIdx].color = e.target.value;
                            }
                          }
                          return tempArr;
                        });
                      }}
                    />
                    <div>{time}</div>
                  </div>
                </Chat>
              );
            })}
          </ChatBox>
          <CodeBox>
            <SmallTitle>코드 보기</SmallTitle>
            <ButtonContainer>
              <Button
                active={+isHtmlVisible}
                onClick={() => setIsHtmlVisible(true)}
              >
                HTML
              </Button>
              {/* <Button
                active={+!isHtmlVisible}
                onClick={() => setIsHtmlVisible(false)}
              >
                CSS
              </Button> */}
            </ButtonContainer>
            <CodeContent>
              {/* {isHtmlVisible ? <pre>{code.html}</pre> : <pre>{code.css}</pre>} */}
              <pre>{code.html}</pre>
              <CopyButton
                onClick={() => {
                  copyToClipboard();
                }}
              >
                <Copy />
              </CopyButton>
            </CodeContent>
          </CodeBox>
        </ContentWrapper>
      ) : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  ${(props) =>
    props.length
      ? css`
          justify-content: flex-start;
          padding: 5rem 0;
        `
      : css`
          height: 100vh;
          justify-content: center;
        `}
`;

const Title = styled.div`
  color: #eee;
  font-size: 2rem;
  font-weight: 300;
`;

const InputBox = styled.div`
  border-radius: 8px;
  border: 1px solid #555;
  background: #363636;
  width: 40vw;
  @media (max-width: 1024px) {
    width: 60vw;
  }
  @media (max-width: 768px) {
    width: 80vw;
  }
  & > textarea {
    background: transparent;
    border: 0;
    outline: none;
    resize: none;
    padding: 1rem;
    color: #aaa;
    font-family: "SUIT";
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #555;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  & > div {
    color: #aaa;
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem;
    & > div {
      cursor: pointer;
      width: 1.7rem;
      height: 1.7rem;
      border-radius: 50%;
      background: #555;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
      &:hover {
        background: #b0c4e8;
        transform: scale(1.1);
      }
      ${(props) =>
        props.log &&
        css`
          background: #a4b6d4;
        `}
    }
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ChatBox = styled.div`
  @import url("https://cdn.jsdelivr.net/gh/fonts-archive/AppleSDGothicNeo/AppleSDGothicNeo.css");
  background: #282c34;
  width: 330px;
  height: 500px;
  color: #eee;
  border-radius: 8px;
  padding: 1rem;
  overflow-y: scroll;
  box-sizing: border-box;
  &,
  & * {
    font-family: "Apple SD Gothic Neo";
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CodeBox = styled.div`
  @import url("https://cdn.jsdelivr.net/gh/fonts-archive/AppleSDGothicNeo/AppleSDGothicNeo.css");
  background: #282c34;
  width: 330px;
  height: 500px;
  color: #eee;
  border-radius: 8px;
  padding: 1rem;
  overflow-y: scroll;
  box-sizing: border-box;
  &,
  & * {
    font-family: "Apple SD Gothic Neo";
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CodeContent = styled.div`
  position: relative;
  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  pre {
    background: #222;
    padding: 1rem;
    border-radius: 5px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 0.9rem;
  }
`;

const Chat = styled.div`
  margin-block: 1rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  & > div {
    &:nth-child(1) {
      width: 50px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;
      & > div:nth-child(1) {
        width: 2rem;
        height: 2rem;
        background: #000;
        border: 2px solid #eee;
        overflow: hidden;
        position: relative;
        & img {
          height: 2rem;
        }
        & label {
          width: 2rem;
          height: 2rem;
          backdrop-filter: brightness(0.4);
          display: none;
          position: absolute;
        }
        &:hover label {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        & #edit {
          height: 1rem;
          width: 1rem;
        }
        & > input {
          display: none;
        }
      }
      & > div:nth-child(2) {
        font-size: 0.6rem;
        color: #eee;
      }
    }
    &:nth-child(2) {
      display: flex;
      gap: 0.4rem;
      align-items: stretch;
      & > input {
        width: 0;
        height: 0;
        padding: 0;
        border: 0;
      }
      & > div:last-child {
        font-size: 0.6rem;
        display: flex;
        align-items: flex-end;
      }
    }
    /* &:nth-child(3) {
      display: flex;
      align-items: flex-end;
      font-size: 0.6rem;
    } */
  }
`;

const SmallTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #eee;
`;

const TailCon = styled.div`
  display: flex;
  align-items: center;
`;

const BubbleTail = styled.div.attrs((props) => ({
  style: {
    background: `linear-gradient(
      135deg,
      ${props.color} 50%,
      ${props.changecolor} 50%
    )`,
  },
}))`
  width: 0.7rem;
  height: 0.7rem;
  transform: rotate(45deg);
  border: 2px solid #eee;
  border-top: 0;
  border-right: 0;
  position: relative;
  margin-left: -0.5rem;
  right: -0.85rem;

  position: relative;
  z-index: 1;
`;

const BubbleLabel = styled.label.attrs((props) => ({
  style: {
    background: `linear-gradient(
      180deg,
      ${props.color} 50%,
      ${props.changecolor} 50%
    )`,
  },
}))`
  max-width: 150px;
  box-sizing: border-box;
  font-size: 0.8rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid #eee;
  word-break: break-all;
  cursor: pointer;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  & img {
    position: relative;
    z-index: 2;
    height: 5rem;
    border-radius: 8px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: 0.5rem 0;
`;

const Button = styled.button`
  background: ${(props) => (props.active ? "#555" : "#444")};
  color: #eee;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  transition: all 0.2s ease;
  &:hover {
    color: #ddd;
  }
`;

const ImageLabel = styled.label`
  backdrop-filter: brightness(0.4);
  display: inline-block;
  height: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
`;
