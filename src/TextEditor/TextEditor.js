import React from "react";
import styled from "styled-components";
import { TwitterPicker } from "react-color";
import useOutsideClick from "@rooks/use-outside-click";

import { ReactComponent as BoldIcon } from "./icons/bold-solid.svg";
import { ReactComponent as ItalicIcon } from "./icons/italic-solid.svg";
import { ReactComponent as UnderlineIcon } from "./icons/underline-solid.svg";
import { ReactComponent as TextColorIcon } from "./icons/palette-solid.svg";
import Synonyms from "./Synonyms";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 400px;
`;

const TextStyle = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const StyleButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  width: 30px;
  height: 30px;
  padding: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  border-radius: 4px;
  transition: color 0.2s;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.025);
    outline: none;
  }

  &.active {
    background-color: hsl(200, 27%, 96%);
    color: hsla(200, 37%, 54%, 1);
  }

  svg {
    height: 14px;
  }
`;

const TextArea = styled.div`
  width: 100%;
  height: 200px;
  border: 2px solid rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 8px 12px;
  line-height: 1.4em;
  overflow-y: scroll;

  &:focus {
    border-color: rgba(0, 0, 0, 0.1);
    outline: none;
  }
`;

const ColorPickerWrapper = styled.div`
  position: relative;

  .twitter-picker {
    position: absolute !important;
    top: calc(100% + 6px);
    left: -6px;
  }
`;

function getChildIndex(elem) {
  var i = 0;
  while (elem.previousElementSibling != null) {
    elem = elem.previousElementSibling;
    ++i;
  }
  return i;
}

export default function TextEditor({ initialValue, loadSynonyms }) {
  const [wordSelectedIndex, setWordSelectedIndex] = React.useState();
  const [words, setWords] = React.useState(
    initialValue.split(/(\w+)/g).map((text, index) => ({
      text: text,
      isBold: false,
      isItalic: false,
      isUnderline: false
    }))
  );

  const [isColorPickerVisible, setIsColorPickerVisible] = React.useState(false);
  const colorPickerRef = React.useRef();
  useOutsideClick(colorPickerRef, () => {
    setIsColorPickerVisible(false);
  });

  React.useEffect(() => {
    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();

      // Prevent changing selection if user is changing word color
      if (colorPickerRef.current.contains(selection.anchorNode)) return;

      // Word is selected if the selections starts and end in the word node
      // and selects all the text inside the node
      if (
        selection.anchorNode &&
        selection.anchorNode === selection.focusNode &&
        Math.max(selection.anchorOffset, selection.focusOffset) -
          Math.min(selection.anchorOffset, selection.focusOffset) ===
          selection.anchorNode.textContent.length
      ) {
        setWordSelectedIndex(getChildIndex(selection.anchorNode.parentElement));
      } else {
        setWordSelectedIndex(undefined);
      }
    });
  }, []);

  const replaceSelectedWordAttr = (key, transformValue) => {
    const newWords = words.map((word, index) =>
      index === wordSelectedIndex
        ? { ...word, [key]: transformValue(word[key]) }
        : word
    );
    setWords(newWords);
  };

  const handleToggleStyle = type =>
    replaceSelectedWordAttr(type, style => !style);
  const handleSetColor = color => {
    replaceSelectedWordAttr("color", () => color.hex);
    setIsColorPickerVisible(false);
  };
  const handleReplaceSelected = newWord =>
    replaceSelectedWordAttr("text", () => newWord);

  const isStyleActive = type =>
    wordSelectedIndex && words[wordSelectedIndex][type];

  return (
    <Container>
      <TextStyle>
        <StyleButton
          className={isStyleActive("isBold") ? "active" : ""}
          disabled={!wordSelectedIndex}
          onClick={() => handleToggleStyle("isBold")}
        >
          <BoldIcon />
        </StyleButton>
        <StyleButton
          className={isStyleActive("isItalic") ? "active" : ""}
          disabled={!wordSelectedIndex}
          onClick={() => handleToggleStyle("isItalic")}
        >
          <ItalicIcon />
        </StyleButton>
        <StyleButton
          className={isStyleActive("isUnderline") ? "active" : ""}
          disabled={!wordSelectedIndex}
          onClick={() => handleToggleStyle("isUnderline")}
        >
          <UnderlineIcon />
        </StyleButton>
        <ColorPickerWrapper ref={colorPickerRef}>
          <StyleButton
            disabled={!wordSelectedIndex}
            onClick={() => setIsColorPickerVisible(true)}
          >
            <TextColorIcon
              style={{
                color: wordSelectedIndex && words[wordSelectedIndex].color
              }}
            />
          </StyleButton>
          {isColorPickerVisible && (
            <TwitterPicker triangle="top-left" onChange={handleSetColor} />
          )}
        </ColorPickerWrapper>
      </TextStyle>

      <TextArea>
        {words.map(({ text, isBold, isItalic, isUnderline, color }, index) => (
          <span
            key={index}
            style={{
              fontWeight: isBold ? "bold" : "normal",
              fontStyle: isItalic ? "italic" : "normal",
              textDecoration: isUnderline ? "underline" : "none",
              color: color || "currentColor"
            }}
          >
            {text}
          </span>
        ))}
      </TextArea>

      <Synonyms
        selectedWord={wordSelectedIndex && words[wordSelectedIndex].text}
        replaceSelected={handleReplaceSelected}
        loadSynonyms={loadSynonyms}
      />
    </Container>
  );
}
