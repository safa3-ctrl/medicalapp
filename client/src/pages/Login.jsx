import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Button from "../components/Button";
import Input from "../components/Input";
import { hideLoading, showLoading } from "../redux/alertsSlice";

const schema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("http://localhost:5000/api/user/login", data);
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        navigate("/dashboard", { state: { loginSuccess: true } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(hideLoading());
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="bg-primary flex flex-col items-center justify-center p-8 min-h-[100vh]">
      <div className="w-full bg-white rounded-lg shadow-sm sm:max-w-md p-8">
        <h1 className="text-xl font-medium text-primary">Create an account</h1>

        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="email"
            {...register("email")}
            error={errors?.email?.message}
          />
          <Input
            label="password"
            type="password"
            {...register("password")}
            error={errors?.password?.message}
          />
          <div className="grid grid-cols-1">
            <Button type="submit">LOGIN</Button>
            <div className="mt-4 text-center text-gray-500">
              Already have an account?{" "}
              <Link to="/Register" className="text-primary hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </form>
        <Toaster />
      </div>
    </div>
  );
}

export default Login;
