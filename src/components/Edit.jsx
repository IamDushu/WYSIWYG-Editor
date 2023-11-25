import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";
import placeholders from "../constants/placeholders";
import styleMap from "../utils/styleMap";

const Edit = ({ save, set }) => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  useEffect(() => {
    if (save) {
      try {
        const contentState = editorState.getCurrentContent();
        const contentStateString = JSON.stringify(convertToRaw(contentState));
        localStorage.setItem("editorContent", contentStateString);
        set(false);
        toast.success("Your changes have been saved.");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.");
      }
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

  let placeholder =
    placeholders[Math.floor(Math.random() * placeholders.length)];

  return (
    <div className="editor">
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={handleBeforeInput}
        onChange={setEditorState}
        customStyleMap={styleMap}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Edit;
