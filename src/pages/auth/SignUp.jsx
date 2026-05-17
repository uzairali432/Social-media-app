import { useForm } from "react-hook-form";
import Form from "../../components/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "../../context/AuthContext";
import { signupSchema } from "../../validation/authSchemas";

const SignUp = () => {

  const { dispatch } = useAuthContext()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      firstName: "",
      surName: "",
      date: "",
      month: "",
      year: "",
      gender: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
    resolver: zodResolver(signupSchema),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f2f5]">
      <h1 className="text-[#0866ff] text-6xl font-bold mb-4">facebook</h1>
      <Form handleSubmit={handleSubmit} register={register} errors={errors} dispatch={dispatch} />
    </div>
  );
};

export default SignUp;
