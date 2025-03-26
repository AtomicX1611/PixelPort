import Input from "../../shared/components/FormElements/Input.js";
import Button from "../../shared/components/UiElements/Button.js";
import React from "react";
import "./NewPlace.css";
import { useForm } from "../../shared/hooks/form-hook.js";
import { VALIDATOR_REQUIRE } from "../../shared/utils/validator.js";
import useHttpClient from "../../shared/hooks/http-hook.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import ErrorModal from "../../shared/components/UiElements/ErrorModal.js";
import ImageUplaod from "../../shared/components/FormElements/ImageUpload.js";

const NewPlace = () => {
  const authContext = useContext(AuthContext);
  const { loading, sendRequest, error, clearError } = useHttpClient();
  const [formState, InputHandler] = useForm({
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
    image : {
      value : null,
      isValid : false
    }
  });

  const AddPlaceHandler = async (event) => {
    //Check Validity Here
    event.preventDefault();
    try {
      console.log("Sending Request,");
      const formData = new FormData();
      console.log("Form Data : ", formState.inputs);

      formData.append("title", formState.inputs.Title.value);
      formData.append("desc", formState.inputs.Description.value);
      formData.append("address", formState.inputs.Address.value);
      formData.append("creatorID", authContext.userId);
      formData.append("image", formState.inputs.image.value);
      formData.append("location",JSON.stringify({ lng: "74.001", lat: "40.712" }));
      formData.append("pid","100")

      await sendRequest("http://localhost:5000/api/places/", "POST", formData,
        {
          Authorization : "Bearer "+authContext.token
        }
      );
    } catch (error) {
      console.log("Couldnt add place, ", error);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={AddPlaceHandler}>
        <Input
          id="Title"
          element="input"
          type="text"
          label="Title"
          error="Please enter valid text"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
        />
        <Input
          id="Description"
          element="desc"
          type="text"
          label="Description"
          validators={[VALIDATOR_REQUIRE()]}
          error="Please enter valid Description"
          onInput={InputHandler}
        />
        <Input
          id="Address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          error="Please enter valid Address"
          onInput={InputHandler}
        />
        <ImageUplaod center id="image" onInput={InputHandler}/>
        <Button type="submit">ADD PLACE</Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
