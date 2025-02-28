import Input from "../../shared/components/FormElements/Input.js";
import Button from "../../shared/components/UiElements/Button.js";

import "./NewPlace.css";
import { useForm } from "../../shared/hooks/form-hook.js";
import { VALIDATOR_REQUIRE } from "../../shared/utils/validator.js";
import useHttpClient from "../../shared/hooks/http-hook.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";

const NewPlace = () => {
  const authContext = useContext(AuthContext)
  const { loading,sendRequest,error,clearError } = useHttpClient();
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
    event.preventDefault();
    try {
      await sendRequest(
        "http://localhost:3000/api/places/",
        "POST",
        JSON.stringify({
          pid: "u1",
          title: formState.inputs.title.value,
          desc: formState.inputs.desc.value,
          address: "address",
          creatorID: authContext.userId,
          imageUrl: "url",
          location: "location",
        })
      );
    } catch (error) {
      console.log("Couldnt add place...")
    }
  };

  return (
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
        element="input"
        type="text"
        label="Description"
        validators={[VALIDATOR_REQUIRE()]}
        error="Please enter valid Description"
        onInput={InputHandler}
      />
      <Button type="submit">ADD PLACE</Button>
    </form>
  );
};

export default NewPlace;
