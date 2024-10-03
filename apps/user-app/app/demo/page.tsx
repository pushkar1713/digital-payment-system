"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Component() {
  const session = useSession();
  const router = useRouter();
  const user = {
    id: session.data?.user?.id || "not logged in",
    username: session?.data?.user?.name || "not logged in",
    email: session?.data?.user?.email || "not logged in",
    avatarUrl: "https://pbs.twimg.com/media/F16AF4wWYAwhwVC.jpg",
  };

  const handleLogout = () => {
    signOut();
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">User Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user.avatarUrl} alt={user.username || ""} />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full"
            aria-label="Logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
