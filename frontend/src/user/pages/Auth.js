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
import httpClient from "../../shared/hooks/http-hook.js";
   
const Auth = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setisLogin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setError("Email and Password cannot be empty");
      return;
    }

    let response;
    if (isLogin) {
      try {
        setIsLoading(true);

        const data = httpClient({
          method : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body : JSON.stringify({
            email : formState.inputs.name.value,
            password: formState.inputs.password.value,
          })
        })

        if(data.ok){
          throw new Error(data.message)
        }

        console.log(data);
        auth.login();
        navigate("/");
      } catch (err) {
        console.log("Something went wrong");
        setError(err);
      }
      setIsLoading(false);
    } else {
      try {
        setIsLoading(true);
        response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });

        if (response.ok) {
          throw new Error(response.message);
        }
        const responseData = await response.json();
        console.log("Response:", responseData);
        setIsLoading(false);
        auth.login();
        navigate("/");
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setError(err.message || "Something went wrong");
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

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="auth-card">
        {isLoading && <LoadingSpinner asOverlay />}
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
