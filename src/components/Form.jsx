import { months } from "../constant";
import { Link, useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";

const Form = ({ handleSubmit, register, errors, dispatch }) => {
  const navigate = useNavigate();

  const submitForm = (data) => {
    dispatch({
      type: "REGISTER_USER",
      payload: data,
    });
    localStorage.setItem("currUser", JSON.stringify(data));
    if (data.email && data.password) {
      navigate("/home");
    }
  };
  return (
    <div>
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-[420px]"
        onSubmit={handleSubmit(submitForm)}
      >
        <h2 className="text-2xl font-bold text-center">Create a new account</h2>
        <p className="text-gray-600 text-center text-sm mb-3">
          It's quick and easy.
        </p>
        <div className="border-b border-gray-300 mb-4"></div>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="First name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className={`border ${
                  errors.firstName ? "border-red-500 pr-10" : "border-gray-300"
                } rounded-md p-2 text-sm focus:outline-black-500 w-full`}
              />
              {errors.firstName && (
                <ErrorIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none" />
              )}
            </div>
            <div className="h-4">
              {errors.firstName && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Surname"
                {...register("surName", { required: "Surname is required" })}
                className={`border ${
                  errors.surName ? "border-red-500 pr-10" : "border-gray-300"
                } rounded-md p-2 text-sm focus:outline-black-500 w-full`}
              />
              {errors.surName && (
                <ErrorIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none" />
              )}
            </div>
            <div className="h-4">
              {errors.surName && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.surName.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mb-2">
          <label className="text-xs text-gray-600 flex items-center gap-1 mb-1">
            Date of birth
            <span className="flex items-center justify-center w-3 h-3 bg-gray-400 text-white text-[10px] font-bold rounded-full">
              ?
            </span>
          </label>
          <div className="flex gap-3 mb-1">
            {["date", "month", "year"].map((field, idx) => (
              <select
                key={idx}
                {...register(field, { required: true })}
                className={`border ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 w-1/3 text-sm`}
              >
                {field === "date" && (
                  <>
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </>
                )}
                {field === "month" && (
                  <>
                    <option value="">Month</option>
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </>
                )}
                {field === "year" && (
                  <>
                    <option value="">Year</option>
                    {Array.from(
                      { length: new Date().getFullYear() - 1960 + 1 },
                      (_, i) => 1960 + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </>
                )}
              </select>
            ))}
          </div>
          {(errors.date || errors.month || errors.year) && (
            <p className="text-red-500 text-[10px] mt-1">
              Please fill complete date of birth
            </p>
          )}
        </div>
        <div className="mb-2">
          <label className="text-xs text-gray-600 flex items-center gap-1 mb-1">
            Gender
            <span className="flex items-center justify-center w-3 h-3 bg-gray-400 text-white text-[10px] font-bold rounded-full">
              ?
            </span>
          </label>
          <div className="flex gap-3 mb-1">
            {["Female", "Male", "Custom"].map((g) => (
              <label
                key={g}
                className={`flex justify-between items-center border ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 w-1/3 text-sm`}
              >
                {g}
                <input
                  {...register("gender", {
                    required: "Please select a gender",
                  })}
                  type="radio"
                  name="gender"
                  value={g.toLowerCase()}
                />
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.gender.message}
            </p>
          )}
        </div>
        <div className="mb-2 relative">
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Mobile number or email address"
            className={`border ${
              errors.email ? "border-red-500 pr-10" : "border-gray-300"
            } rounded-md p-2 w-full text-sm focus:outline-black-500`}
          />
          {errors.email && (
            <ErrorIcon className="absolute right-3 top-1/3 -translate-y-1/2 text-red-500 pointer-events-none" />
          )}
          {errors.email && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="mb-2 relative">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            type="password"
            placeholder="New password"
            className={`border ${
              errors.password ? "border-red-500 pr-10" : "border-gray-300"
            } rounded-md p-2 w-full text-sm focus:outline-black-500`}
          />
          {errors.password && (
            <ErrorIcon className="absolute right-3 top-1/3 -translate-y-1/2 text-red-500 pointer-events-none" />
          )}
          {errors.password && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <p className="text-xs text-gray-600 mb-2">
          People who use our service may have uploaded your contact information
          to Facebook.{" "}
          <span className="text-blue-600 cursor-pointer">Learn more.</span>
        </p>
        <p className="text-xs text-gray-600 mb-4">
          By clicking Sign Up, you agree to our{" "}
          <span className="text-blue-600 cursor-pointer">Terms</span>,{" "}
          <span className="text-blue-600 cursor-pointer">Privacy Policy</span>{" "}
          and{" "}
          <span className="text-blue-600 cursor-pointer">Cookies Policy</span>.
        </p>
        <button
          type="submit"
          className="bg-[#42b72a] hover:bg-[#36a420] text-white font-bold py-2 rounded-md text-lg w-1/2 px-14 mx-[25%]"
        >
          Sign Up
        </button>
        <p className="text-center text-blue-600 font-medium mt-3 cursor-pointer">
          <Link to={"/"}>Already have an account?</Link>
        </p>
      </form>
    </div>
  );
};

export default Form;
