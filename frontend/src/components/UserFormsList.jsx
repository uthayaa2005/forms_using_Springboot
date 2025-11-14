import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserFormsList() {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams(); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/forms/user/${id}`);
        if (response.ok) {
          const data = await response.json();
          setForms(data);
          setFilteredForms(data);
        } else {
          console.error("Failed to load forms");
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, [id]);

 
  useEffect(() => {
    const filtered = forms.filter((form) =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForms(filtered);
  }, [searchTerm, forms]);

 
  const handleDelete = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/forms/${formId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Form deleted successfully");
        setForms(forms.filter((f) => f.id !== formId));
      } else {
        alert("Failed to delete form");
      }
    } catch (err) {
      console.error("Error deleting form:", err);
    }
  };

 
  const handleEdit = (formId) => {
    navigate(`/dashboard/${id}/forms/edit/${formId}`);
  };

 
  const handleAddForm = () => {
  navigate(`/dashboard/${id}/forms/new`);
};

  
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
    
      localStorage.removeItem("user");
      alert("Logged out successfully!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
     
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            My Submitted Forms
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAddForm}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              + Add New Form
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

     
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search form by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

       
        {filteredForms.length === 0 ? (
          <p className="text-center text-gray-600">No forms found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {form.name}
                </h3>
                <p className="text-gray-600">Email: {form.email}</p>
                <p className="text-gray-600">Department: {form.department}</p>
                <p className="text-gray-600">Hobbies: {form.hobbies}</p>
                <p className="text-gray-600">DOB: {form.dob}</p>
                <p className="text-gray-600">Remarks: {form.remarks}</p>
                

                {form.fileData && (
                  <a
                    href={`data:${form.fileType};base64,${form.fileData}`}
                    download={form.fileName}
                    className="text-blue-500 underline block mt-2"
                  >
                     Download File
                  </a>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(form.id)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
