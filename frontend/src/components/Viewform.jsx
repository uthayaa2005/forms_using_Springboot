import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Viewform() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/forms/all");
        if (res.ok) {
          const data = await res.json();
          setForms(data);
        } else {
          console.error("Failed to fetch forms");
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    fetchForms();
  }, []);

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

  const handleView = (form) => {
    setSelectedForm(form);
  };

  const closeModal = () => {
    setSelectedForm(null);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("admin");
      navigate("/login");
    }
  };

  const filteredForms = forms.filter((form) =>
    form.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const handleDownload = async (fileUrl, fileName) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "downloaded-file";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
     
      <div className="absolute top-6 right-8">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🧾 All Submitted Forms (Admin Access)
        </h1>

       
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by Name..."
            className="border border-gray-400 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredForms.length === 0 ? (
          <p className="text-center text-gray-600">No forms found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-xl border border-gray-200 shadow p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {form.name}
                </h3>
                <p className="text-gray-600">Email: {form.email}</p>
                <p className="text-gray-600">Department: {form.department}</p>
                

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleView(form)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                  >
                    View
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

  
{selectedForm && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg relative overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {selectedForm.name}'s Details
      </h2>

     <div className="space-y-2">
  <p><strong>Name:</strong> {selectedForm.name}</p>
  <p><strong>Email:</strong> {selectedForm.email}</p>
  <p><strong>Department:</strong> {selectedForm.department}</p>
  <p><strong>Gender:</strong> {selectedForm.gender}</p>
  <p><strong>Hobbies:</strong> {selectedForm.hobbies}</p>
  <p><strong>Date of Birth:</strong> {selectedForm.dob}</p>

 
  {selectedForm.fileData ? (
    <div className="mt-3">
      <p className="font-semibold text-gray-700 mb-1">Uploaded File:</p>

      
      {selectedForm.fileType && selectedForm.fileType.startsWith("image/") ? (
        <img
          src={`data:${selectedForm.fileType};base64,${selectedForm.fileData}`}
          alt={selectedForm.fileName}
          className="w-48 h-48 object-cover rounded-lg border"
        />
      ) : (
        <p className="text-gray-600">📄 {selectedForm.fileName}</p>
      )}

      <button
        onClick={() => {
          const link = document.createElement("a");
          link.href = `data:${selectedForm.fileType};base64,${selectedForm.fileData}`;
          link.download = selectedForm.fileName || "downloaded-file";
          link.click();
        }}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        
        Download
      </button>
    </div>
  ) : (
    <p className="text-gray-500">No file uploaded</p>
  )}
</div>


      <button
        onClick={closeModal}
        className="mt-6 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg w-full"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}
