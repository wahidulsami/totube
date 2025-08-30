import { AlertCircle } from "lucide-react";

const InputField = ({
  id,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  register,
  rules,
  error,
}) => (
  <div className="space-y-1">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-white mb-2"
    >
      {placeholder}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
className={`h-12 w-full rounded-lg bg-[#141414]
  px-4 pl-12 text-white placeholder:text-gray-500
  border-1 transition-all duration-200
  ${error 
    ? "border-red-500 ring-2 ring-red-500/50 focus:ring-red-500/50"
    : "border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
  } focus:outline-none`}

      />
    </div>
    {error && (
      <div
        id={`${id}-error`}
        className="flex items-center gap-2 text-red-400 text-sm animate-pulse"
      >
        <AlertCircle className="h-3 w-3" />
        {error.message}
      </div>
    )}
  </div>
);

export default InputField; 
