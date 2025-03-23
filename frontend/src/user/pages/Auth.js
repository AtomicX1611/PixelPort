import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { useNavigate } from "react-router-dom";

import { VALIDATOR_REQUIRE } from "../../shared/utils/validator.js";
import "./Auth.css";
import Card from "../../shared/components/UiElements/Card.js";
import Button from "../../shared/components/UiElements/Button.js";
import { useForm } from "../../shared/hooks/form-hook.js";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UiElements/ErrorModal.js";
import LoadingSpinner from "../../shared/components/UiElements/LoadingSpinner.js";
import useHttpClient from "../../shared/hooks/http-hook.js";
import ImageUplaod from "../../shared/components/FormElements/ImageUpload.js";

const Auth = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setisLogin] = useState(false);
  const { loading, error, sendRequest, clearError } = useHttpClient();

  const [formState, InputHandler, setFormState] = useForm({
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  });

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("FormState : ", formState.inputs);
    if (!formState.inputs.email.value || !formState.inputs.password.value) {
      error.message = "Email and Password cannot be empty";
      return;
    }

    let response;
    if (isLogin) {
      try {
        response = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(response.user._id);
        navigate("/");
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("image", formState.inputs.image.value);
        response = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );
        console.log("navigating uesr");
        auth.login(response.user._id);
        navigate("/");
      } catch (err) {
        console.log("Some ", err);
      }
    }
  };
  const switchModeHandler = () => {
    if (isLogin) {
      setFormState({
        ...formState.inputs,
        name: {
          value: undefined,
          isValid: false,
        },
        image: undefined,
      });
    } else {
      setFormState({
        ...formState.inputs,
        name: {
          value: "",
          isValid: false,
        },
        image: {
          value: null,
          isValid: false,
        },
      });
    }
    setisLogin((prev) => !prev);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="auth-card">
        {loading && <LoadingSpinner asOverlay />}
        <h2>{isLogin ? "LOGIN" : "SIGNUP"}</h2>
        {!isLogin && (
          <Input
            id="name"
            type="text"
            label="UserName"
            element="input"
            onInput={InputHandler}
            validators={[VALIDATOR_REQUIRE()]}
          />
        )}
        <form onSubmit={authSubmitHandler}>
          <Input
            id="email"
            type="text"
            label="Email"
            element="input"
            onInput={InputHandler}
            validators={[VALIDATOR_REQUIRE()]}
          />
          {!isLogin && <ImageUplaod center id="image" onInput={InputHandler} />}
          <Input
            id="password"
            type="text"
            label="Password"
            element="input"
            onInput={InputHandler}
            validators={[VALIDATOR_REQUIRE()]}
          />
          <Button type="submit" className="customButton">
            {isLogin ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler} className="customButton">
          SWITCH TO {!isLogin ? "LOGIN" : "SIGNUP"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
