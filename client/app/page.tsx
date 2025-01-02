import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen">
      <h1 className="text-5xl font-bold">Home page is on going...</h1>
      <Link href={'/projects'} className="primaryBtn">Go to Project Dashboard page</Link>
    </div>
  );
}
