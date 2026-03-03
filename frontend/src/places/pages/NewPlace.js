import Input from "../../shared/components/FormElements/Input.js";
import Button from "../../shared/components/UiElements/Button.js";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./NewPlace.css";
import { useForm } from "../../shared/hooks/form-hook.js";
import { VALIDATOR_REQUIRE } from "../../shared/utils/validator.js";
import useHttpClient from "../../shared/hooks/http-hook.js";
import { AuthContext } from "../../context/AuthContext.js";
import { ToastContext } from "../../context/ToastContext.js";
import ErrorModal from "../../shared/components/UiElements/ErrorModal.js";
import ImageUplaod from "../../shared/components/FormElements/ImageUpload.js";
import PageTransition from "../../shared/components/UiElements/PageTransition.js";

const NewPlace = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
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
        showToast("Please upload at least one image", "warning");
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

      showToast("Place created successfully!", "success");
      navigate(`/${authContext.userId}/places`);
    } catch (error) {
      showToast("Failed to create place", "error");
    }
  };

  return (
    <PageTransition>
      <ErrorModal error={error} onClear={clearError} />
      <div className="new-place-page">
        <div className="new-place-header">
          <h1>Share a New Place</h1>
          <p>Tell the community about an amazing spot you've discovered</p>
        </div>
        <form className="place-form" onSubmit={AddPlaceHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            placeholder="e.g. Eiffel Tower"
            error="Please enter valid text"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={InputHandler}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            placeholder="Describe what makes this place special..."
            validators={[VALIDATOR_REQUIRE()]}
            error="Please enter valid Description"
            onInput={InputHandler}
          />
          <Input
            id="address"
            element="input"
            type="text"
            label="Address"
            placeholder="e.g. Champ de Mars, 5 Av. Anatole France, Paris"
            validators={[VALIDATOR_REQUIRE()]}
            error="Please enter valid Address"
            onInput={InputHandler}
          />
          <ImageUplaod center multiple id="images" onInput={InputHandler}/>
          <Button type="submit" disabled={!formState.isValid}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Publish Place
          </Button>
        </form>
      </div>
    </PageTransition>
  );
};

export default NewPlace;
