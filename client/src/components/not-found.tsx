import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-slate-400 mb-8">The page you are looking for does not exist.</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
