import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";

const Edit = ({ save, set }) => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  useEffect(() => {
    if (save) {
      const contentState = editorState.getCurrentContent();
      const contentStateString = JSON.stringify(convertToRaw(contentState));
      localStorage.setItem("editorContent", contentStateString);
      set(false);
    }
  }, [save]);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const styleMap = {
    red: {
      color: "red",
      fontWeight: "normal",
    },
    bold: {
      fontWeight: "bold",
      fontSize: "16px",
    },
    underline: {
      fontSize: "16px",
      fontWeight: "normal",
      textDecoration: "underline",
      color: "black",
    },
  };

  const handleBeforeInput = (input) => {
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const currentContent = editorState.getCurrentContent();
    const block = currentContent.getBlockForKey(startKey);
    const textBeforeCursor = block.getText().slice(0, startOffset);

    const handleCondition = (type, style, offset) => {
      setEditorState((prevState) => {
        const contentState = prevState.getCurrentContent();
        const newContentState = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: startOffset - offset,
            focusOffset: startOffset,
          }),
          "",
        );
        const newEditorState = EditorState.push(
          prevState,
          newContentState,
          "remove-range",
        );

        const value =
          type == "block"
            ? RichUtils.toggleBlockType(newEditorState, style)
            : RichUtils.toggleInlineStyle(newEditorState, style);

        return value;
      });
    };

    if (input === " ") {
      if (textBeforeCursor.endsWith("#")) {
        handleCondition("block", "header-one", 1);
        return "handled";
      } else if (textBeforeCursor.endsWith("*")) {
        if (!textBeforeCursor.endsWith("**")) {
          handleCondition("inline", "bold", 1);
          return "handled";
        } else if (!textBeforeCursor.endsWith("***")) {
          handleCondition("inline", "red", 2);
          return "handled";
        } else if (!textBeforeCursor.endsWith("****")) {
          handleCondition("inline", "underline", 3);
          return "handled";
        }
      } else if (textBeforeCursor.endsWith("```")) {
        handleCondition("block", "code-block", 3);
        return "handled";
      }
    }

    return "not-handled";
  };

  return (
    <div style={{ border: "1px solid red" }}>
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={handleBeforeInput}
        onChange={setEditorState}
        customStyleMap={styleMap}
      />
    </div>
  );
};

export default Edit;
