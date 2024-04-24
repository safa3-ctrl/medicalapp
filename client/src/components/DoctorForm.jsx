import Label from "./Label";
import Button from "./Button";
import Input from "./Input";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import PhoneNumberInput from "./PhoneNumber";
const schema = yup
  .object()
  .shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phoneNumber: yup.mixed().nullable(),
    website: yup.string().url().required(),
    experience: yup.number().required(),
    address: yup.string().required(),
    specialization: yup.string().required(),
    startTime: yup.string().required(),
    endTime: yup.string().required(),
  })
  .required();

function DoctorForm({ initialValues }) {
  const { user } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/apply-doctor-account",
        {
          ...data,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-8">
        <h1 className="text-xl font-semibold text-gray-700 mt-4">
          Personal Information
        </h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col mb-2">
            <Input
              label="Firstname"
              placeholder="Firstname"
              {...register("firstName")}
              error={errors?.firstName?.message}
            />
          </div>
          <div className="flex flex-col mb-2">
            <Input
              label="Lastname"
              placeholder="Lastname"
              {...register("lastName")}
              error={errors?.lastName?.message}
            />
          </div>
          <div className="flex flex-col mb-2">
            <PhoneNumberInput
              label="phone number"
              control={control}
              {...register("phoneNumber")}
              error={errors?.phoneNumber?.message}
            />
          </div>
          <div className="flex flex-col mb-2">
            <Input
              label="Website"
              placeholder="Website"
              {...register("website")}
              error={errors?.website?.message}
            />
          </div>
          <div className="flex flex-col mb-2">
            <Input
              label="Adresse"
              placeholder="Adresse"
              {...register("address")}
              error={errors?.address?.message}
            />
          </div>
          <div className="flex flex-col mb-2">
            <Input
              label="Years of experience"
              placeholder="Years of experience"
              {...register("experience")}
              error={errors?.experience?.message}
            />
          </div>
        </div>
        <h1 className="text-xl font-semibold text-gray-700 mt-4">
          Professional Information
        </h1>
        <div className="flex gap-4">
          <Input
            label="Spécialisation"
            placeholder="Spécialisation"
            {...register("specialization")}
            error={errors?.specialization?.message}
          />
          <div>
            <Label htmlFor="timings">Timings</Label>
            <div className="flex items-center gap-2">
              <Input
                {...register("startTime")}
                type="time"
                placeholder="Start Time"
                error={errors?.startTime?.message}
              />
              <Input
                type="time"
                placeholder="End Time"
                {...register("endTime")}
                error={errors?.endTime?.message}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Envoyer</Button>
        </div>
      </form>
      <Toaster />
    </>
  );
}

export default DoctorForm;