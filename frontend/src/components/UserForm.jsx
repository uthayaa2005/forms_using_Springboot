import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    department: "",
    hobbies: [],
    dob: "",
    file: null,
  });

  const { id } = useParams(); // userId from route
  const navigate = useNavigate();
  const [error,setError] = useState(null);

  const [numberField,setNumberField] = useState("");
  

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const inputValue = e.target.value;

    if (/^\d*$/.test(value)) {
      setFormData(inputValue);
      setError("");
    }else{
      setError("give me the numbers only");
    }

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        hobbies: checked
          ? [...prev.hobbies, value]
          : prev.hobbies.filter((h) => h !== value),
      }));
    } else if (type === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = new FormData();
    formToSend.append("name", formData.name);
    formToSend.append("email", formData.email);
    formToSend.append("gender", formData.gender);
    formToSend.append("department", formData.department);
    formToSend.append("hobbies", formData.hobbies.join(", "));
    formToSend.append("dob", formData.dob);
    formToSend.append("remarks", formData.remarks);
    formToSend.append("userId", id); 


    if(!/^\d*$/.test(numberField)){
      setError("give the numbers only");
      return;
    }

    setError("");

    if (formData.file) {
      formToSend.append("file", formData.file);
    }

    try {
      const response = await fetch("http://localhost:8080/api/forms/create", {
        method: "POST",
        body: formToSend,
      });

      if (response.ok) {
        alert("Form submitted successfully!");
      
        navigate(`/dashboard/${id}/forms`);
      } else {
        alert("Failed to submit form. Try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error connecting to backend.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          User Form
        </h2>

        <div className="grid gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Gender</label>
            <div className="flex space-x-4">
              {["Male", "Female"].map((g) => (
                <label key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    onChange={handleChange}
                    checked={formData.gender === g}
                  />
                  <span className="ml-1">{g}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Hobbies</label>
            <div className="flex flex-wrap gap-4">
              {["Cricket", "Music", "Coding", "Travel"].map((hobby) => (
                <label key={hobby}>
                  <input
                    type="checkbox"
                    value={hobby}
                    checked={formData.hobbies.includes(hobby)}
                    onChange={handleChange}
                  />
                  <span className="ml-1">{hobby}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Remarks</label>
            <textarea
              name="remarks"
              value={numberField}
              onChange={(e) =>
                setNumberField(e.target.value)
              }
              placeholder="enter numbers only"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              rows="4"
            />{error && <p className="text-red-500">{error}</p>}

          </div>

          <div>
            <label className="block text-gray-700 mb-1">Upload File</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
