"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
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
  const [name, setName] = useState<string>(user?.name || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.image || avatars[0]);
  const [isSaving, setIsSaving] = useState(false);

  const [initialData, setInitialData] = useState({
    username: user?.name || "",
    phone: user?.phone || "",
    image: user?.image || avatars[0],
  });
  

  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบก่อนที่จะทำการอัปเดตข้อมูล",
        icon: "warning",
        confirmButtonText: "ตกลง",
      }).then(() => {
        router.push('/login');
      });
      return;
    }

    setInitialData({
      name: user.name,
      phone: user.phone,
      image: user.image,
    });
    setName(user.name);
    setPhone(user.phone);
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
    setName(initialData.name);
    setPhone(initialData.phone);
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
      name !== initialData.name ||
      phone !== initialData.phone ||
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
      const response = await fetch("/api/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(name !== initialData.name && { name: name }),
          ...(phone !== initialData.phone && { phone }),
          ...(password && { password }),
          ...(selectedAvatar !== initialData.image && { image: selectedAvatar }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ไม่สามารถอัปเดตโปรไฟล์ได้");
      }

      updateUser({
        ...user,
        name: name !== initialData.name ? name : user.name,
        phone: phone !== initialData.phone ? phone : user.phone,
        image:
          selectedAvatar !== initialData.image ? selectedAvatar : user.image,
      });

      setIsSaving(false);
      setIsEditing(false);
      setInitialData({ name: name, phone, image: selectedAvatar });

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
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-6">
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
            <div className="avatar-selection grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
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
              <strong>ชื่อ:</strong> {name}
            </p>
            <p className="text-gray-600">
              <strong>เบอร์โทร:</strong> {phone}
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
              <label className="block text-gray-700" htmlFor="name">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700" htmlFor="phone">
                เบอร์โทร
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                className="text-gray-500 hover:text-gray-700"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300 ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
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
