import React, { Suspense, useCallback, useEffect } from "react";
import Input from "../../shared/components/FormElements/Input";
import { useParams } from "react-router-dom";
import Button from "../../shared/components/UiElements/Button";
import { useForm } from "../../shared/hooks/form-hook";

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
  
  const [formState,InputHandler,setFormState] = useForm({
      title : {
      value : ""
    },
    description : {
      value : ""
    }
  })


  const checkPlace = DUMMY_PLACES.find((place) => {
    return place.id === placeId;
  });

  useEffect(() => {
    setFormState({
      title : {
        value : checkPlace.title
      },
      description : {
        value : checkPlace.desc
      }
    })
  },[setFormState,checkPlace])

  if (!checkPlace) {
    return <h2>No Place Found.Maybe Add one?</h2>;
  }

  console.log("Rendered + ",formState.inputs.description.value)

  if(!formState.inputs.title.value){
    return(
      <div>
        <h2>
          Loading...
        </h2>
      </div>
    )
  }

  const submitHandler = (e) => {
    e.preventDefault();
  }
  
  return (
    <form className="form-place" onSubmit={submitHandler}>
      <Input
        id="title"
        element="input"
        onInput={InputHandler}
        label="Title"
        type="text"
        value={formState.inputs.title.value}
      ></Input>
      <Input
        id="desc"
        element="input"
        onInput={InputHandler}
        label="Description"
        type="text"
        value={formState.inputs.description.value}
      ></Input>
      <Button type="submit">UPDATE PLACE</Button>
    </form>
  );
};

export default UpdatePlace;
