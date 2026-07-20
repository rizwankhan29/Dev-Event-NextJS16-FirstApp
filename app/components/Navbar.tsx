// "use client";
import Link from "next/link";
import Image from "next/image";
// import { Terminal } from "lucide-react";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image
            src="/icons/logo.png"
            alt="Logo"
            width={24}
            height={24}
            className="object-contain block shrink-0"
          />
          {/* <Terminal className="w-6 h-6 text-primary shrink-0" /> */}
          <p>DevEvent</p>
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/">Events</Link>
          <Link href="/">Create Event</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
