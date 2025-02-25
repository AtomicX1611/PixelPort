import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "Change": {
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value },
        },
      };
    }
    case "SET-DATA": {
      return {
        inputs: action.inputs,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export const useForm = (input) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: input
  });

  const InputHandler = useCallback((id, value) => {
    dispatch({ type: "Change", inputId: id, value: value });
  }, []);

  const setFormState = useCallback((inputData) => {
    console.log("Setting the data : ", inputData);
    dispatch({
      type: "SET-DATA",
      inputs: inputData,
    });
  }, []);

  return [formState, InputHandler, setFormState];
};
