import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";

const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    userType: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

const Register = () => {
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
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        data
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-primary flex flex-col items-center justify-center p-8 min-h-[100vh]">
      <div className="w-full h-full bg-white rounded-lg shadow-sm sm:max-w-md p-8">
        <h1 className="text-xl font-medium text-primary">Create an account</h1>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Your name"
            placeholder="name"
            {...register("name")}
            error={errors?.name?.message}
          />
          <Select
            
            label="User type"
            {...register("userType")}
            error={errors?.userType?.message}
            type="text"
            required
            options={[
              {
                label: "Admin",
                value: "isAdmin",
              },
              {
                label: "Doctor",
                value: "isDoctor",
              },
              {
                label: "User",
                value: "isUser",
              },
            ]}
          />
          <Input label="email" {...register("email")}
           error={errors?.email?.message}/>
          <Input
            label="password"
            type="password"
            {...register("password")}
            error={errors?.password?.message}
          />
          <div className="flex flex-col">
            <Button type="submit">REGISTER</Button>
            <div className="mt-4 text-center text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login here
              </Link>
            </div>
          </div>
        </form>
        <Toaster/>
      </div>
    </div>
  );
};
export default Register;
