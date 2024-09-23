import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className=" py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-bold">Food Thai</h2>
          <p className="text-sm">© 2024 All rights reserved.</p>
        </div>

        <div className="flex space-x-6">
          <Link href="#" className="text-sm hover:text-gray-400">
            About Us
          </Link>
          <Link href="#" className="text-sm hover:text-gray-400">
            Services
          </Link>
          <Link href="#" className="text-sm hover:text-gray-400">
            Contact
          </Link>
          <Link href="#" className="text-sm hover:text-gray-400">
            Privacy Policy
          </Link>
        </div>

        <div className="flex space-x-4 mt-6 md:mt-0">
          <Link href="#" className="hover:text-gray-400">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-gray-400">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-gray-400">
            <Twitter className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
