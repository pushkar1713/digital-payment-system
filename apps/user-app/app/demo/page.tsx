"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export default function Component() {
  const session = useSession();
  // In a real application, you would fetch this data from an API or database
  const user = {
    id: "12345",
    username: session.data?.user?.name || "",
    email: session.data?.user?.email,
    avatarUrl: "https://pbs.twimg.com/media/F16AF4wWYAwhwVC.jpg",
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
      </Card>
    </div>
  );
}
