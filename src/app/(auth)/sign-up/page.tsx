"use client"

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { useDebounceValue } from 'usehooks-ts'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { signUpSchema } from "@/schemas/signUpSchema";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";


const SignUp = () => {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [usernameMessage, setUsernameMessage] = useState('')

  
  
  // Zod form verification
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });
  
  
  const [debouncedUsername, setDebouncedUsername] = useDebounceValue(username, 500)

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        try {
          setIsCheckingUsername(true);
          setUsernameMessage('');
          
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data || error.message);
          } else {
            console.error("Unexpected error:", error);
          }
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [debouncedUsername]);
  


  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {

    setIsSubmitting(true)

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)

      if (response.data.success) {
        toast.success(response.data.message)
        setTimeout(() => {
          router.replace(`/verify/${data.username}`);
        }, 2000);
      } else {
        toast.message('Error', {
          description: response.data.message,
        })
      }
    } catch (error) {
      console.error("Error registering user", error);
      const axiosError = error as AxiosError<ApiResponse>
      toast.message('Sorry!', {
        description: axiosError.response?.data.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full mx-auto border border-slate-700 rounded-none md:rounded-2xl p-4 md:p-8 bg-white dark:bg-black shadow-lg shadow-slate-800">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Maou Messenger
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Sign up now to start connecting anonymously!
        </p>
        <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
          <LabelInputContainer className="mb-4 relative">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="putin01" type="text" {...register('username', { onChange: (e) => setUsername(e.target.value) })} />
            <div className="absolute bottom-0 right-0 text-sm">
              {errors.username && <span className="text-red-500">{errors.username.message}</span>}
              { !errors.username && debouncedUsername &&
                <div className="flex gap-2 items-center">
                  { isCheckingUsername && <span>Loading..</span> }
                  { usernameMessage && <span className="text-green-500">{usernameMessage}</span>}
                </div>
              }
            </div>
          </LabelInputContainer>
          <LabelInputContainer className="mb-4 relative">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="vladimirPutin01@russia.com" type="email" {...register('email')} />
            <div className="absolute bottom-0 right-0 text-sm">
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>
          </LabelInputContainer>
          <LabelInputContainer className="mb-4 relative">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="••••••••" type="password" {...register('password')} />
            <div className="absolute bottom-0 right-0 text-sm">
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>
          </LabelInputContainer>
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600"
            type="submit"
            disabled={isSubmitting}
          >
            Sign up &rarr;
            <BottomGradient />
          </button>
          </form>
      </div>
    </div>
  )
}

export default SignUp



const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
 
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full pb-5", className)}>
      {children}
    </div>
  );
};