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
  });

  const AddPlaceHandler = async (event) => {
    //Check Validity Here
    event.preventDefault();
    try {
      console.log("Sending Request,");
      console.log(formState.inputs);
      await sendRequest(
        "http://localhost:5000/api/places/",
        "POST",
        JSON.stringify({
          pid: "u1",
          title: formState.inputs.Title.value,
          desc: formState.inputs.Description.value,
          address: formState.inputs.address.value,
          creatorID: authContext.userId,
          imageUrl: formState.inputs.imageUrl.value,
          location: {
            lng : "11",
            lat : "122"
          },
        }),
        { 
          "Content-Type": "application/json",
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
         <Input
          id="ImageUrl"
          element="input"
          type="text"
          label="ImageUrl" 
          validators={[VALIDATOR_REQUIRE()]}
          error="Please give valid url"
          onInput={InputHandler}
        />
        <Button type="submit">ADD PLACE</Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
