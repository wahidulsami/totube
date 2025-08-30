import React, { useState } from "react";
import { User, X } from "lucide-react";

const AvatarField = ({ id, name, register, setValue, error }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue(name, file); // react-hook-form value
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setValue(name, null); // reset form value
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <label
          htmlFor={id}
          className="w-24 h-24 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer overflow-hidden bg-[#1a1a1a]"
        >
          {preview ? (
            <img
              src={preview}
              alt="avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="text-gray-400 w-10 h-10" />
          )}
        </label>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1
             cursor-pointer right-1 bg-black/70
              text-white rounded-full p-1
               hover:bg-black transition"
          >
            <X size={14} />
          </button>
        )}

        <input
          id={id}
          name={name}
          type="file"
          accept="image/*"
          className="hidden"
          {...register(name)}
          onChange={handleFileChange}
        />
      </div>

      {preview ? (
        <p className="text-xs text-gray-400">Click image to replace</p>
      ) : (
        <p className="text-xs text-gray-400">Upload your avatar</p>
      )}

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default AvatarField;
