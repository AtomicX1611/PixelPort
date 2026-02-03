import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Input from "../../shared/components/FormElements/Input";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../shared/components/UiElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import useHttpClient from "../../shared/hooks/http-hook.js";
import { AuthContext } from "../../context/AuthContext.js";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    desc: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creatorID: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    desc: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creatorID: "u2",
  },
];

const UpdatePlace = () => {
  const placeId = useParams().pid;
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  console.log("Place ID:", placeId);

  const [place, setPlace] = useState();

  const [formState, InputHandler, setFormState] = useForm({
    title: { value: "", isValid: false },
    description: { value: "", isValid: false },
  });

  const { loading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    console.log("Sending Req");
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        console.log("Loggin Data : ", responseData.message);
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
      console.log("Sending Request")
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
    } catch (error) {
      console.log("Error occurred : ", error);
    }
  };

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default UpdatePlace;
