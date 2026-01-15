import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../context/AuthContext";

const Login = () => {
  const { dispatch } = useAuthContext()
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {

    try {
      dispatch({
        type: "REGISTER_USER",
        payload: data,
      });
      localStorage.setItem("currUser", JSON.stringify(data));
      if (data.email && data.password) {
        navigate("/home");
      }
    }
    catch (err) {
      console.log(err)
    }
  };
  return (
    <div className="flex flex-row items-center justify-center gap-32 h-screen bg-[#f2f4f7] w-full">
      <div className="flex flex-col">
        <h1 className="text-[#0866ff] font-semibold text-7xl">facebook</h1>
        <p>Facebook helps you connect and share with the people in your life.</p>
      </div>

      <div className="flex flex-col gap-y-3 justify-center shadow-lg rounded-lg bg-white px-6 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", { required: "Email is required" })}
              className={`border ${errors.email ? "border-red-500" : "border-gray-300"
                } w-92 p-3 rounded-md`}
            />
            <div className="h-5">
              {errors.email && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className={`border ${errors.password ? "border-red-500" : "border-gray-300"
                } w-92 p-3 rounded-md`}
            />
            <div className="h-5">
              {errors.password && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-92 p-3 border rounded-lg bg-[#0866ff] text-white font-semibold text-xl cursor-pointer"
          >
            Log in
          </button>

          <p className="text-center text-[#0866ff] text-sm cursor-pointer">
            Forgotten password?
          </p>
          <div className="w-full bg-slate-200 p-[0.5px] my-2"></div>

          <Link
            to={"/signup"}
            className="bg-[#42b72a] text-white text-lg border rounded-lg py-3 font-bold w-48 px-3 mx-auto block cursor-pointer"
          >
            Create new account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
