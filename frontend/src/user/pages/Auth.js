import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { useNavigate } from "react-router-dom";

import { VALIDATOR_REQUIRE } from "../../shared/utils/validator.js";
import "./Auth.modern.css";
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
    name: {
      value: "",
      isValid: true
    },
    image: {
      value: null,
      isValid: true
    }
  });

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (!formState.inputs.email.value || !formState.inputs.password.value) {
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
        auth.login(response.userId, response.token);
        navigate("/");
      } catch (error) {}
    } else {
      try {
        if (!formState.inputs.image.value) {
          return;
        }
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
        auth.login(response.userId, response.token);
        navigate("/");
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLogin) {
      // Switching to login mode
      setFormState({
        email: {
          value: formState.inputs.email.value,
          isValid: formState.inputs.email.isValid
        },
        password: {
          value: formState.inputs.password.value,
          isValid: formState.inputs.password.isValid
        },
        name: {
          value: "",
          isValid: true
        },
        image: {
          value: null,
          isValid: true
        }
      });
    } else {
      // Switching to signup mode
      setFormState({
        email: {
          value: formState.inputs.email.value,
          isValid: formState.inputs.email.isValid
        },
        password: {
          value: formState.inputs.password.value,
          isValid: formState.inputs.password.isValid
        },
        name: {
          value: "",
          isValid: false
        },
        image: {
          value: null,
          isValid: false
        }
      });
    }
    setisLogin((prev) => !prev);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className="authentication">
        <div className="authentication-container">
          {loading && <LoadingSpinner asOverlay />}
          <div className="auth-header">
            <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
            <p>
              {isLogin 
                ? "Sign in to continue your journey" 
                : "Join our community and share amazing places"
              }
            </p>
          </div>
          
          <form 
            className="auth-form"
            onSubmit={authSubmitHandler}
          >
            {!isLogin && (
              <div className="form-control">
                <Input
                  id="name"
                  type="text"
                  label="Full Name"
                  element="input"
                  placeholder="Enter your full name"
                  onInput={InputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your name"
                />
              </div>
            )}
            
            <div className="form-control">
              <Input
                id="email"
                type="email"
                label="Email Address"
                element="input"
                placeholder="Enter your email"
                onInput={InputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid email"
              />
            </div>
            
            {!isLogin && (
              <div className="image-upload-container">
                <ImageUplaod
                  center
                  id="image"
                  onInput={InputHandler}
                  errorText="Please provide a profile image"
                />
              </div>
            )}
            
            <div className="form-control">
              <Input
                id="password"
                type="password"
                label="Password"
                element="input"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                onInput={InputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid password"
              />
            </div>

            <Button 
              type="submit" 
              disabled={!formState.isValid}
              className="submit-button"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="auth-footer">
            <Button
              type="button"
              onClick={switchModeHandler}
              className="switch-mode"
              inverse
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
