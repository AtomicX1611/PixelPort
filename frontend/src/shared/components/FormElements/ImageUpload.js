import React, { useEffect, useRef, useState } from "react";

import "./ImageUpload.css";
import Button from "../UiElements/Button.js";

const ImageUplaod = (props) => {
  const filePickerRef = useRef();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const multiple = props.multiple || false;

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }
    const urls = [];
    let loaded = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        urls.push(reader.result);
        loaded++;
        if (loaded === files.length) {
          setPreviews([...urls]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [files]);

  const pickedHandler = (event) => {
    const picked = event.target.files;
    if (!picked || picked.length === 0) {
      setIsValid(false);
      props.onInput(props.id, multiple ? [] : null, false);
      return;
    }

    const fileArray = Array.from(picked);
    setFiles(fileArray);
    setIsValid(true);
    props.onInput(props.id, multiple ? fileArray : fileArray[0], true);
  };

  const removeImage = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    const valid = updated.length > 0;
    setIsValid(valid);
    props.onInput(props.id, multiple ? updated : updated[0] || null, valid);
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        type="file"
        ref={filePickerRef}
        style={{ display: "none" }}
        accept=".jpeg,.png,.jpg"
        multiple={multiple}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        {previews.length > 0 ? (
          <div className="image-upload__previews">
            {previews.map((src, i) => (
              <div className="image-upload__preview-item" key={i}>
                <img src={src} alt={`Preview ${i + 1}`} />
                <button
                  type="button"
                  className="image-upload__remove"
                  onClick={() => removeImage(i)}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="image-upload__preview">
            <p>{multiple ? "Upload Images" : "Upload an Image"}</p>
          </div>
        )}
        <Button type="button" onClick={pickImageHandler}>
          {multiple ? "SELECT IMAGES" : "UPLOAD IMAGE"}
        </Button>
      </div>
    </div>
  );
};

export default ImageUplaod;
