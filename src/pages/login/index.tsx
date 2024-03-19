import React, { useState } from 'react';
import { Formik, Field, useFormikContext, FormikHelpers } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack
} from '@chakra-ui/react';

interface FormValues {
  CPF: string;
  saram: string;
}

function applyCpfMask(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

function applySaramMask(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{6})(\d)/, '$1-$2')
    .replace(/(-\d)\d+?$/, '$1');
}

interface CustomInputProps {
  name: keyof FormValues;
  type: string;
  maskFunction: (value: string) => string;
  validate: (value: string) => string | undefined;
  placeholder: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ name, type, maskFunction, validate, placeholder }) => {
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

import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';

// In your sign-in component or function


export default function Login() {
  const [isLoading, setIsloading] = useState<boolean>(false)


  return (
    <Flex bg="gray.100" align="center" justify="center" h="100vh">
      <Box bg="white" p={6} rounded="md" w={400}>
        <Formik
          initialValues={{
            CPF: '',
            saram: '',
          }}
          onSubmit={async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            setIsloading(true)
            //alert(JSON.stringify(values, null, 2));
            const cpf = values.CPF
            const saram = values.saram
            signIn('credentials', { cpf, saram }).then((r) => {
           
              setSubmitting(false);
              setIsloading(false)

            });

            setSubmitting(false);
            setIsloading(false)
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start" w="full">
                <CustomInput
                  name="CPF"
                  type="text"
                  maskFunction={applyCpfMask}
                  validate={(value) => (value && value.replace(/[^\d]/g, '').length !== 11 ? 'O CPF deve conter 11 dígitos.' : undefined)}
                  placeholder="CPF"
                />
                <CustomInput
                  name="saram"
                  type="text"
                  maskFunction={applySaramMask}
                  validate={(value) => (value && value.replace(/[^\d]/g, '').length !== 7 ? 'O Saram deve conter 7 dígitos.' : undefined)}
                  placeholder="Saram"
                />
                <Button type="submit"  isLoading={isLoading} disabled={isLoading} colorScheme="purple" width="full">
                  Login
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
