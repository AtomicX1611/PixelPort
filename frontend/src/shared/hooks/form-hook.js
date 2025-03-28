import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "Change": {
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
      };
    }
    case "SET-DATA": {
      return {
        inputs: action.inputs,
        isValid: action.isValid,
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
    inputs: input,
    isValid: false,
  });

  const InputHandler = useCallback(
    (id, value, isValid) => {

      const updatedInputs = {
        ...formState.inputs,
        [id]: { value, isValid },
      };

      let isFormValid = true;
      for (const inputId in updatedInputs) {
        isFormValid = isFormValid && updatedInputs[inputId].isValid;
      }

      dispatch({
        type: "SET-DATA",
        inputs: updatedInputs,
        isValid: isFormValid, 
      });
    },
    [formState.inputs]
  );

  const setFormState = useCallback((inputData) => {
    console.log("Setting the data : ", inputData);
    dispatch({
      type: "SET-DATA",
      inputs: inputData,
    });
  }, []);

  return [formState, InputHandler, setFormState];
};
