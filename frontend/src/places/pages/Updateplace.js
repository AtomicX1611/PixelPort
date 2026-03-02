import { useContext, useEffect, useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../shared/components/UiElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import useHttpClient from "../../shared/hooks/http-hook.js";
import { AuthContext } from "../../context/AuthContext.js";

const UpdatePlace = () => {
  const placeId = useParams().pid;
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [place, setPlace] = useState();

  const [formState, InputHandler, setFormState] = useForm({
    title: { value: "", isValid: false },
    description: { value: "", isValid: false },
  });

  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setFormState({
          title: { value: responseData.message.title, isValid: true },
          description: { value: responseData.message.desc, isValid: true },
        });
        setPlace(responseData.message);
      } catch (error) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormState]);

  if (!place) {
    return <h2>No Place Found.Maybe Add one?</h2>;
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
          Authorization : "Bearer " + auth.token
        }
      );
      navigate("/" + auth.userId + "/places");
    } catch (error) {}
  };

  return (
    <>
      {place && (
        <form className="form-place" onSubmit={submitHandler}>
          <Input
            id="title"
            element="input"
            onInput={InputHandler}
            label="Title"
            type="text"
            value={place.title}
            validators={[]}
          ></Input>
          <Input
            id="description"
            element="input"
            onInput={InputHandler}
            label="Description"
            type="text"
            value={place.desc}
            validators={[]}
          ></Input>
          <Button type="submit">UPDATE PLACE</Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
