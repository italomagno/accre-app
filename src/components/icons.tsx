"use client"
import { useTheme } from "next-themes";
import { MdDashboard } from "react-icons/md";

export function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function Spinner() {
  return (
    <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
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
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  const {theme}= useTheme()
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 1200 867"

      className={`${theme === "light"?"text-black":"text-white"} fill-current`}
      {...props}
    >
      <path d="M683 66.1c-1.4.5-9.7 8.2-18.5 16.9l-16 15.9-4.3-1.9c-25.7-11.6-59.2-14.2-87.7-6.8-43.5 11.4-79.3 44.9-93.4 87.4-6.7 20.3-6.4 15.3-6.8 109.6l-.4 85.8H440c-16.5 0-23.3-.9-31-4.2-10.8-4.6-21.5-15.9-26.2-27.6-2.2-5.6-2.3-6.9-2.9-52.2-.6-43.3-.7-47.1-2.8-54.9-8.8-34.1-36.1-60.5-70.2-67.6-9-1.9-27.8-1.9-36.7 0-3.8.8-10 2.6-13.8 4l-6.8 2.6-14.1-14c-7.7-7.6-15-14.4-16.2-15-1.2-.6-4.3-1.1-7-1.1-11.4 0-18.8 12.1-13.7 22.3.9 1.8 6.8 8.5 13.2 14.9l11.6 11.8-3.4 3.7c-1.9 2.1-3.6 4-3.8 4.2-.1.3-5.7-5-12.5-11.6-6.7-6.6-13.3-12.6-14.6-13.3-3.9-2-11.5-1.5-15.7 1-5.9 3.7-8.8 12.1-6.4 18.7.6 1.5 8.4 10.1 17.3 19l16.1 16.2-1.4 5.8c-1.9 7.7-2.7 127.9-1 144.8 7.7 76.2 60.2 141.6 133 165.5 25.4 8.4 39.9 10 88.6 10H456v56h-17.8c-16.7 0-18.2.2-22.3 2.3-8.2 4.3-11.3 15.6-6.2 22.5 4.8 6.4 5.7 6.7 26.9 7l19.4.3V674h-18.9c-17.9 0-19 .1-22.1 2.2-7.2 5-9.5 11.6-6.5 19.4 1.2 3.2 2.9 5.3 5.8 7.2 4 2.7 4.4 2.7 22.9 3l18.8.4V765h-18.4c-19.7 0-22.4.5-26.9 4.8-4.2 4-6 8-6 13.7 0 8 4 13.8 11.5 17 3.3 1.3 22.5 1.5 173 1.5 162.1 0 169.5-.1 173.3-1.9 6.2-2.8 11.5-10.4 11.5-16.6 0-3.2-2.5-9-5.3-12.2-5-5.7-7.5-6.3-26.7-6.3h-17v-69h40.3c30 0 42.8-.4 50.6-1.5 28.6-4.1 56.5-14.7 80.2-30.4l10.4-6.9 14 13.8c7.7 7.6 15 14.3 16.2 14.9 3.2 1.6 10 1.3 13.9-.5 6.6-3.1 10.1-12.8 7.3-20.1-.5-1.5-6.8-8.6-14-15.8-7.1-7.2-12.9-13.4-12.9-13.8 0-.4 2.8-4 6.3-8 3.4-4 7-8.3 8-9.7l1.7-2.4 14.3 14.1c7.8 7.8 15.5 14.6 17 15.2 10.3 3.9 21.7-3.6 21.7-14.2 0-2-.5-4.8-1-6.4-.6-1.5-8.7-10.5-18-19.8l-16.9-17 4.5-10.3c5.3-12.5 9.7-26.8 12.6-41.7 2.1-10.6 2.2-13.7 2.6-87.8l.3-76.7h19.3c18.4 0 19.5-.1 22.6-2.3 4.7-3.1 7.1-6.7 7.7-11.5.7-5.4-2.4-11.8-7.4-15.2-3.5-2.4-4.3-2.5-23-2.8l-19.3-.4V313.1l19.9-.3c21.8-.3 22.6-.5 27.4-7 5.2-6.9 2-18.4-6.3-22.6-4.1-2-5.7-2.2-22.7-2.2H984v-17.3c0-12.8-.5-19.5-1.9-26.2-7.5-36.2-36.9-64.9-73.2-71.5-8.5-1.6-26.2-1.3-34.7.4-22.4 4.8-44.3 19.3-57.2 38.1-4.8 7-10.7 20.2-13.2 29.6-2.2 8.4-2.2 8.5-2.8 124.9-.6 126.9-.1 117.5-6 129-2.8 5.5-10.9 14.1-16.9 17.9-9.3 5.9-15.1 7.1-35.1 7.1h-18V361.7c0-163.9.1-159.7-5.5-179.2-1.4-5-5.3-14.6-8.6-21.4l-6.1-12.4 14-14.1c7.7-7.8 14.5-15.1 15.1-16.3.6-1.2 1.1-4.3 1.1-7 0-11.3-12-18.7-22.4-13.8-1.7.8-8.7 7.1-15.5 13.9l-12.4 12.4-4.3-3.6-4.4-3.6 13.4-13.6c10.8-11 13.6-14.4 14.5-17.8 1.3-4.6.3-10-2.4-14-3.6-5-12.5-7.5-18.5-5.1zM609.8 125l5.2 1.2-2.5 3c-1.8 2.1-2.5 4.1-2.5 6.9 0 5.1 1.3 7.5 5 9.4 4.5 2.3 8.5 1.9 12.2-1.4 2.8-2.4 3.2-3.6 3.3-7.5 0-2.5.1-4.6.3-4.6.1 0 2.8 1.3 6 2.9 15.7 7.9 31.9 24.6 40.4 41.6 4.3 8.5 4.4 9.5.9 9.5-4 0-8.9 4.2-9.7 8.5-.8 4.4 1.9 10 5.6 11.5 2.9 1.2 7.9 1 11.1-.4 2.2-.9 2.9 6.4 2.9 29.3 0 15.9-.1 17.3-1.5 15.4-3.9-5.5-13.9-4.9-17.6 1.1-2.3 3.7-2.4 6.7-.4 10.6 2 3.8 4.3 5 9.8 5 3.5 0 5-.6 7.1-2.6l2.6-2.7v52.1l-3.4-3.4c-4.4-4.4-9.9-4.7-14.4-.9-3.8 3.2-4.8 7.2-2.8 11.9 3.2 7.7 13.6 8.7 18.3 1.7l2.3-3.4V765h-18.1c-17.9 0-18.2 0-21.1-2.5-5.3-4.5-10.3-4.5-15.6 0-3 2.5-3.2 2.5-22.2 2.5h-19.2l-3.5-3c-2.2-2-4.5-3-6.5-3-3.1 0-9.8 3.4-9.8 5.1 0 .5-8.4.9-19.6.9-19.5 0-19.6 0-22.6-2.5-5.3-4.5-10.3-4.5-15.6 0-2.7 2.3-3.8 2.5-12.1 2.5H493v-7.5c0-6.9.2-7.5 2.1-7.5 1.1 0 3.4-1.3 5-2.9 5.7-5.7 3.1-15.8-4.5-17.7l-2.6-.6v-38.6l3-.7c10.1-2.2 10.6-17.7.7-20.3l-3.2-.8-.3-19.2-.2-19.1 3.8-1.1c5.6-1.4 7.7-4.2 7.7-10s-3-9.6-8.2-10.6l-3.3-.6V569h3.1c4.6 0 9.9-5.6 9.9-10.5s-5.3-10.5-9.9-10.5H493v-39h2.4c4.2 0 7.5-1.8 9.6-5.2 2.4-4 2.5-6 .5-10.3-1.8-3.7-5.2-5.8-9.5-5.8h-3v-39.8l2.3.2c6.4.6 10.9-2.5 12.1-8.2 1.3-6.7-4.9-13.6-11.5-12.7l-2.9.5V388h4.4c8.1 0 13.2-7.2 10.2-14.3-2-4.8-5.6-7-10.6-6.5l-4 .4v-40.5l3.5.6c10.4 1.7 16.9-10.5 9.5-17.9-2.7-2.7-3.6-3-8-2.6l-5 .3v-41.2l5.5.5c5 .4 5.7.2 8.5-2.6 7.8-7.9-.9-21.2-11.3-17.3L493 248v-15.8c0-8.6.3-18 .6-20.8l.6-5.1 4.5.5c7.4.8 12.3-3.5 12.3-10.9 0-3.7-5.6-9.9-9-9.9-2.5 0-2.2-1.5 1.8-9.5 8.4-16.8 22.9-31.9 39.4-40.9 3.5-2 6.7-3.6 6.9-3.6.3 0 .3 1.8.1 4-.4 3.5 0 4.4 3.1 7.5 3.9 3.9 7.8 4.5 12.7 2 3.7-1.9 5-4.3 5-9.4 0-2.8-.7-4.8-2.5-6.9l-2.5-3 5.2-1.1c2.9-.6 6.4-1.2 7.8-1.5 4.3-.8 25.2.1 30.8 1.4zm-303.3 79.9c11.9 4.2 22.9 13.6 29 24.6 5.4 9.7 6.6 15.3 7.2 33.1.5 14 .3 16.5-1.1 18.5-2 2.9-2.1 8.8-.2 11.5 1.1 1.5 1.5 7.1 1.8 24.2.1 12.2 0 22.2-.4 22.2-1.4 0-3.8 5.9-3.8 9.1 0 3.6 5.5 9.9 8.7 9.9 1.3 0 2.7 1.6 4.2 4.7 7.7 15.9 24.9 32.4 41.5 39.7 5.4 2.4 5.6 2.6 5.6 6.4 0 4.6 2.8 8.7 6.5 9.6 3.4.9 8.6-1.6 11.4-5.4l2.2-3H457l1 2.4c.5 1.3 1.4 2.7 1.9 3.1.7.4 1.1 7.9 1.1 21.5 0 20.7 0 21-2.5 24.6-3.2 4.7-3.2 8.1 0 12.8 2.5 3.6 2.5 4 2.5 24.2v20.5l-36.7-.2c-20.3 0-41.7-.5-47.8-1.1-12.5-1.1-29.2-5.1-41.3-9.8-7.9-3-8.2-3.2-7.5-5.8 1.1-4.2.7-7.2-1.4-10.1-4.1-5.4-12.7-5.7-16.9-.6l-2 2.5-6-4.1c-3.2-2.3-7.6-5.5-9.7-7.2l-3.8-3 3.9-1.7c4.9-2.2 7.2-5.4 7.2-10 0-7.1-6.9-12.2-13.6-10-4.1 1.4-7.4 5.3-7.4 8.8v2.5l-2.6-2.4c-2.6-2.4-14.4-17.3-14.4-18.2 0-.3 1.1-.8 2.5-1.1 2.9-.7 6.5-5.9 6.5-9.4 0-5.6-5.6-11.2-11.3-11.2-1.3 0-3.6 1-5.1 2.1-1.5 1.2-2.9 1.9-3.2 1.7-1.2-1.3-8.4-20.2-8.4-22.2 0-1.2-.5-2.7-1.1-3.3-1.8-1.8-5.8-24.2-6.5-36.4-.7-11.4-.6-11.7 1.5-12.4 6.3-2 6.6-14 .4-18-2.3-1.5-2.3-1.7-2.3-21.3l.1-19.7 3.2-2c6.2-3.9 6.2-13.1-.1-17l-3.3-2 .4-15.5c.5-16.5 1.8-23.1 5.5-26.8 1.2-1.2 2.6-4 3.2-6.2 2.3-8.6 17.7-20.6 31.6-24.5 7.3-2.1 24.2-1.4 31.9 1.4zm602.3-.1c2.3 1.2 5 2.2 5.8 2.2 2.7 0 10.5 5.1 15.8 10.4 4.6 4.6 5.1 5.6 5.2 9.5 0 3.6.6 4.9 3.1 7.1 1.7 1.5 3.6 2.9 4.2 3.1 2 .7 4.1 14.1 4.1 26.5v12.2l-3.4.6c-7.1 1.4-11.3 9.3-8.2 15.5 1.7 3.3 6.1 6.1 9.6 6.1 1.9 0 2 .5 2 19.5V337h-3.4c-6.5 0-11.2 6.8-9.5 13.6 1.2 4.2 4 6.5 8.8 7.1l4.1.6v39.3l-3.2-.3c-7.6-.8-13.3 7.1-10.4 14.2 1.8 4.3 5.2 6.5 9.8 6.5h3.8v40.2l-2.7-.5c-1.6-.3-4.2.1-5.9.8-6.9 2.9-8.6 11-3.5 16.7 2.5 2.8 3.6 3.3 7.5 3.3h4.6v15.1c0 8.3-.3 17.2-.6 19.8l-.7 4.6h-4.4c-8.4 0-12.9 8.1-8.9 15.9 1.4 2.7 5.3 5.1 8.1 5.1 2.1 0 1.9.9-1.9 12.5-13.3 39.7-42.4 72.8-80.4 91.5-8.8 4.3-23.5 10-26 10-.6 0-1-1.6-.9-3.4.1-4.8-1.9-8.2-6.1-10.2-4.8-2.3-10.5-.6-13.2 3.9-2.4 3.8-2.5 6.8-.5 10.7 1.2 2.3 1.2 3.1.2 3.7-.6.4-11.1.9-23.1 1.1l-22 .4 2.7-3.2c4.9-5.8 3.1-13.7-3.9-16.6-10.2-4.3-19 8-11.8 16.5l2.6 3.1H720V551h2.4c2.5 0 2.5 0 1 3.6-2.9 6.9 2.1 14.4 9.5 14.4 4.6 0 7.9-2.3 9.7-6.6 1.2-2.8 1.2-4 .1-7.2l-1.4-3.9 11.6-.7c21.1-1.1 37-6.7 51.7-18l7.2-5.5.6 3.4c1.8 9.2 15 11.5 19.2 3.4 3.7-7.2.1-14.7-7.4-15.8l-4.2-.6 3.3-4.6c4.1-5.8 10.1-18.5 12.4-26.4 1.6-5.5 1.8-15.2 2.3-123l.5-117 2.3-6.6c5.4-16 19-30.1 33.7-34.8 9.1-3 9.3-3 20-2.8 8.1.2 10.8.7 14.3 2.5z" />
      <path d="M525.1 157.4c-9.2 5.1-5.1 19.6 5.5 19.6 3.3 0 8.1-2.5 9.4-4.9 1.3-2.5 1.3-8.7 0-11.2-2.3-4.3-10.1-6.1-14.9-3.5zM582.8 158.9c-2.8 2.5-3.3 3.6-3.3 7.5 0 6 3.4 9.6 9.7 10.3 4 .5 4.9.2 7.9-2.5 2.9-2.6 3.4-3.7 3.4-7.7s-.5-5.1-3.3-7.6c-2.4-2.2-4.2-2.9-7.2-2.9s-4.8.7-7.2 2.9zM644.1 157.4c-6.8 3.8-6.6 15.2.4 18.4 7.5 3.4 15.5-1.3 15.5-9.3 0-8.1-8.7-13.1-15.9-9.1zM552.9 188.8c-2.7 2.4-3.2 3.6-3.3 7.6-.1 4.2.3 5.1 3.2 7.7 6 5.3 15.1 3 17-4.4 2.8-10.6-8.8-18.1-16.9-10.9zM613.3 188c-8.7 5.3-4.3 19 6 19 9.9-.1 14.3-10.6 7.3-17.6-4-4-8.3-4.5-13.3-1.4zM525.4 217c-3.3 1.3-6.4 5.9-6.4 9.4 0 4.5 3.3 9.2 7.3 10.5 6.8 2.3 13.9-3 13.9-10.3 0-4.4-1.6-7.2-5.2-9.1-3.2-1.7-6.4-1.8-9.6-.5zM584.5 217.2c-6 3.2-7.4 11.4-3 16.6 3.2 3.8 7.2 4.8 11.8 2.8 3.8-1.5 6.7-5.9 6.7-9.8 0-7.4-9.2-13.1-15.5-9.6zM644.4 217c-3.5 1.4-6.4 5.9-6.4 10 0 7.4 7.5 12.5 14.3 9.7 4.3-1.8 6.7-5.2 6.7-9.4 0-4.7-1.9-8-5.5-9.8-3.6-1.7-5.9-1.8-9.1-.5zM554.2 247.5c-6.7 2.9-7.8 13.9-1.7 17.9 3.8 2.5 10.7 2.1 13.8-.8 5.5-5.1 4-14.3-2.8-17.2-4.2-1.7-5.1-1.7-9.3.1zM614.4 246.9c-6.7 2.9-8.5 12.1-3.5 17.2 2.4 2.4 3.8 2.9 7.6 2.9 6.3 0 10.5-3.9 10.5-9.9 0-7.4-8-13-14.6-10.2zM524.3 277.4c-3.3 1.5-6.3 6-6.3 9.6 0 3.4 2.8 7.8 6 9.5 3.7 1.9 6.3 1.9 10 0s5-4.3 5-9.4c0-7.8-7.7-12.8-14.7-9.7zM584.4 277c-8 3.2-8.6 15.8-.9 19.5 4.5 2.1 6.6 1.9 10.6-.8 6.9-4.6 6-15.1-1.6-18.3-3.9-1.6-5.1-1.6-8.1-.4zM643.3 277.4c-4.1 1.9-6.7 6.8-5.9 11.4 2 12.7 20.6 11.4 20.6-1.5 0-8-7.6-13.1-14.7-9.9zM551.2 309.5c-8.3 7-1.7 20.1 9.1 18.1 6.3-1.2 9.8-7.7 7.7-14.1-2.2-6.5-11.2-8.7-16.8-4zM611.7 308.1c-2.4 1.4-4.7 6.2-4.7 10 0 2.2 1 4.1 3.4 6.5 7.3 7.3 17.6 2.4 17.6-8.2 0-5.3-4.5-9.4-10.2-9.4-2.4 0-5.1.5-6.1 1.1zM521.5 339.2c-5 4.5-4.9 12.7.3 16.8 2.1 1.7 3.6 2.1 6.9 1.7 5.1-.5 7.1-2 9-6.5 4-9.7-8.4-18.8-16.2-12zM580.1 339.9c-5.3 4.9-3.9 13.7 2.6 17 6.9 3.5 15.3-1.7 15.3-9.5 0-9.3-11.1-13.9-17.9-7.5zM639.8 339.9c-2.8 2.5-3.3 3.6-3.3 7.6 0 4 .5 5.1 3.4 7.7 3 2.6 3.9 3 7.7 2.5 5.2-.5 7.2-2 9.1-6.5 4.3-10.3-8.5-18.8-16.9-11.3zM549.9 369.9c-2.4 2.4-2.9 3.8-2.9 7.6 0 6.5 3.9 10.5 10.2 10.5 10-.1 14.4-10.6 7.4-17.6-4.6-4.6-10.4-4.8-14.7-.5zM609.4 370.4c-2.6 2.6-3.4 4.2-3.4 7.1 0 5.5 5.2 10.5 11 10.5s10-4.1 10-10c0-5.2-1.3-7.6-5-9.5-4.9-2.5-8.8-1.9-12.6 1.9zM668.9 369.9c-2.4 2.4-2.9 3.8-2.9 7.6 0 10 10.5 14.2 17.6 7.1 2.6-2.6 3.4-4.2 3.4-7.1 0-2.9-.8-4.5-3.4-7.1-4.6-4.6-10.4-4.8-14.7-.5zM521.4 398.9c-9.1 5.6-4.8 19.1 6 19.1 6.9 0 11.5-5.6 10.2-12.4-1.3-7-10-10.6-16.2-6.7zM582.4 398c-5.6 2.2-7.9 9.3-4.9 15 1.9 3.7 4.3 5 9.5 5 7.8 0 12.3-7.8 8.9-15.3-2.1-4.6-8.4-6.8-13.5-4.7zM640.8 398.5c-6.5 3.6-7.3 12.2-1.7 16.9 8.5 7.2 20.8-1.6 16.5-11.7-.7-1.8-2-3.8-2.9-4.5-2.5-2.1-8.8-2.4-11.9-.7zM549.5 430.3c-2.8 2.8-3.5 4.3-3.5 7.4 0 7.3 6.3 12.2 13.2 10.3 4.7-1.4 6.9-4.1 7.5-9.3.5-3.8.1-4.8-2.3-7.6-2.1-2.3-4.1-3.4-7.1-3.8-3.9-.5-4.6-.2-7.8 3zM610.8 428.6c-3.1 1.6-5.8 6.1-5.8 9.6 0 6.2 6.8 11.3 13.3 10.1 3.9-.8 7.9-5.5 8-9.7.2-8.8-8-14.2-15.5-10zM668.5 430.3c-2.8 2.8-3.5 4.3-3.5 7.4 0 7.4 6.3 12.2 13.4 10.2 11-3 9.2-19.1-2.2-20.6-3.7-.5-4.5-.2-7.7 3zM523.4 457.7c-3.8.7-7.6 5.8-7.8 10.2-.2 7.7 8.5 13.2 15.3 9.7 3.3-1.7 6.1-6.2 6.1-9.6 0-3.7-3-8.1-6.5-9.6-1.9-.8-3.8-1.3-4.2-1.3-.4.1-1.8.4-2.9.6zM581 458.8c-4.4 2.2-6.2 5.6-5.6 10.6.7 5.8 4.4 9.1 10.2 9.1 3.9 0 5-.5 7.5-3.3 5.2-5.8 3.4-13.8-3.7-16.8-4.2-1.8-4.2-1.8-8.4.4zM642.3 457.7c-2.9.6-7 4.8-7.5 7.8-1.7 8.9 7.3 16.1 15.1 12.1 3.3-1.7 6.1-6.2 6.1-9.6 0-3.7-3-8.1-6.5-9.6-1.9-.8-3.8-1.3-4.2-1.3-.4.1-1.8.4-3 .6zM612.5 487.8c-2.9.6-7.3 5.1-8 8.2-1.3 6 4.4 13 10.5 13 3.4 0 7.9-2.8 9.6-6.1 3.9-7.6-3.4-16.8-12.1-15.1zM671.3 488.2c-4.4 1.1-7.3 5.2-7.3 10 0 3.2.7 4.7 3.5 7.5 3.2 3.2 3.9 3.5 7.8 3 8.3-1.1 12.1-9.2 7.7-16.5-1.1-1.7-2.1-3.2-2.2-3.2-.2 0-1.7-.4-3.3-.8-1.7-.5-4.4-.5-6.2 0zM547.9 490.9c-6.2 6.2-2.2 16.6 6.8 17.8 3.9.5 4.6.2 7.8-3 2.9-2.9 3.5-4.2 3.5-7.7 0-6.1-4.1-10-10.5-10-3.8 0-5.2.5-7.6 2.9zM517.9 520.9c-2.3 2.3-2.9 3.8-2.9 7.1 0 5.2 1.3 7.6 5 9.5 4.9 2.5 8.8 1.9 12.6-1.9 7-7 2.6-17.5-7.4-17.6-3.5 0-4.9.6-7.3 2.9zM577.3 521.5c-3.2 3.2-3.5 3.9-3 7.8.4 3 1.5 5 3.8 7.1 2.8 2.4 3.8 2.8 7.6 2.3 5.1-.5 8-2.8 9.2-7.1 1.8-7.1-3-13.6-10.1-13.6-3.3 0-4.7.7-7.5 3.5zM636.9 520.9c-2.3 2.3-2.9 3.8-2.9 7.1 0 5.2 1.3 7.6 5 9.5 4.9 2.5 8.8 1.9 12.6-1.9 7-7 2.6-17.5-7.4-17.6-3.5 0-4.9.6-7.3 2.9zM547.4 551.4c-7.3 7.3-2.4 17.6 8.2 17.6 5.2 0 9.4-4.5 9.4-10 0-5.2-1.3-7.6-5-9.5-4.9-2.5-8.8-1.9-12.6 1.9zM608.1 549.6c-3.6 2.6-5.4 7.9-4.1 12 2.5 7.6 11.2 9.9 17.2 4.5 2.8-2.5 3.3-3.6 3.3-7.6 0-4-.5-5.1-3.3-7.6-3.8-3.4-9.3-3.9-13.1-1.3zM668.1 549.4c-3 1.7-5 5.2-5.1 8.9-.1 9.5 10.9 14.3 17.9 7.8 2.6-2.4 3.1-3.7 3.1-7.3-.1-8.5-8.5-13.5-15.9-9.4zM517.4 581.4c-7.1 7.1-2.9 17.6 7.1 17.6s14.2-10.5 7.1-17.6c-2.6-2.6-4.2-3.4-7.1-3.4-2.9 0-4.5.8-7.1 3.4zM579.3 579c-1.3.5-3.2 2.4-4.3 4.2-6.3 10 6.8 20.9 15.8 13.3 1.7-1.4 3.3-3.8 3.7-5.4.7-3.2-1.3-8.8-3.8-10.9-2.1-1.8-8.6-2.4-11.4-1.2zM638.1 579.4c-5.8 3.2-6.9 11.9-2.2 16.7 2.3 2.3 3.8 2.9 7.1 2.9 5.2 0 7.6-1.3 9.5-5 2.5-4.9 1.9-8.8-1.9-12.6-3.7-3.7-8.1-4.4-12.5-2zM549.3 609c-2.8 1.1-6.3 6.6-6.3 9.8 0 1.3.7 3.6 1.5 5.2 4 7.7 15.6 6.8 19.1-1.5 3.6-8.7-5.3-17.1-14.3-13.5zM608 609.6c-4 2.8-4.9 4.6-5 9.1 0 7.3 6.4 12.1 13.8 10.1 7-1.9 9.3-12.1 3.9-17.5-3.2-3.3-9.3-4-12.7-1.7zM668.4 608.9c-1.2.5-3.1 2.2-4.4 3.8-1.7 2.2-2.1 3.7-1.7 7.1.5 5 2.8 7.9 7.1 9.1 10.5 2.7 18-9 10.9-16.9-3-3.3-8.2-4.6-11.9-3.1zM519.4 639.4c-4.1 1.8-6.4 5.2-6.4 9.6 0 9.9 12.1 14.4 18.4 6.9 7.2-8.6-1.9-21-12-16.5zM578.4 639.4c-3.8 1.7-6.8 7.5-5.9 11.6.8 3.9 5 7.8 9 8.6 6 1.1 12.5-4.4 12.5-10.6 0-3.7-3-8.1-6.5-9.6-4.2-1.7-5.1-1.7-9.1 0zM638.4 639.4c-6.9 3-8.6 11.1-3.5 16.8 2.5 2.8 3.6 3.3 7.6 3.3 4 0 5.1-.5 7.6-3.3 5-5.6 3.6-13.3-3.1-16.7-3.5-1.8-4.6-1.8-8.6-.1zM546.4 670.8c-9.9 7.9-.8 22.7 10.9 17.8 6.8-2.8 8.3-11.7 2.9-17.1-3.1-3.1-10.4-3.5-13.8-.7zM604.9 671.9c-8.1 8.1 1.8 21.9 11.9 16.7 6.9-3.6 8.4-11.5 3.3-16.7-2.4-2.4-3.8-2.9-7.6-2.9s-5.2.5-7.6 2.9zM665.7 670.1c-2.2 1.3-4.7 6.1-4.7 9.1 0 3.8 3.5 8.5 7.4 9.8 4.4 1.4 9.8-.1 12.1-3.3 2.4-3.5 1.9-10-1.1-13.6-2.2-2.7-3.2-3.1-7.2-3.1-2.6 0-5.5.5-6.5 1.1zM515.7 701.6c-3.3 3.3-4.1 5.7-3.3 9.9.8 4.2 5.7 8.5 9.7 8.5 3.7 0 8.5-2.4 9.9-4.9.5-1.1 1-3.8 1-6.1 0-6-4.1-10-10.3-10-3.4 0-5 .6-7 2.6zM575.5 701.2c-7.6 6.7-3 18.8 7.2 18.8 4 0 8.9-4 9.8-8 .9-4-1-9.5-4-11.4-3.6-2.4-9.9-2.1-13 .6zM635.4 700.8c-2.9 2.3-4.4 5.4-4.4 9.2 0 4.4 5.6 10 9.9 10 10.1 0 15.1-11.1 8.2-18.1-2.4-2.3-3.8-2.9-7.3-2.9-2.6 0-5.2.7-6.4 1.8zM546.1 730.6c-3.6 2.6-5.4 7.9-4.1 12 2.5 7.6 11.2 9.9 17.2 4.5 2.8-2.5 3.3-3.6 3.3-7.6 0-4-.5-5.1-3.3-7.6-3.8-3.4-9.3-3.9-13.1-1.3zM605.8 730.6c-6.4 3.4-6.6 12.7-.4 17.6 4.5 3.7 12.7 1.6 15.5-3.9 4.8-9.4-5.6-18.9-15.1-13.7zM664.2 731.5c-3.6 3-4.7 6.6-3.2 11.1s5.4 7.4 9.9 7.4c4.4 0 7.5-2 9.7-6.2 5.1-9.8-7.8-19.5-16.4-12.3zM287.4 217c-8.9 3.6-8.1 17 1.2 20 11.8 3.9 19.1-14.1 7.9-19.5-3.6-1.7-5.9-1.8-9.1-.5zM257.4 246.9c-6.7 2.9-8.5 12.1-3.5 17.2 2.4 2.4 3.8 2.9 7.6 2.9 6.3 0 10.5-3.9 10.5-9.9 0-7.4-8-13-14.6-10.2zM316.3 247.4c-3.3 1.5-6.3 6-6.3 9.6 0 2.9 2.7 7.7 4.9 9 1.1.5 4 1 6.4 1 7.4 0 11.6-6 9.5-13.6-1.6-5.8-8.5-8.6-14.5-6zM286.3 277.4c-3.4 1.6-6.3 6.1-6.3 9.9 0 4.1 4.1 9.1 8.3 10.1 10 2.5 17-9.7 10-17.4-3.3-3.6-7.6-4.5-12-2.6zM252.9 309.9c-4.3 4.3-4.1 10.1.5 14.7 2.6 2.6 4.2 3.4 7.1 3.4 2.9 0 4.5-.8 7.1-3.4 7.1-7.1 2.9-17.6-7.1-17.6-3.8 0-5.2.5-7.6 2.9zM312.9 309.9c-4.8 4.9-3.4 14.2 2.6 16.9 4.7 2.2 8.4 1.5 12.1-2.2 3.8-3.8 4.4-7.7 1.9-12.6-1.9-3.7-4.3-5-9.5-5-3.3 0-4.8.6-7.1 2.9zM283.7 339c-8.2 6.5-3.4 19 7.2 19 2 0 4.2-1.1 6.3-2.9 2.8-2.5 3.3-3.6 3.3-7.6 0-4-.5-5.1-3.3-7.6-4-3.6-9.6-3.9-13.5-.9zM254.1 368.6c-1.3.9-2.9 3.1-3.7 5-4.3 10.2 8 19 16.5 11.8 7.5-6.3 3-18.4-6.9-18.4-2 0-4.6.7-5.9 1.6zM314.1 368.4c-3.2 1.8-5 5.3-5.1 9.9-.1 10.5 15 13.6 19.9 4 4.7-9.2-5.6-19-14.8-13.9zM284.5 398.1c-3.7 2.1-5.5 5.3-5.5 9.7 0 6 4.1 10.2 10 10.2 5.2 0 7.6-1.3 9.5-5 2.3-4.5 1.9-8.5-1.2-12-3.1-3.5-9.4-4.9-12.8-2.9zM345 397.7c-5.3 1.9-8.2 8.9-6 14.3 4.2 10.1 20 7 20-4 0-2.3-.5-5-1-6.1-2-3.6-8.6-5.8-13-4.2zM314.4 428c-3.5 1.4-6.4 5.9-6.4 10 0 7.4 7.6 12.4 14.5 9.6 4.3-1.8 6.5-5.2 6.5-9.9 0-3.1-.7-4.6-3.4-7.3-3.5-3.5-6.8-4.2-11.2-2.4zM372.3 429c-4.5 2.7-6.2 8.4-3.9 13.2 2 4.2 5.4 6.2 10.2 6.1 4.7-.1 8-2.5 9.4-6.8 1.6-4.8-.2-10-4.4-12.6-4-2.4-7.3-2.4-11.3.1zM430.5 430.3c-2.8 2.8-3.5 4.3-3.5 7.5 0 7.6 7.4 12.7 14.3 9.9 10.4-4.4 8.3-18.9-3-20.4-3.9-.5-4.6-.2-7.8 3zM344.2 458.1c-3.7 1.1-7.2 5.9-7.2 9.9 0 3.7 3.3 8.5 6.9 10 4.1 1.7 10.4-.1 12.7-3.5 2-3 2.2-8.6.5-11.8-2.2-4.1-7.7-6.1-12.9-4.6zM404.3 457.7c-1.2.2-3.4 1.8-4.8 3.4-7.8 9.3 3.5 22.5 13.5 15.7 10-6.8 3.3-21.5-8.7-19.1zM374.3 488.2c-4.5 1.2-7.3 5.1-7.3 10.2 0 4.9 1.8 7.9 5.9 9.6 9.1 3.7 17.8-5.5 13.6-14.3-2.3-4.8-6.9-6.9-12.2-5.5zM433.2 488.2c-3.9 1-7.2 5.8-7.2 10.5 0 4.3 4.1 9 8.6 9.9 7 1.3 12.4-3.3 12.4-10.5 0-7.1-6.6-11.8-13.8-9.9zM880.8 217.7c-3.5 2.2-5.2 6.4-4.5 10.9 2.2 13.2 20.7 10.9 20.7-2.5 0-7.3-10-12.4-16.2-8.4zM851.5 247.5c-4.1 2-5.7 5-5.7 9.9.2 11.9 19 13.3 20.8 1.6.3-1.9.1-4.7-.5-6.2-2-5.3-9.4-8-14.6-5.3zM911.3 247.4c-3.3 1.5-6.3 6-6.3 9.6 0 2.9 2.7 7.7 4.9 9 1.1.5 3.8 1 6.1 1 3.3 0 4.8-.6 7.1-2.9 8-8.1-1.4-21.3-11.8-16.7zM880.3 278c-6.2 3.7-7.2 10.8-2.4 16.2 2.5 2.8 3.6 3.3 7.6 3.3 4 0 5.1-.5 7.6-3.3 5.2-5.8 3.4-13.8-3.7-16.8-4.4-1.8-5.3-1.8-9.1.6zM847.9 309.9c-4.7 4.8-3.7 13 2.1 16.4 8.8 5.2 18.9-3.9 15-13.4-1.7-4.1-4.7-5.9-9.8-5.9-3.5 0-4.9.6-7.3 2.9zM907.8 309.3c-5 4.7-4.9 11.8.3 16.1 7.9 6.7 19.5-.9 16.8-10.9-2-7.2-11.8-10.1-17.1-5.2zM879.1 338.4c-3.1 1.7-5 5.3-5.1 9.4 0 2.6.9 4.3 3.4 6.8 3.8 3.8 7.7 4.4 12.6 1.9 3.7-1.9 5-4.3 5-9.5 0-8-8.6-12.6-15.9-8.6zM849.1 368.4c-4.8 2.7-6.4 9.1-3.6 14.6 1.9 3.7 4.3 5 9 5s7.1-1.3 9-5c5.1-9.9-4.8-19.9-14.4-14.6zM906.8 369.9c-2.8 2.5-3.3 3.6-3.3 7.6 0 4 .5 5.1 3.3 7.6 5.8 5.2 13.8 3.4 16.9-3.8 4.3-10.4-8.5-18.9-16.9-11.4zM879.5 397.9c-10.3 4.3-7 20.1 4.3 20.1 6.1 0 10.2-4 10.2-10 0-5.2-1.3-7.6-5-9.5-3.2-1.6-6.4-1.8-9.5-.6zM849.5 427.9c-5.9 2.5-8.4 11.4-4.5 16.3 6.2 7.9 19 3.6 19-6.4 0-3.2-.7-4.7-3.4-7.4-3.5-3.5-6.8-4.2-11.1-2.5zM908.2 428.3c-9.4 5.3-6 20 4.7 20 5.4 0 8.8-2.4 10.2-7.2.9-3.2.9-4.7-.1-7.2-2.4-5.7-9.6-8.4-14.8-5.6zM878.2 458.5c-4.6 2-6.8 7.5-5.2 12.7 2.9 10 17.1 9.9 20.1-.1 2.6-8.8-6.2-16.4-14.9-12.6zM851 487.7c-8.5 2.4-11.7 10.9-6.4 17.2 4.4 5.2 13.2 5.1 16.9-.3 2.3-3.2 1.9-10-.7-13.1-2.4-2.6-7.2-4.5-9.8-3.8zM909.3 488.2c-9.1 2.4-10 16.2-1.3 19.8 6.4 2.7 13.5-1.4 14.6-8.2.6-3.4-1.3-8.9-3.6-10.3-2.5-1.5-6.7-2.1-9.7-1.3zM875.1 520.6c-5.9 4.9-4.7 13.7 2.4 17.1 5 2.4 10.2.9 13.3-3.7 6.8-10-6.4-21.3-15.7-13.4zM787.1 549.4c-3.2 1.8-5 5.3-5.1 9.8 0 2.8.7 4.4 3.1 6.7 6.6 6.7 17.9 2.1 17.9-7.3 0-8.2-8.7-13.2-15.9-9.2zM844.8 550.9c-2.8 2.5-3.3 3.6-3.3 7.6 0 4 .5 5.1 3.3 7.6 5.8 5.2 13.8 3.4 16.9-3.8 4.3-10.4-8.5-18.9-16.9-11.4zM905.8 549.6c-3.6 1.9-4.8 4.3-4.8 9.4 0 8.1 8.2 12.5 15.9 8.6 4.9-2.6 6.5-9.4 3.4-14.6-2.9-4.9-9.1-6.4-14.5-3.4zM757.5 579.2c-3.7 2-5.5 5.2-5.5 9.6 0 11.2 15.8 14.4 20 4.2 3.7-9-6.2-18.4-14.5-13.8zM814.4 581.4c-4.9 4.9-4.5 11.4 1 15.8 2.7 2.2 9.4 2.3 12.5.2 6-4.2 5.8-13.8-.2-17.4-5-3.1-9.3-2.6-13.3 1.4zM875.3 579.9c-8.4 5.3-4.6 19.1 5.4 19.1 4.6 0 7.9-1.8 9.8-5.5 5.1-9.4-6-19.4-15.2-13.6zM726.8 609.6c-3.6 1.9-4.8 4.3-4.8 9.3 0 5.9 4.2 10.4 9.6 10.4 11 0 15.5-13 6.5-19-3.9-2.6-7.4-2.9-11.3-.7zM787.4 608.9c-6 2.6-8.3 11.4-4.3 16.5 6 7.6 18.9 3.3 18.9-6.4 0-7.3-8.1-12.8-14.6-10.1zM845.4 609.9c-5.8 3.6-6.6 11.7-1.5 16.4 6.1 5.9 16.1 2.6 17.7-5.8.7-4.2-1.7-9-5.6-11-3.9-2-6.8-1.9-10.6.4z" />
    </svg>
  )
}
export function LogoExtended({props,size=32}: {props?: React.SVGProps<SVGSVGElement>,size:number}) {
  const {theme}= useTheme()
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 1200 867"

      className={`${theme === "light"?"text-black":"text-white"} fill-current`}
      {...props}
    >
      <path d="M683 66.1c-1.4.5-9.7 8.2-18.5 16.9l-16 15.9-4.3-1.9c-25.7-11.6-59.2-14.2-87.7-6.8-43.5 11.4-79.3 44.9-93.4 87.4-6.7 20.3-6.4 15.3-6.8 109.6l-.4 85.8H440c-16.5 0-23.3-.9-31-4.2-10.8-4.6-21.5-15.9-26.2-27.6-2.2-5.6-2.3-6.9-2.9-52.2-.6-43.3-.7-47.1-2.8-54.9-8.8-34.1-36.1-60.5-70.2-67.6-9-1.9-27.8-1.9-36.7 0-3.8.8-10 2.6-13.8 4l-6.8 2.6-14.1-14c-7.7-7.6-15-14.4-16.2-15-1.2-.6-4.3-1.1-7-1.1-11.4 0-18.8 12.1-13.7 22.3.9 1.8 6.8 8.5 13.2 14.9l11.6 11.8-3.4 3.7c-1.9 2.1-3.6 4-3.8 4.2-.1.3-5.7-5-12.5-11.6-6.7-6.6-13.3-12.6-14.6-13.3-3.9-2-11.5-1.5-15.7 1-5.9 3.7-8.8 12.1-6.4 18.7.6 1.5 8.4 10.1 17.3 19l16.1 16.2-1.4 5.8c-1.9 7.7-2.7 127.9-1 144.8 7.7 76.2 60.2 141.6 133 165.5 25.4 8.4 39.9 10 88.6 10H456v56h-17.8c-16.7 0-18.2.2-22.3 2.3-8.2 4.3-11.3 15.6-6.2 22.5 4.8 6.4 5.7 6.7 26.9 7l19.4.3V674h-18.9c-17.9 0-19 .1-22.1 2.2-7.2 5-9.5 11.6-6.5 19.4 1.2 3.2 2.9 5.3 5.8 7.2 4 2.7 4.4 2.7 22.9 3l18.8.4V765h-18.4c-19.7 0-22.4.5-26.9 4.8-4.2 4-6 8-6 13.7 0 8 4 13.8 11.5 17 3.3 1.3 22.5 1.5 173 1.5 162.1 0 169.5-.1 173.3-1.9 6.2-2.8 11.5-10.4 11.5-16.6 0-3.2-2.5-9-5.3-12.2-5-5.7-7.5-6.3-26.7-6.3h-17v-69h40.3c30 0 42.8-.4 50.6-1.5 28.6-4.1 56.5-14.7 80.2-30.4l10.4-6.9 14 13.8c7.7 7.6 15 14.3 16.2 14.9 3.2 1.6 10 1.3 13.9-.5 6.6-3.1 10.1-12.8 7.3-20.1-.5-1.5-6.8-8.6-14-15.8-7.1-7.2-12.9-13.4-12.9-13.8 0-.4 2.8-4 6.3-8 3.4-4 7-8.3 8-9.7l1.7-2.4 14.3 14.1c7.8 7.8 15.5 14.6 17 15.2 10.3 3.9 21.7-3.6 21.7-14.2 0-2-.5-4.8-1-6.4-.6-1.5-8.7-10.5-18-19.8l-16.9-17 4.5-10.3c5.3-12.5 9.7-26.8 12.6-41.7 2.1-10.6 2.2-13.7 2.6-87.8l.3-76.7h19.3c18.4 0 19.5-.1 22.6-2.3 4.7-3.1 7.1-6.7 7.7-11.5.7-5.4-2.4-11.8-7.4-15.2-3.5-2.4-4.3-2.5-23-2.8l-19.3-.4V313.1l19.9-.3c21.8-.3 22.6-.5 27.4-7 5.2-6.9 2-18.4-6.3-22.6-4.1-2-5.7-2.2-22.7-2.2H984v-17.3c0-12.8-.5-19.5-1.9-26.2-7.5-36.2-36.9-64.9-73.2-71.5-8.5-1.6-26.2-1.3-34.7.4-22.4 4.8-44.3 19.3-57.2 38.1-4.8 7-10.7 20.2-13.2 29.6-2.2 8.4-2.2 8.5-2.8 124.9-.6 126.9-.1 117.5-6 129-2.8 5.5-10.9 14.1-16.9 17.9-9.3 5.9-15.1 7.1-35.1 7.1h-18V361.7c0-163.9.1-159.7-5.5-179.2-1.4-5-5.3-14.6-8.6-21.4l-6.1-12.4 14-14.1c7.7-7.8 14.5-15.1 15.1-16.3.6-1.2 1.1-4.3 1.1-7 0-11.3-12-18.7-22.4-13.8-1.7.8-8.7 7.1-15.5 13.9l-12.4 12.4-4.3-3.6-4.4-3.6 13.4-13.6c10.8-11 13.6-14.4 14.5-17.8 1.3-4.6.3-10-2.4-14-3.6-5-12.5-7.5-18.5-5.1zM609.8 125l5.2 1.2-2.5 3c-1.8 2.1-2.5 4.1-2.5 6.9 0 5.1 1.3 7.5 5 9.4 4.5 2.3 8.5 1.9 12.2-1.4 2.8-2.4 3.2-3.6 3.3-7.5 0-2.5.1-4.6.3-4.6.1 0 2.8 1.3 6 2.9 15.7 7.9 31.9 24.6 40.4 41.6 4.3 8.5 4.4 9.5.9 9.5-4 0-8.9 4.2-9.7 8.5-.8 4.4 1.9 10 5.6 11.5 2.9 1.2 7.9 1 11.1-.4 2.2-.9 2.9 6.4 2.9 29.3 0 15.9-.1 17.3-1.5 15.4-3.9-5.5-13.9-4.9-17.6 1.1-2.3 3.7-2.4 6.7-.4 10.6 2 3.8 4.3 5 9.8 5 3.5 0 5-.6 7.1-2.6l2.6-2.7v52.1l-3.4-3.4c-4.4-4.4-9.9-4.7-14.4-.9-3.8 3.2-4.8 7.2-2.8 11.9 3.2 7.7 13.6 8.7 18.3 1.7l2.3-3.4V765h-18.1c-17.9 0-18.2 0-21.1-2.5-5.3-4.5-10.3-4.5-15.6 0-3 2.5-3.2 2.5-22.2 2.5h-19.2l-3.5-3c-2.2-2-4.5-3-6.5-3-3.1 0-9.8 3.4-9.8 5.1 0 .5-8.4.9-19.6.9-19.5 0-19.6 0-22.6-2.5-5.3-4.5-10.3-4.5-15.6 0-2.7 2.3-3.8 2.5-12.1 2.5H493v-7.5c0-6.9.2-7.5 2.1-7.5 1.1 0 3.4-1.3 5-2.9 5.7-5.7 3.1-15.8-4.5-17.7l-2.6-.6v-38.6l3-.7c10.1-2.2 10.6-17.7.7-20.3l-3.2-.8-.3-19.2-.2-19.1 3.8-1.1c5.6-1.4 7.7-4.2 7.7-10s-3-9.6-8.2-10.6l-3.3-.6V569h3.1c4.6 0 9.9-5.6 9.9-10.5s-5.3-10.5-9.9-10.5H493v-39h2.4c4.2 0 7.5-1.8 9.6-5.2 2.4-4 2.5-6 .5-10.3-1.8-3.7-5.2-5.8-9.5-5.8h-3v-39.8l2.3.2c6.4.6 10.9-2.5 12.1-8.2 1.3-6.7-4.9-13.6-11.5-12.7l-2.9.5V388h4.4c8.1 0 13.2-7.2 10.2-14.3-2-4.8-5.6-7-10.6-6.5l-4 .4v-40.5l3.5.6c10.4 1.7 16.9-10.5 9.5-17.9-2.7-2.7-3.6-3-8-2.6l-5 .3v-41.2l5.5.5c5 .4 5.7.2 8.5-2.6 7.8-7.9-.9-21.2-11.3-17.3L493 248v-15.8c0-8.6.3-18 .6-20.8l.6-5.1 4.5.5c7.4.8 12.3-3.5 12.3-10.9 0-3.7-5.6-9.9-9-9.9-2.5 0-2.2-1.5 1.8-9.5 8.4-16.8 22.9-31.9 39.4-40.9 3.5-2 6.7-3.6 6.9-3.6.3 0 .3 1.8.1 4-.4 3.5 0 4.4 3.1 7.5 3.9 3.9 7.8 4.5 12.7 2 3.7-1.9 5-4.3 5-9.4 0-2.8-.7-4.8-2.5-6.9l-2.5-3 5.2-1.1c2.9-.6 6.4-1.2 7.8-1.5 4.3-.8 25.2.1 30.8 1.4zm-303.3 79.9c11.9 4.2 22.9 13.6 29 24.6 5.4 9.7 6.6 15.3 7.2 33.1.5 14 .3 16.5-1.1 18.5-2 2.9-2.1 8.8-.2 11.5 1.1 1.5 1.5 7.1 1.8 24.2.1 12.2 0 22.2-.4 22.2-1.4 0-3.8 5.9-3.8 9.1 0 3.6 5.5 9.9 8.7 9.9 1.3 0 2.7 1.6 4.2 4.7 7.7 15.9 24.9 32.4 41.5 39.7 5.4 2.4 5.6 2.6 5.6 6.4 0 4.6 2.8 8.7 6.5 9.6 3.4.9 8.6-1.6 11.4-5.4l2.2-3H457l1 2.4c.5 1.3 1.4 2.7 1.9 3.1.7.4 1.1 7.9 1.1 21.5 0 20.7 0 21-2.5 24.6-3.2 4.7-3.2 8.1 0 12.8 2.5 3.6 2.5 4 2.5 24.2v20.5l-36.7-.2c-20.3 0-41.7-.5-47.8-1.1-12.5-1.1-29.2-5.1-41.3-9.8-7.9-3-8.2-3.2-7.5-5.8 1.1-4.2.7-7.2-1.4-10.1-4.1-5.4-12.7-5.7-16.9-.6l-2 2.5-6-4.1c-3.2-2.3-7.6-5.5-9.7-7.2l-3.8-3 3.9-1.7c4.9-2.2 7.2-5.4 7.2-10 0-7.1-6.9-12.2-13.6-10-4.1 1.4-7.4 5.3-7.4 8.8v2.5l-2.6-2.4c-2.6-2.4-14.4-17.3-14.4-18.2 0-.3 1.1-.8 2.5-1.1 2.9-.7 6.5-5.9 6.5-9.4 0-5.6-5.6-11.2-11.3-11.2-1.3 0-3.6 1-5.1 2.1-1.5 1.2-2.9 1.9-3.2 1.7-1.2-1.3-8.4-20.2-8.4-22.2 0-1.2-.5-2.7-1.1-3.3-1.8-1.8-5.8-24.2-6.5-36.4-.7-11.4-.6-11.7 1.5-12.4 6.3-2 6.6-14 .4-18-2.3-1.5-2.3-1.7-2.3-21.3l.1-19.7 3.2-2c6.2-3.9 6.2-13.1-.1-17l-3.3-2 .4-15.5c.5-16.5 1.8-23.1 5.5-26.8 1.2-1.2 2.6-4 3.2-6.2 2.3-8.6 17.7-20.6 31.6-24.5 7.3-2.1 24.2-1.4 31.9 1.4zm602.3-.1c2.3 1.2 5 2.2 5.8 2.2 2.7 0 10.5 5.1 15.8 10.4 4.6 4.6 5.1 5.6 5.2 9.5 0 3.6.6 4.9 3.1 7.1 1.7 1.5 3.6 2.9 4.2 3.1 2 .7 4.1 14.1 4.1 26.5v12.2l-3.4.6c-7.1 1.4-11.3 9.3-8.2 15.5 1.7 3.3 6.1 6.1 9.6 6.1 1.9 0 2 .5 2 19.5V337h-3.4c-6.5 0-11.2 6.8-9.5 13.6 1.2 4.2 4 6.5 8.8 7.1l4.1.6v39.3l-3.2-.3c-7.6-.8-13.3 7.1-10.4 14.2 1.8 4.3 5.2 6.5 9.8 6.5h3.8v40.2l-2.7-.5c-1.6-.3-4.2.1-5.9.8-6.9 2.9-8.6 11-3.5 16.7 2.5 2.8 3.6 3.3 7.5 3.3h4.6v15.1c0 8.3-.3 17.2-.6 19.8l-.7 4.6h-4.4c-8.4 0-12.9 8.1-8.9 15.9 1.4 2.7 5.3 5.1 8.1 5.1 2.1 0 1.9.9-1.9 12.5-13.3 39.7-42.4 72.8-80.4 91.5-8.8 4.3-23.5 10-26 10-.6 0-1-1.6-.9-3.4.1-4.8-1.9-8.2-6.1-10.2-4.8-2.3-10.5-.6-13.2 3.9-2.4 3.8-2.5 6.8-.5 10.7 1.2 2.3 1.2 3.1.2 3.7-.6.4-11.1.9-23.1 1.1l-22 .4 2.7-3.2c4.9-5.8 3.1-13.7-3.9-16.6-10.2-4.3-19 8-11.8 16.5l2.6 3.1H720V551h2.4c2.5 0 2.5 0 1 3.6-2.9 6.9 2.1 14.4 9.5 14.4 4.6 0 7.9-2.3 9.7-6.6 1.2-2.8 1.2-4 .1-7.2l-1.4-3.9 11.6-.7c21.1-1.1 37-6.7 51.7-18l7.2-5.5.6 3.4c1.8 9.2 15 11.5 19.2 3.4 3.7-7.2.1-14.7-7.4-15.8l-4.2-.6 3.3-4.6c4.1-5.8 10.1-18.5 12.4-26.4 1.6-5.5 1.8-15.2 2.3-123l.5-117 2.3-6.6c5.4-16 19-30.1 33.7-34.8 9.1-3 9.3-3 20-2.8 8.1.2 10.8.7 14.3 2.5z" />
      <path d="M525.1 157.4c-9.2 5.1-5.1 19.6 5.5 19.6 3.3 0 8.1-2.5 9.4-4.9 1.3-2.5 1.3-8.7 0-11.2-2.3-4.3-10.1-6.1-14.9-3.5zM582.8 158.9c-2.8 2.5-3.3 3.6-3.3 7.5 0 6 3.4 9.6 9.7 10.3 4 .5 4.9.2 7.9-2.5 2.9-2.6 3.4-3.7 3.4-7.7s-.5-5.1-3.3-7.6c-2.4-2.2-4.2-2.9-7.2-2.9s-4.8.7-7.2 2.9zM644.1 157.4c-6.8 3.8-6.6 15.2.4 18.4 7.5 3.4 15.5-1.3 15.5-9.3 0-8.1-8.7-13.1-15.9-9.1zM552.9 188.8c-2.7 2.4-3.2 3.6-3.3 7.6-.1 4.2.3 5.1 3.2 7.7 6 5.3 15.1 3 17-4.4 2.8-10.6-8.8-18.1-16.9-10.9zM613.3 188c-8.7 5.3-4.3 19 6 19 9.9-.1 14.3-10.6 7.3-17.6-4-4-8.3-4.5-13.3-1.4zM525.4 217c-3.3 1.3-6.4 5.9-6.4 9.4 0 4.5 3.3 9.2 7.3 10.5 6.8 2.3 13.9-3 13.9-10.3 0-4.4-1.6-7.2-5.2-9.1-3.2-1.7-6.4-1.8-9.6-.5zM584.5 217.2c-6 3.2-7.4 11.4-3 16.6 3.2 3.8 7.2 4.8 11.8 2.8 3.8-1.5 6.7-5.9 6.7-9.8 0-7.4-9.2-13.1-15.5-9.6zM644.4 217c-3.5 1.4-6.4 5.9-6.4 10 0 7.4 7.5 12.5 14.3 9.7 4.3-1.8 6.7-5.2 6.7-9.4 0-4.7-1.9-8-5.5-9.8-3.6-1.7-5.9-1.8-9.1-.5zM554.2 247.5c-6.7 2.9-7.8 13.9-1.7 17.9 3.8 2.5 10.7 2.1 13.8-.8 5.5-5.1 4-14.3-2.8-17.2-4.2-1.7-5.1-1.7-9.3.1zM614.4 246.9c-6.7 2.9-8.5 12.1-3.5 17.2 2.4 2.4 3.8 2.9 7.6 2.9 6.3 0 10.5-3.9 10.5-9.9 0-7.4-8-13-14.6-10.2zM524.3 277.4c-3.3 1.5-6.3 6-6.3 9.6 0 3.4 2.8 7.8 6 9.5 3.7 1.9 6.3 1.9 10 0s5-4.3 5-9.4c0-7.8-7.7-12.8-14.7-9.7zM584.4 277c-8 3.2-8.6 15.8-.9 19.5 4.5 2.1 6.6 1.9 10.6-.8 6.9-4.6 6-15.1-1.6-18.3-3.9-1.6-5.1-1.6-8.1-.4zM643.3 277.4c-4.1 1.9-6.7 6.8-5.9 11.4 2 12.7 20.6 11.4 20.6-1.5 0-8-7.6-13.1-14.7-9.9zM551.2 309.5c-8.3 7-1.7 20.1 9.1 18.1 6.3-1.2 9.8-7.7 7.7-14.1-2.2-6.5-11.2-8.7-16.8-4zM611.7 308.1c-2.4 1.4-4.7 6.2-4.7 10 0 2.2 1 4.1 3.4 6.5 7.3 7.3 17.6 2.4 17.6-8.2 0-5.3-4.5-9.4-10.2-9.4-2.4 0-5.1.5-6.1 1.1zM521.5 339.2c-5 4.5-4.9 12.7.3 16.8 2.1 1.7 3.6 2.1 6.9 1.7 5.1-.5 7.1-2 9-6.5 4-9.7-8.4-18.8-16.2-12zM580.1 339.9c-5.3 4.9-3.9 13.7 2.6 17 6.9 3.5 15.3-1.7 15.3-9.5 0-9.3-11.1-13.9-17.9-7.5zM639.8 339.9c-2.8 2.5-3.3 3.6-3.3 7.6 0 4 .5 5.1 3.4 7.7 3 2.6 3.9 3 7.7 2.5 5.2-.5 7.2-2 9.1-6.5 4.3-10.3-8.5-18.8-16.9-11.3zM549.9 369.9c-2.4 2.4-2.9 3.8-2.9 7.6 0 6.5 3.9 10.5 10.2 10.5 10-.1 14.4-10.6 7.4-17.6-4.6-4.6-10.4-4.8-14.7-.5zM609.4 370.4c-2.6 2.6-3.4 4.2-3.4 7.1 0 5.5 5.2 10.5 11 10.5s10-4.1 10-10c0-5.2-1.3-7.6-5-9.5-4.9-2.5-8.8-1.9-12.6 1.9zM668.9 369.9c-2.4 2.4-2.9 3.8-2.9 7.6 0 10 10.5 14.2 17.6 7.1 2.6-2.6 3.4-4.2 3.4-7.1 0-2.9-.8-4.5-3.4-7.1-4.6-4.6-10.4-4.8-14.7-.5zM521.4 398.9c-9.1 5.6-4.8 19.1 6 19.1 6.9 0 11.5-5.6 10.2-12.4-1.3-7-10-10.6-16.2-6.7zM582.4 398c-5.6 2.2-7.9 9.3-4.9 15 1.9 3.7 4.3 5 9.5 5 7.8 0 12.3-7.8 8.9-15.3-2.1-4.6-8.4-6.8-13.5-4.7zM640.8 398.5c-6.5 3.6-7.3 12.2-1.7 16.9 8.5 7.2 20.8-1.6 16.5-11.7-.7-1.8-2-3.8-2.9-4.5-2.5-2.1-8.8-2.4-11.9-.7zM549.5 430.3c-2.8 2.8-3.5 4.3-3.5 7.4 0 7.3 6.3 12.2 13.2 10.3 4.7-1.4 6.9-4.1 7.5-9.3.5-3.8.1-4.8-2.3-7.6-2.1-2.3-4.1-3.4-7.1-3.8-3.9-.5-4.6-.2-7.8 3zM610.8 428.6c-3.1 1.6-5.8 6.1-5.8 9.6 0 6.2 6.8 11.3 13.3 10.1 3.9-.8 7.9-5.5 8-9.7.2-8.8-8-14.2-15.5-10zM668.5 430.3c-2.8 2.8-3.5 4.3-3.5 7.4 0 7.4 6.3 12.2 13.4 10.2 11-3 9.2-19.1-2.2-20.6-3.7-.5-4.5-.2-7.7 3zM523.4 457.7c-3.8.7-7.6 5.8-7.8 10.2-.2 7.7 8.5 13.2 15.3 9.7 3.3-1.7 6.1-6.2 6.1-9.6 0-3.7-3-8.1-6.5-9.6-1.9-.8-3.8-1.3-4.2-1.3-.4.1-1.8.4-2.9.6zM581 458.8c-4.4 2.2-6.2 5.6-5.6 10.6.7 5.8 4.4 9.1 10.2 9.1 3.9 0 5-.5 7.5-3.3 5.2-5.8 3.4-13.8-3.7-16.8-4.2-1.8-4.2-1.8-8.4.4zM642.3 457.7c-2.9.6-7 4.8-7.5 7.8-1.7 8.9 7.3 16.1 15.1 12.1 3.3-1.7 6.1-6.2 6.1-9.6 0-3.7-3-8.1-6.5-9.6-1.9-.8-3.8-1.3-4.2-1.3-.4.1-1.8.4-3 .6zM612.5 487.8c-2.9.6-7.3 5.1-8 8.2-1.3 6 4.4 13 10.5 13 3.4 0 7.9-2.8 9.6-6.1 3.9-7.6-3.4-16.8-12.1-15.1zM671.3 488.2c-4.4 1.1-7.3 5.2-7.3 10 0 3.2.7 4.7 3.5 7.5 3.2 3.2 3.9 3.5 7.8 3 8.3-1.1 12.1-9.2 7.7-16.5-1.1-1.7-2.1-3.2-2.2-3.2-.2 0-1.7-.4-3.3-.8-1.7-.5-4.4-.5-6.2 0zM547.9 490.9c-6.2 6.2-2.2 16.6 6.8 17.8 3.9.5 4.6.2 7.8-3 2.9-2.9 3.5-4.2 3.5-7.7 0-6.1-4.1-10-10.5-10-3.8 0-5.2.5-7.6 2.9zM517.9 520.9c-2.3 2.3-2.9 3.8-2.9 7.1 0 5.2 1.3 7.6 5 9.5 4.9 2.5 8.8 1.9 12.6-1.9 7-7 2.6-17.5-7.4-17.6-3.5 0-4.9.6-7.3 2.9zM577.3 521.5c-3.2 3.2-3.5 3.9-3 7.8.4 3 1.5 5 3.8 7.1 2.8 2.4 3.8 2.8 7.6 2.3 5.1-.5 8-2.8 9.2-7.1 1.8-7.1-3-13.6-10.1-13.6-3.3 0-4.7.7-7.5 3.5zM636.9 520.9c-2.3 2.3-2.9 3.8-2.9 7.1 0 5.2 1.3 7.6 5 9.5 4.9 2.5 8.8 1.9 12.6-1.9 7-7 2.6-17.5-7.4-17.6-3.5 0-4.9.6-7.3 2.9zM547.4 551.4c-7.3 7.3-2.4 17.6 8.2 17.6 5.2 0 9.4-4.5 9.4-10 0-5.2-1.3-7.6-5-9.5-4.9-2.5-8.8-1.9-12.6 1.9zM608.1 549.6c-3.6 2.6-5.4 7.9-4.1 12 2.5 7.6 11.2 9.9 17.2 4.5 2.8-2.5 3.3-3.6 3.3-7.6 0-4-.5-5.1-3.3-7.6-3.8-3.4-9.3-3.9-13.1-1.3zM668.1 549.4c-3 1.7-5 5.2-5.1 8.9-.1 9.5 10.9 14.3 17.9 7.8 2.6-2.4 3.1-3.7 3.1-7.3-.1-8.5-8.5-13.5-15.9-9.4zM517.4 581.4c-7.1 7.1-2.9 17.6 7.1 17.6s14.2-10.5 7.1-17.6c-2.6-2.6-4.2-3.4-7.1-3.4-2.9 0-4.5.8-7.1 3.4zM579.3 579c-1.3.5-3.2 2.4-4.3 4.2-6.3 10 6.8 20.9 15.8 13.3 1.7-1.4 3.3-3.8 3.7-5.4.7-3.2-1.3-8.8-3.8-10.9-2.1-1.8-8.6-2.4-11.4-1.2zM638.1 579.4c-5.8 3.2-6.9 11.9-2.2 16.7 2.3 2.3 3.8 2.9 7.1 2.9 5.2 0 7.6-1.3 9.5-5 2.5-4.9 1.9-8.8-1.9-12.6-3.7-3.7-8.1-4.4-12.5-2zM549.3 609c-2.8 1.1-6.3 6.6-6.3 9.8 0 1.3.7 3.6 1.5 5.2 4 7.7 15.6 6.8 19.1-1.5 3.6-8.7-5.3-17.1-14.3-13.5zM608 609.6c-4 2.8-4.9 4.6-5 9.1 0 7.3 6.4 12.1 13.8 10.1 7-1.9 9.3-12.1 3.9-17.5-3.2-3.3-9.3-4-12.7-1.7zM668.4 608.9c-1.2.5-3.1 2.2-4.4 3.8-1.7 2.2-2.1 3.7-1.7 7.1.5 5 2.8 7.9 7.1 9.1 10.5 2.7 18-9 10.9-16.9-3-3.3-8.2-4.6-11.9-3.1zM519.4 639.4c-4.1 1.8-6.4 5.2-6.4 9.6 0 9.9 12.1 14.4 18.4 6.9 7.2-8.6-1.9-21-12-16.5zM578.4 639.4c-3.8 1.7-6.8 7.5-5.9 11.6.8 3.9 5 7.8 9 8.6 6 1.1 12.5-4.4 12.5-10.6 0-3.7-3-8.1-6.5-9.6-4.2-1.7-5.1-1.7-9.1 0zM638.4 639.4c-6.9 3-8.6 11.1-3.5 16.8 2.5 2.8 3.6 3.3 7.6 3.3 4 0 5.1-.5 7.6-3.3 5-5.6 3.6-13.3-3.1-16.7-3.5-1.8-4.6-1.8-8.6-.1zM546.4 670.8c-9.9 7.9-.8 22.7 10.9 17.8 6.8-2.8 8.3-11.7 2.9-17.1-3.1-3.1-10.4-3.5-13.8-.7zM604.9 671.9c-8.1 8.1 1.8 21.9 11.9 16.7 6.9-3.6 8.4-11.5 3.3-16.7-2.4-2.4-3.8-2.9-7.6-2.9s-5.2.5-7.6 2.9zM665.7 670.1c-2.2 1.3-4.7 6.1-4.7 9.1 0 3.8 3.5 8.5 7.4 9.8 4.4 1.4 9.8-.1 12.1-3.3 2.4-3.5 1.9-10-1.1-13.6-2.2-2.7-3.2-3.1-7.2-3.1-2.6 0-5.5.5-6.5 1.1zM515.7 701.6c-3.3 3.3-4.1 5.7-3.3 9.9.8 4.2 5.7 8.5 9.7 8.5 3.7 0 8.5-2.4 9.9-4.9.5-1.1 1-3.8 1-6.1 0-6-4.1-10-10.3-10-3.4 0-5 .6-7 2.6zM575.5 701.2c-7.6 6.7-3 18.8 7.2 18.8 4 0 8.9-4 9.8-8 .9-4-1-9.5-4-11.4-3.6-2.4-9.9-2.1-13 .6zM635.4 700.8c-2.9 2.3-4.4 5.4-4.4 9.2 0 4.4 5.6 10 9.9 10 10.1 0 15.1-11.1 8.2-18.1-2.4-2.3-3.8-2.9-7.3-2.9-2.6 0-5.2.7-6.4 1.8zM546.1 730.6c-3.6 2.6-5.4 7.9-4.1 12 2.5 7.6 11.2 9.9 17.2 4.5 2.8-2.5 3.3-3.6 3.3-7.6 0-4-.5-5.1-3.3-7.6-3.8-3.4-9.3-3.9-13.1-1.3zM605.8 730.6c-6.4 3.4-6.6 12.7-.4 17.6 4.5 3.7 12.7 1.6 15.5-3.9 4.8-9.4-5.6-18.9-15.1-13.7zM664.2 731.5c-3.6 3-4.7 6.6-3.2 11.1s5.4 7.4 9.9 7.4c4.4 0 7.5-2 9.7-6.2 5.1-9.8-7.8-19.5-16.4-12.3zM287.4 217c-8.9 3.6-8.1 17 1.2 20 11.8 3.9 19.1-14.1 7.9-19.5-3.6-1.7-5.9-1.8-9.1-.5zM257.4 246.9c-6.7 2.9-8.5 12.1-3.5 17.2 2.4 2.4 3.8 2.9 7.6 2.9 6.3 0 10.5-3.9 10.5-9.9 0-7.4-8-13-14.6-10.2zM316.3 247.4c-3.3 1.5-6.3 6-6.3 9.6 0 2.9 2.7 7.7 4.9 9 1.1.5 4 1 6.4 1 7.4 0 11.6-6 9.5-13.6-1.6-5.8-8.5-8.6-14.5-6zM286.3 277.4c-3.4 1.6-6.3 6.1-6.3 9.9 0 4.1 4.1 9.1 8.3 10.1 10 2.5 17-9.7 10-17.4-3.3-3.6-7.6-4.5-12-2.6zM252.9 309.9c-4.3 4.3-4.1 10.1.5 14.7 2.6 2.6 4.2 3.4 7.1 3.4 2.9 0 4.5-.8 7.1-3.4 7.1-7.1 2.9-17.6-7.1-17.6-3.8 0-5.2.5-7.6 2.9zM312.9 309.9c-4.8 4.9-3.4 14.2 2.6 16.9 4.7 2.2 8.4 1.5 12.1-2.2 3.8-3.8 4.4-7.7 1.9-12.6-1.9-3.7-4.3-5-9.5-5-3.3 0-4.8.6-7.1 2.9zM283.7 339c-8.2 6.5-3.4 19 7.2 19 2 0 4.2-1.1 6.3-2.9 2.8-2.5 3.3-3.6 3.3-7.6 0-4-.5-5.1-3.3-7.6-4-3.6-9.6-3.9-13.5-.9zM254.1 368.6c-1.3.9-2.9 3.1-3.7 5-4.3 10.2 8 19 16.5 11.8 7.5-6.3 3-18.4-6.9-18.4-2 0-4.6.7-5.9 1.6zM314.1 368.4c-3.2 1.8-5 5.3-5.1 9.9-.1 10.5 15 13.6 19.9 4 4.7-9.2-5.6-19-14.8-13.9zM284.5 398.1c-3.7 2.1-5.5 5.3-5.5 9.7 0 6 4.1 10.2 10 10.2 5.2 0 7.6-1.3 9.5-5 2.3-4.5 1.9-8.5-1.2-12-3.1-3.5-9.4-4.9-12.8-2.9zM345 397.7c-5.3 1.9-8.2 8.9-6 14.3 4.2 10.1 20 7 20-4 0-2.3-.5-5-1-6.1-2-3.6-8.6-5.8-13-4.2zM314.4 428c-3.5 1.4-6.4 5.9-6.4 10 0 7.4 7.6 12.4 14.5 9.6 4.3-1.8 6.5-5.2 6.5-9.9 0-3.1-.7-4.6-3.4-7.3-3.5-3.5-6.8-4.2-11.2-2.4zM372.3 429c-4.5 2.7-6.2 8.4-3.9 13.2 2 4.2 5.4 6.2 10.2 6.1 4.7-.1 8-2.5 9.4-6.8 1.6-4.8-.2-10-4.4-12.6-4-2.4-7.3-2.4-11.3.1zM430.5 430.3c-2.8 2.8-3.5 4.3-3.5 7.5 0 7.6 7.4 12.7 14.3 9.9 10.4-4.4 8.3-18.9-3-20.4-3.9-.5-4.6-.2-7.8 3zM344.2 458.1c-3.7 1.1-7.2 5.9-7.2 9.9 0 3.7 3.3 8.5 6.9 10 4.1 1.7 10.4-.1 12.7-3.5 2-3 2.2-8.6.5-11.8-2.2-4.1-7.7-6.1-12.9-4.6zM404.3 457.7c-1.2.2-3.4 1.8-4.8 3.4-7.8 9.3 3.5 22.5 13.5 15.7 10-6.8 3.3-21.5-8.7-19.1zM374.3 488.2c-4.5 1.2-7.3 5.1-7.3 10.2 0 4.9 1.8 7.9 5.9 9.6 9.1 3.7 17.8-5.5 13.6-14.3-2.3-4.8-6.9-6.9-12.2-5.5zM433.2 488.2c-3.9 1-7.2 5.8-7.2 10.5 0 4.3 4.1 9 8.6 9.9 7 1.3 12.4-3.3 12.4-10.5 0-7.1-6.6-11.8-13.8-9.9zM880.8 217.7c-3.5 2.2-5.2 6.4-4.5 10.9 2.2 13.2 20.7 10.9 20.7-2.5 0-7.3-10-12.4-16.2-8.4zM851.5 247.5c-4.1 2-5.7 5-5.7 9.9.2 11.9 19 13.3 20.8 1.6.3-1.9.1-4.7-.5-6.2-2-5.3-9.4-8-14.6-5.3zM911.3 247.4c-3.3 1.5-6.3 6-6.3 9.6 0 2.9 2.7 7.7 4.9 9 1.1.5 3.8 1 6.1 1 3.3 0 4.8-.6 7.1-2.9 8-8.1-1.4-21.3-11.8-16.7zM880.3 278c-6.2 3.7-7.2 10.8-2.4 16.2 2.5 2.8 3.6 3.3 7.6 3.3 4 0 5.1-.5 7.6-3.3 5.2-5.8 3.4-13.8-3.7-16.8-4.4-1.8-5.3-1.8-9.1.6zM847.9 309.9c-4.7 4.8-3.7 13 2.1 16.4 8.8 5.2 18.9-3.9 15-13.4-1.7-4.1-4.7-5.9-9.8-5.9-3.5 0-4.9.6-7.3 2.9zM907.8 309.3c-5 4.7-4.9 11.8.3 16.1 7.9 6.7 19.5-.9 16.8-10.9-2-7.2-11.8-10.1-17.1-5.2zM879.1 338.4c-3.1 1.7-5 5.3-5.1 9.4 0 2.6.9 4.3 3.4 6.8 3.8 3.8 7.7 4.4 12.6 1.9 3.7-1.9 5-4.3 5-9.5 0-8-8.6-12.6-15.9-8.6zM849.1 368.4c-4.8 2.7-6.4 9.1-3.6 14.6 1.9 3.7 4.3 5 9 5s7.1-1.3 9-5c5.1-9.9-4.8-19.9-14.4-14.6zM906.8 369.9c-2.8 2.5-3.3 3.6-3.3 7.6 0 4 .5 5.1 3.3 7.6 5.8 5.2 13.8 3.4 16.9-3.8 4.3-10.4-8.5-18.9-16.9-11.4zM879.5 397.9c-10.3 4.3-7 20.1 4.3 20.1 6.1 0 10.2-4 10.2-10 0-5.2-1.3-7.6-5-9.5-3.2-1.6-6.4-1.8-9.5-.6zM849.5 427.9c-5.9 2.5-8.4 11.4-4.5 16.3 6.2 7.9 19 3.6 19-6.4 0-3.2-.7-4.7-3.4-7.4-3.5-3.5-6.8-4.2-11.1-2.5zM908.2 428.3c-9.4 5.3-6 20 4.7 20 5.4 0 8.8-2.4 10.2-7.2.9-3.2.9-4.7-.1-7.2-2.4-5.7-9.6-8.4-14.8-5.6zM878.2 458.5c-4.6 2-6.8 7.5-5.2 12.7 2.9 10 17.1 9.9 20.1-.1 2.6-8.8-6.2-16.4-14.9-12.6zM851 487.7c-8.5 2.4-11.7 10.9-6.4 17.2 4.4 5.2 13.2 5.1 16.9-.3 2.3-3.2 1.9-10-.7-13.1-2.4-2.6-7.2-4.5-9.8-3.8zM909.3 488.2c-9.1 2.4-10 16.2-1.3 19.8 6.4 2.7 13.5-1.4 14.6-8.2.6-3.4-1.3-8.9-3.6-10.3-2.5-1.5-6.7-2.1-9.7-1.3zM875.1 520.6c-5.9 4.9-4.7 13.7 2.4 17.1 5 2.4 10.2.9 13.3-3.7 6.8-10-6.4-21.3-15.7-13.4zM787.1 549.4c-3.2 1.8-5 5.3-5.1 9.8 0 2.8.7 4.4 3.1 6.7 6.6 6.7 17.9 2.1 17.9-7.3 0-8.2-8.7-13.2-15.9-9.2zM844.8 550.9c-2.8 2.5-3.3 3.6-3.3 7.6 0 4 .5 5.1 3.3 7.6 5.8 5.2 13.8 3.4 16.9-3.8 4.3-10.4-8.5-18.9-16.9-11.4zM905.8 549.6c-3.6 1.9-4.8 4.3-4.8 9.4 0 8.1 8.2 12.5 15.9 8.6 4.9-2.6 6.5-9.4 3.4-14.6-2.9-4.9-9.1-6.4-14.5-3.4zM757.5 579.2c-3.7 2-5.5 5.2-5.5 9.6 0 11.2 15.8 14.4 20 4.2 3.7-9-6.2-18.4-14.5-13.8zM814.4 581.4c-4.9 4.9-4.5 11.4 1 15.8 2.7 2.2 9.4 2.3 12.5.2 6-4.2 5.8-13.8-.2-17.4-5-3.1-9.3-2.6-13.3 1.4zM875.3 579.9c-8.4 5.3-4.6 19.1 5.4 19.1 4.6 0 7.9-1.8 9.8-5.5 5.1-9.4-6-19.4-15.2-13.6zM726.8 609.6c-3.6 1.9-4.8 4.3-4.8 9.3 0 5.9 4.2 10.4 9.6 10.4 11 0 15.5-13 6.5-19-3.9-2.6-7.4-2.9-11.3-.7zM787.4 608.9c-6 2.6-8.3 11.4-4.3 16.5 6 7.6 18.9 3.3 18.9-6.4 0-7.3-8.1-12.8-14.6-10.1zM845.4 609.9c-5.8 3.6-6.6 11.7-1.5 16.4 6.1 5.9 16.1 2.6 17.7-5.8.7-4.2-1.7-9-5.6-11-3.9-2-6.8-1.9-10.6.4z" />
    </svg>
  )
}
export function DashboardLogo(props: React.SVGProps<SVGSVGElement>){
  return <MdDashboard {...props} />

}
<MdDashboard />
export function VercelLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      aria-label="Vercel logomark"
      height="64"
      role="img"
      viewBox="0 0 74 64"
    >
      <path
        d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
