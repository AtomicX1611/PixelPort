import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { useNavigate } from "react-router-dom";

import { VALIDATOR_REQUIRE } from "../../shared/utils/validator.js";
import "./Auth.modern.css";
import { motion } from "framer-motion";
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
    console.log("FormState : ", formState.inputs);
    if (!formState.inputs.email.value || !formState.inputs.password.value) {
      error.message = "Email and Password cannot be empty"
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
        console.log("Logging in user,", response);
        auth.login(response.userId, response.token);
        navigate("/");
      } catch (error) {
        console.log("Some error is occurring : ", error);
      }
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
        auth.login(response.userId, response.token);
        navigate("/");
      } catch (err) {
        console.log("Some ", err);
      }
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
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <motion.div 
        className="authentication"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="authentication-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {loading && <LoadingSpinner asOverlay />}
          <motion.div
            className="auth-header"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
            <p>
              {isLogin 
                ? "Sign in to continue your journey" 
                : "Join our community and share amazing places"
              }
            </p>
          </motion.div>
          
          <motion.form 
            className="auth-form"
            onSubmit={authSubmitHandler}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
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
              <motion.div 
                className="image-upload-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <ImageUplaod
                  center
                  id="image"
                  onInput={InputHandler}
                  errorText="Please provide a profile image"
                />
              </motion.div>
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
          </motion.form>

          <motion.div 
            className="auth-footer"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
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
          </motion.div>
        </motion.div>
      </motion.div>
    </React.Fragment>
  );
};

export default Auth;
