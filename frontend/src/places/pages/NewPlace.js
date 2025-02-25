
import Input from "../../shared/components/FormElements/Input.js";
import Button from "../../shared/components/UiElements/Button.js";

import "./NewPlace.css";
import { useForm } from "../../shared/hooks/form-hook.js";
import { VALIDATOR_REQUIRE } from "../../shared/utils/validator.js";

const NewPlace = () => {
  const [formState,InputHandler] = useForm({ 
      title: {
        value: "",
        isValid: false,
      },
      description : {
        value : "",
        isValid : false,
      }
  });

  const AddPlaceHandler = (event) => {
    event.preventDefault();
    console.log(formState);
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
