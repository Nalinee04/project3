"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "@/hooks/use-toast";

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State to handle loading
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      const response = await fetch("/api/loginadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      // บันทึก Token ลงใน localStorage
      localStorage.setItem('token', data.token);
      
      toast({
        title: "Login Successful",
        description: `Logged in successfully at ${new Date().toLocaleString()}`,
      });
      router.push("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: `Error: ${error instanceof Error ? error.message : "Unknown error"} at ${new Date().toLocaleString()}`,
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4" style={{ backgroundColor: "#1E1E1E" }}>
      <div className="w-[1100px] h-[600px] bg-white rounded-lg shadow-md flex">
        {/* Left side: Logo */}
        <div className="w-1/2 p-4 flex justify-start items-center">
          <Image
            src="/images/logo.png"
            alt="Shop Logo"
            width={500}
            height={500}
            className="object-contain ml-6 animate-slide" // Adjust the logo class for animation
          />
        </div>

        {/* Right side: Login form */}
        <div className="w-1/2 p-2 flex flex-col items-center -ml-4">
          <Image
            src="/images/logo food.png"
            alt="User Icon"
            width={250}
            height={250}
            className="mb-6"
          />

          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative mt-1">
              <FontAwesomeIcon icon={faCircleUser} className="w-[10%] h-[30px] text-gray-500 absolute left-2 top-2.5 ml-6" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[90%] h-[50px] pl-14 p-3 border border-gray-300 rounded-lg mb-4 ml-8 text-2xl"
              />
            </div>

            <div className="relative mt-4">
              <FontAwesomeIcon icon={faLock} className="w-[10%] h-[30px] text-gray-500 absolute left-2 top-2.5 ml-6" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-14 w-[90%] h-[50px] p-3 border border-gray-300 rounded-lg mb-4 ml-8 text-2xl"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-7 top-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className={`mt-16 rounded-xl w-[480px] h-[50px] text-2xl -ml-4 flex items-center justify-center transition-transform duration-200 ease-in-out transform hover:scale-105 ${
                  loading ? "opacity-50" : ""
                }`}
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  // Spinner icon without text
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0115.959 0A8 8 0 014 12z"
                    />
                  </svg>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
