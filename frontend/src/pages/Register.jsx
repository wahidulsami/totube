import { useForm } from "react-hook-form";
import { registerUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    
    try {
      // convert avatar to FormData
      const formData = { ...data, avatar: data.avatar[0] };
      await registerUser(formData);
      alert("User registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("fullname", { required: "Fullname is required" })}
        placeholder="Fullname"
      />
      {errors.fullname && <p>{errors.fullname.message}</p>}

      <input
        {...register("username", { required: "Username is required" })}
        placeholder="Username"
      />
      {errors.username && <p>{errors.username.message}</p>}

      <input
        type="email"
        {...register("email", { required: "Email is required" })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register("password", { required: "Password is required" })}
        placeholder="Password"
      />
      {errors.password && <p>{errors.password.message}</p>}

      <input
        type="file"
        {...register("avatar", { required: "Avatar is required" })}
      />
      {errors.avatar && <p>{errors.avatar.message}</p>}

      <button type="submit">Register</button>
    </form>
  );
}
