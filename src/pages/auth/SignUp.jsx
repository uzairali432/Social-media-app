import { useForm } from "react-hook-form";
import Form from "../../components/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthContext } from "../../context/AuthContext";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "At least 2 characters long" }),
  surName: z.string().min(2, { message: "At least 2 characters long" }),
  date: z.string().min(1, { message: "Required" }),
  month: z.string().min(1, { message: "Required" }),
  year: z.string().min(1, { message: "Required" }),
  gender: z.string().min(1, { message: "Please select gender" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .regex(/(?=.*?[A-Z])/, { message: "At least one upper case letter" })
    .regex(/(?=.*?[a-z])/, { message: "At least one lower case letter" })
    .regex(/(?=.*?[0-9])/, { message: "At least one digit" })
    .regex(/(?=.*?[#?!@$%^&*-])/, { message: "At least one special character" })
    .regex(/.{8,}/, { message: "Minimum 8 characters required" }),
});

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
      years: "",
      gender: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f2f5]">
      <h1 className="text-[#0866ff] text-6xl font-bold mb-4">facebook</h1>
      <Form handleSubmit={handleSubmit} register={register} errors={errors} dispatch={dispatch} />
    </div>
  );
};

export default SignUp;
