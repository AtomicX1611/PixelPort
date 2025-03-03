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
        response = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            name: formState.inputs.name.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(response.user._id);
        navigate("/");
      } catch (err) {}
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
      });
    } else {
      setFormState({
        ...formState.inputs,
        name: {
          value: "",
          isValid: true,
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
          <Input
            id="password"
            type="text"
            label="Password"
            element="input"
            onInput={InputHandler}
            validators={[VALIDATOR_REQUIRE()]}
          />
          <Button type="submit" className="customButton"   disabled={!formState.isValid}>
            {isLogin ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler} className="customButton" >
          SWITCH TO {!isLogin ? "LOGIN" : "SIGNUP"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
