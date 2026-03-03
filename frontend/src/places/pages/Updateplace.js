import { useContext, useEffect, useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import { useNavigate, useParams, Link } from "react-router-dom";
import Button from "../../shared/components/UiElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import useHttpClient from "../../shared/hooks/http-hook.js";
import { AuthContext } from "../../context/AuthContext.js";
import { ToastContext } from "../../context/ToastContext.js";
import LoadingSpinner from "../../shared/components/UiElements/LoadingSpinner.js";
import ErrorModal from "../../shared/components/UiElements/ErrorModal.js";
import PageTransition from "../../shared/components/UiElements/PageTransition.js";
import "./UpdatePlace.css";

const UpdatePlace = () => {
  const placeId = useParams().pid;
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [place, setPlace] = useState();

  const [formState, InputHandler, setFormState] = useForm({
    title: { value: "", isValid: false },
    description: { value: "", isValid: false },
  });

  const { loading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        const placeData = responseData.place || responseData.message;
        setFormState({
          title: { value: placeData.title, isValid: true },
          description: { value: placeData.desc, isValid: true },
        });
        setPlace(placeData);
      } catch (error) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormState]);

  if (loading) {
    return (
      <div className="update-place-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (!place && !loading) {
    return (
      <PageTransition>
        <div className="update-place-not-found">
          <div className="update-place-not-found__icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>Place Not Found</h2>
          <p>The place you're looking for doesn't exist or was removed.</p>
          <Link to="/places/new" className="btn-primary">Create a New Place</Link>
        </div>
      </PageTransition>
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          desc: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      showToast("Place updated successfully!", "success");
      navigate("/" + auth.userId + "/places");
    } catch (error) {
      showToast("Failed to update place", "error");
    }
  };

  return (
    <PageTransition>
      <ErrorModal error={error} onClear={clearError} />
      <div className="update-place-page">
        <div className="update-place-header">
          <h1>Edit Place</h1>
          <p>Update details for "{place?.title}"</p>
        </div>
        {place && (
          <form className="place-form" onSubmit={submitHandler}>
            <Input
              id="title"
              element="input"
              onInput={InputHandler}
              label="Title"
              placeholder="Place name"
              type="text"
              value={place.title}
              validators={[]}
            />
            <Input
              id="description"
              element="textarea"
              onInput={InputHandler}
              label="Description"
              placeholder="Describe the place..."
              type="text"
              value={place.desc}
              validators={[]}
            />
            <div className="update-place-actions">
              <Button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </Button>
              <Button type="button" inverse onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </PageTransition>
  );
};

export default UpdatePlace;
