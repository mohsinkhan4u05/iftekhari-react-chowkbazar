// components/UserMenu.tsx
import { useSession, signOut } from "next-auth/react";
import { Menu } from "@headlessui/react";
import { Fragment } from "react";
import UserIcon from "@components/icons/user-icon";
import EmailIcon from "@components/icons/email-icon";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="relative inline-block text-left">
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-2">
          <img
            src={session.user.image || "/default-avatar.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full border border-gray-300"
          />
          <span className="hidden md:inline text-sm font-medium">
            {session.user.name}
          </span>
        </Menu.Button>

        <Menu.Items
          className="absolute right-0 
             mb-2 bottom-full 
             md:mt-2 md:top-full md:bottom-auto
             w-56 origin-top-right 
             rounded-md bg-white shadow-lg 
             ring-1 ring-black ring-opacity-5 
             focus:outline-none z-50"
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <UserIcon />
              <p className="text-sm font-medium text-gray-900">
                {session.user.name}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700 mt-1">
              <EmailIcon />
              <span>{session.user.email}</span>
            </div>
          </div>

          <hr />
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => signOut()}
                className={`${
                  active ? "bg-gray-100" : ""
                } w-full text-left px-4 py-2 text-sm text-gray-700`}
              >
                🔒 Logout
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
}
