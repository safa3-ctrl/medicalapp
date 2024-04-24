import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const schema = yup
  .object()
  .shape({
    doctor: yup.string().required(),
    date: yup.string().required(),
    time: yup.string().required(),
  })
  .required();

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const { user } = useSelector((state) => state.user);

  console.log(user);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getDoctors = async () => {
    try {
      return await axios.get("http://localhost:5000/api/user/get-all-doctors");
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/book-appointment",
        {
          userId: user._id,
          doctorId: data.doctor,
          date: data.date,
          time: data.time,
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
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDoctors()
      .then((res) =>
        setDoctors(
          res?.data?.data?.map((doctor) => ({
            label: doctor.firstName,
            value: doctor._id,
          })) ?? []
        )
      )
      .catch((e) => console.log(e));
  }, []);

  return (
    <form className="p-8 flex flex-col gap-4 " onSubmit={handleSubmit(onSubmit)}>
      <Select
        error={errors?.doctor?.message}
        label="Doctor"
        {...register("doctor")}
        required
        options={[...doctors]}
      />
      <Input
        label="date"
        type="date"
        placeholder="date"
        {...register("date")}
        error={errors?.date?.message}
      />
      <Input
        label="Time"
        type="time"
        placeholder="Time"
        {...register("time")}
        error={errors?.time?.message}
      />

      <div className="flex justify-end">
        <Button type="submit">Envoyer</Button>
      </div>
      <Toaster/>
    </form>
  );
};

export default BookAppointment;
