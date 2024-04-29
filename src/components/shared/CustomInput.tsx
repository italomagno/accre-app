import { FormValues } from "@/types";
import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { useFormikContext } from "formik";
interface CustomInputProps {
  name: keyof FormValues;
  type: string;
  maskFunction: (value: string) => string;
  validate: (value: string) => string | undefined;
  placeholder: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ name, type, maskFunction, validate, placeholder }) => {
  const { setFieldValue, values, errors, touched } = useFormikContext<FormValues>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const maskedValue = maskFunction ? maskFunction(value) : value;
    setFieldValue(name, maskedValue);
  };

  return (
    <FormControl isInvalid={!!errors[name] && !!touched[name]} w="full">
      <FormLabel pb="2" htmlFor={name}>{placeholder}</FormLabel>
      <Input
        w="full"
        id={name}
        name={name}
        type={type}
        onChange={handleChange}
        value={values[name] as string | number | readonly string[] | undefined}
      />
      <FormErrorMessage>{errors[name]}</FormErrorMessage>
    </FormControl>
  );
};