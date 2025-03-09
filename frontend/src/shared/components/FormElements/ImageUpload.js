import React, { useEffect, useRef, useState } from "react";

import "./ImageUpload.css";
import Button from "../UiElements/Button.js";

const ImageUplaod = (props) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [preview, setPreview] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
        setPreview(fileReader.result)
    }
    fileReader.readAsDataURL(file)
  }, [file]);

  const pickedHandler = (event) => {
    let fileIsValid = isValid;
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(!isValid);
      fileIsValid = false;
    }
    // props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        type="file"
        ref={filePickerRef}
        style={{ display: "none" }}
        accept=".jpeg,.png,.jpg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
         {preview ? <img src={`${preview}`} alt="Preview" /> : <p>Please Upload a Image</p>}
         
        </div>
        <Button type="button" onClick={pickImageHandler}>
          UPLOAD IMAGE
        </Button>
      </div>
    </div>
  );
};

export default ImageUplaod;
