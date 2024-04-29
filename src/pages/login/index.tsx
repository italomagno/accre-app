import React, { useMemo, useState } from 'react';
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





import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { FormValues } from '@/types';
import { CustomInput } from '@/components/shared/CustomInput';

// In your sign-in component or function


export default function Login() {
  const [isSubmitting,setIsSubmitting] =useState(false)
// eslint-disable-next-line react-hooks/exhaustive-deps
async function handleSubmit (values: FormValues, { setSubmitting}: FormikHelpers<FormValues>){
  setIsSubmitting(true)
  const cpf = values.CPF
  const saram = values.saram
  signIn('credentials', { cpf, saram }).then((r) => {
    setTimeout(() => {
    setSubmitting(false);
    }, 2000);
  });
  setTimeout(() => {
    setSubmitting(false);
    }, 4000);
}
  const memoizedForm = useMemo(()=>(
    <Formik
    initialValues={{
      CPF: '',
      saram: '',
    }}
    onSubmit={handleSubmit}
  >
    {({ handleSubmit}) => {
      return (
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
          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} colorScheme="purple" width="full">
           { isSubmitting ? "carregando " : "Login" }
          </Button>
        </VStack>
      </form>
    )}}
  </Formik>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ),[handleSubmit])

  return (
    <Flex bg="gray.100" align="center" justify="center" h="100vh">
      <Box bg="white" p={6} rounded="md" w={400}>
       {memoizedForm}
      </Box>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (session) {
    return {
      redirect: {
        destination: '/lancamento',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
