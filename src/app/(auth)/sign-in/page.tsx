"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInSchema } from "@/schemas/signInSchema"
import { cn } from "@/utils/cn"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export default function SignIn() {
  const router = useRouter()

  const { data: session } = useSession()
  if (session) {
    return (
      <div className="mt-14">
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsSubmitting(true)
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      })
      if (result?.error) {
        toast.message("Sorry!", {
          description: result.error,
        })
      }
      setIsSubmitting(false)
      if (result?.url) {
        router.replace("/dashboard")
      }
    } catch (error) {
      toast.message("Sorry!", {
        description: "An unknown error occured",
      })
      setIsSubmitting(false)
    }
  }

  return (
    // Render login form
    <div className="flex items-center justify-center min-h-screen">
      <div className="sm:max-w-md max-sm:mx-2  w-full border border-slate-700 rounded-2xl p-4 md:p-8 bg-white dark:bg-slate-950 shadow-lg shadow-slate-800">
        <h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">
          Login to Maou Messenger
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Enter your details below to continue..
        </p>

        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <LabelInputContainer className="mb-4 relative">
            <Label htmlFor="identifier">Email Address</Label>
            <Input
              placeholder="russia_putin_vladimir@gmail.com"
              type="email"
              {...register("identifier")}
            />
            <div className="absolute bottom-0 right-0 text-sm">
              {errors.identifier && (
                <span className="text-red-500">
                  {errors.identifier.message}
                </span>
              )}
            </div>
          </LabelInputContainer>

          <LabelInputContainer className="mb-4 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              placeholder="••••••••"
              type="password"
              {...register("password")}
            />
            <div className="absolute bottom-0 right-0 text-sm">
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Sign In &rarr;
            <BottomGradient />
          </button>
        </form>
        <div className="text-right my-2">
          <p className="text-sm font-light">
            Don't have an account already?{" "}
            <Link className="text-sky-300 font-semibold" href={"/sign-up"}>
              Register
            </Link>{" "}
            now
          </p>
        </div>
      </div>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full pb-5", className)}>
      {children}
    </div>
  )
}
