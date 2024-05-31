
"use client";


import { signIn } from 'next-auth/react';

import { LoginComponent } from '@/components/logincomponent';
import styles from "@/components/login.module.css"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormValues, schema } from '@/types';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { createStandaloneToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';



export function LoginPageComponent() {
  const { toast } = createStandaloneToast();
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { handleSubmit, register,formState: { errors} } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
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
   async function handleSubmitForm (values: FormValues){
    setIsSubmitted(true);
    const cpf = values.CPF
    const saram = values.saram
    const response = await signIn('credentials', { cpf, saram,redirect:false })
    if (response && response.ok === false) {
      toast({
      title: 'Pau no login!',
      description: "Verifique seu CPF ou Saram.",
      status: 'error',
      duration: 3000,
      isClosable: true,
      })
    }
    if (response && response.ok === true) {
      toast({
      title: 'Login realizado com sucesso!',
      description: "Aguarde redirecionamento.",
      status: 'success',
      duration: 3000,
      isClosable: true,
      })
        router.push('/lancamento')
    }
   
    setTimeout(() => {
      handleFinishSubmit()
    }, 3000);
}
function handleFinishSubmit(){
  setIsSubmitted(false);
}

  const onSubmit = (data:FormValues) => {
    handleSubmitForm(data);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>,maskFunction: (value: string) => string) => {
    const value = e.target.value;
    const maskedValue = maskFunction ? maskFunction(value) : value;
    e.target.value = maskedValue;
    return e;
  };

  return (
    <LoginComponent>
        <form onSubmit={handleSubmit(onSubmit)} className={`${styles.formStyle}`}>
        <div>
                <Label className={`${styles.Label}`} htmlFor="CPF">CPF</Label>
                <Input className={`${styles.Input}`}   type="text" {...register('CPF',{onChange(event) {
                  return handleChange(event, applyCpfMask)
                },})}/>
            {errors.CPF && <div className={styles.TextError}>{errors.CPF.message as string}</div>}

          </div>
        <div>

                <Label className={`${styles.Label}`} htmlFor="saram">saram</Label>
                <Input className={`${styles.Input}`}   type="text"  {...register('saram',{onChange(event) {
                  return handleChange(event, applySaramMask)
                },})}/>
            {errors.saram && <div className={styles.TextError}>{errors.saram.message as string}</div>}

              </div>

              <Button className={styles.Button} type="submit" disabled={isSubmitted}>
                  {isSubmitted ? "carregando ... " : "Login"}
              </Button>
          </form>
    </LoginComponent>
  )
}

