import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditForm() {
  const { id, formId } = useParams(); // id = userId, formId = form to edit
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    department: "",
    hobbies: [],
    dob: "",
    remarks:"",
    file: null,
  });

  const [preview, setPreview] = useState(null);

  

  // Fetch existing form data
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/forms/${formId}`);
        const data = await response.json();

        setFormData({
          name: data.name || "",
          email: data.email || "",
          gender: data.gender || "",
          department: data.department || "",
          hobbies: data.hobbies ? data.hobbies.split(", ") : [],
          dob: data.dob || "",
          remarks: data.remarks || "",
          file: null,
        });

        if (data.fileData) {
          setPreview(`data:${data.fileType};base64,${data.fileData}`);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        alert("Failed to load form data.");
      }
    };

    fetchFormData();
  }, [formId]);



  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        hobbies: checked
          ? [...prev.hobbies, value]
          : prev.hobbies.filter((h) => h !== value),
      }));
    } else if (type === "file") {
      setFormData({ ...formData, file: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = new FormData();
    formToSend.append("name", formData.name);
    formToSend.append("email", formData.email);
    formToSend.append("gender", formData.gender);
    formToSend.append("department", formData.department);
    formToSend.append("hobbies", formData.hobbies.join(", "));
    formToSend.append("dob", formData.dob);
    formToSend.append("remarks",formData.remarks);

    if (formData.file) {
      formToSend.append("file", formData.file);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/forms/${formId}`, {
        method: "PUT",
        body: formToSend,
      });

      if (response.ok) {
        alert("Form updated successfully!");
        navigate(`/dashboard/${id}/forms`);
      } else {
        alert("Failed to update form. Try again.");
      }
    } catch (error) {
      console.error("Error updating form:", error);
      alert("Error connecting to backend.");
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate(`/dashboard/${id}/forms`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Edit Form
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
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              rows="4"
            ></textarea>

          </div>

          <div>
            <label className="block text-gray-700 mb-1">Upload File</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover rounded-lg border"
              />
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="w-1/2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Update Form
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
