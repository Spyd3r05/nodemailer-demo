"use client";

import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  //handle change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, message: e.target.value });
  };
  //handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", message: "" }); //clear form
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mx-auto max-w-[500px] mt-10 border border-gray-200 p-4 rounded-lg"
      >
        <input
          type="text"
          placeholder="Name"
          className="border border-gray-300 p-2 rounded-lg"
          value={formData.name}
          name="name"
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border border-gray-300 p-2 rounded-lg"
          value={formData.email}
          onChange={handleInputChange}
        />
        <textarea
          name="message"
          placeholder="Enter message"
          className="border border-gray-300 p-2 rounded-lg"
          value={formData.message}
          onChange={handleTextareaChange}
        ></textarea>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 cursor-pointer rounded-lg"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send"}
        </button>

        {status === "success" && (
          <p className="text-green-500">Message sent successfully</p>
        )}
        {status === "error" && (
          <p className="text-red-500">Failed to send message</p>
        )}
      </form>
    </>
  );
};

export default ContactPage;
