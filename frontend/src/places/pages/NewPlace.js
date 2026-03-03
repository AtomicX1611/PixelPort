import Input from "../../shared/components/FormElements/Input.js";
import Button from "../../shared/components/UiElements/Button.js";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./NewPlace.css";
import { useForm } from "../../shared/hooks/form-hook.js";
import { VALIDATOR_REQUIRE } from "../../shared/utils/validator.js";
import useHttpClient from "../../shared/hooks/http-hook.js";
import { AuthContext } from "../../context/AuthContext.js";
import ErrorModal from "../../shared/components/UiElements/ErrorModal.js";
import ImageUplaod from "../../shared/components/FormElements/ImageUpload.js";

const NewPlace = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { sendRequest, error, clearError } = useHttpClient();
  const [formState, InputHandler] = useForm({
    title: { value: "", isValid: false },
    description: { value: "", isValid: false },
    address: { value: "", isValid: false },
    images: { value: [], isValid: false },
  });

  const AddPlaceHandler = async (event) => {
    event.preventDefault();
    try {
      const imageFiles = formState.inputs.images?.value;
      if (!imageFiles || imageFiles.length === 0) {
        return;
      }

      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("desc", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creatorID", authContext.userId);
      for (const file of imageFiles) {
        formData.append("images", file);
      }
      formData.append("location", JSON.stringify({ lng: 74.001, lat: 40.712 }));
      formData.append("pid", "100");

      await sendRequest(
        "http://localhost:5000/api/places/",
        "POST",
        formData,
        {
          Authorization: "Bearer " + authContext.token,
        }
      );

      // Redirect to user's places page after successful creation
      navigate(`/${authContext.userId}/places`);
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={AddPlaceHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          error="Please enter valid text"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          validators={[VALIDATOR_REQUIRE()]}
          error="Please enter valid Description"
          onInput={InputHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          error="Please enter valid Address"
          onInput={InputHandler}
        />
        <ImageUplaod center multiple id="images" onInput={InputHandler}/>
        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
      </form>
    </>
  );
};

export default NewPlace;
