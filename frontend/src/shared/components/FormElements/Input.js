import React, { useEffect } from "react";
import { useReducer } from "react";
import {validate} from "../../utils/validator.js";  

import "./Input.css";

const InputReducer = (state, action) => {
  switch (action.type) {
    case "change":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators), 
      };
      case "TOUCH": 
      return {
        ...state,
        isTouched : true,
      }
    default:
      return state;
  }
};



const Input = (props) => {
  const [inpt, dispatch] = useReducer(InputReducer, {
    value: props.value || "",
    isTouched : false,
    isValid: false,
  });

  const { id, onInput } = props;
  const { value } = inpt;

  useEffect(() => {
    onInput(id, value);
  }, [id, value, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "change",
      val: event.target.value,
      validators: props.validators,
    });
  };
  const touchHandler = () => {
    dispatch({
     type : "TOUCH",
     isTouched : true
    })
   }

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={inpt.value}
        onChange={changeHandler}
        onBlur={touchHandler}
      ></input>
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        value={inpt.value}
        onChange={changeHandler}
        onBlur={touchHandler}
      ></textarea>
    );


  return (
    <div className={`form-control ${!inpt.isValid && inpt.isTouched && "form-control--invalid"}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inpt.isValid && inpt.isTouched && <p>{props.error}</p>}
    </div>
  );
};

export default Input;
