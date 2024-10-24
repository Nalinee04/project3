"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faLock,
  faEnvelope,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useUser } from "../../components/Usercontext";
import { useRouter } from "next/navigation";

const EditProfilePage = () => {
  const avatars = [
    "/Avatars/avataaars1.png",
    "/Avatars/avataaars2.png",
    "/Avatars/avataaars3.png",
    "/Avatars/avataaars4.png",
    "/Avatars/avataaars6.png",
    "/Avatars/avataaars7.png",
    "/Avatars/avataaars8.png",
    "/Avatars/avataaars9.png",
    "/Avatars/avataaars10.png",
    "/Avatars/avataaars12.png",
    "/Avatars/avataaars13.png",
    "/Avatars/avataaars14.png",
  ];

  const { user, token, updateUser } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.image || avatars[0]
  );
  const [isSaving, setIsSaving] = useState(false);

  const [initialData, setInitialData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    image: user?.image || avatars[0],
  });
  console.log(user);
  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบก่อนที่จะทำการอัปเดตข้อมูล",
        icon: "warning",
        confirmButtonText: "ตกลง",
      }).then(() => {
        router.push('/login');
        console.log(user);
      });
      return;
    }

    setInitialData({
      username: user.username,
      email: user.email,
      image: user.image,
    });
    setUsername(user.username);
    setEmail(user.email);
    setSelectedAvatar(user.image || avatars[0]);
  }, [user]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setUsername(initialData.username);
    setEmail(initialData.email);
    setSelectedAvatar(initialData.image);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบก่อนที่จะทำการอัปเดตข้อมูล",
        icon: "warning",
      });
      return;
    }

    const hasChanges =
      username !== initialData.username ||
      email !== initialData.email ||
      password ||
      selectedAvatar !== initialData.image;

    if (!hasChanges) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลที่ต้องการแก้ไข",
        text: "ไม่มีการเปลี่ยนแปลงข้อมูลใด ๆ",
        icon: "error",
      });
      return;
    }

    if (password && password !== confirmPassword) {
      Swal.fire({
        title: "รหัสผ่านไม่ตรงกัน!",
        text: "กรุณากรอกรหัสผ่านให้ตรงกัน",
        icon: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/editpro", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(username !== initialData.username && { username }),
          ...(email !== initialData.email && { email }),
          ...(password && { password }),
          ...(selectedAvatar !== initialData.image && {
            image: selectedAvatar,
          }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ไม่สามารถอัปเดตโปรไฟล์ได้");
      }

      updateUser({
        ...user,
        username: username !== initialData.username ? username : user.username,
        email: email !== initialData.email ? email : user.email,
        image:
          selectedAvatar !== initialData.image ? selectedAvatar : user.image,
      });

      setIsSaving(false);
      setIsEditing(false);
      setInitialData({ username, email, image: selectedAvatar });

      Swal.fire({
        title: "โปรไฟล์ถูกแก้ไขเรียบร้อย!",
        text: "ข้อมูลของคุณถูกอัปเดตแล้ว",
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating profile", error);
      setIsSaving(false);
      const errorMessage =
        error instanceof Error ? error.message : "ไม่สามารถอัปเดตโปรไฟล์ได้";

      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          แก้ไขโปรไฟล์
        </h2>
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Image
              src={selectedAvatar}
              alt="User Avatar"
              width={120}
              height={120}
              className="object-cover rounded-full shadow-md"
            />
          </div>
        </div>
        {isEditing && (
          <>
            <h3 className="text-center text-lg font-medium text-gray-600">
              เลือก Avatar ของคุณ
            </h3>
            <div className="avatar-selection grid grid-cols-4 gap-4 mb-6">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={`cursor-pointer w-20 h-20 object-cover rounded-full border-2 ${
                    selectedAvatar === avatar
                      ? "border-blue-500"
                      : "border-gray-200"
                  } hover:border-blue-300 transition-all`}
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
          </>
        )}
        {!isEditing ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              <strong>ชื่อ:</strong> {username}
            </p>
            <p className="text-gray-600">
              <strong>อีเมล:</strong> {email}
            </p>
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300"
            >
              แก้ไข
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700" htmlFor="username">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700" htmlFor="email">
                อีเมล
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700" htmlFor="password">
                รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2"
                >
                  <FontAwesomeIcon icon={faLock} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700" htmlFor="confirmPassword">
                ยืนยันรหัสผ่าน
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCancelClick}
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition duration-300"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className={`bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300 ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  "บันทึก"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;
