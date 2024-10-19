"use client";
import { useState, useEffect } from "react";
import { Home, RefreshCcw, Clock, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createOnRamp } from "../../lib/actions/createOnRamp";
import { number } from "zod";

// Mock function to simulate fetching transactions from backend
const fetchTransactions = async () => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: 1,
      type: "Received",
      amount: 200,
      date: "2024-03-30",
      status: "success",
    },
    {
      id: 2,
      type: "Sent",
      amount: 50,
      date: "2024-03-29",
      status: "processing",
    },
    {
      id: 3,
      type: "Received",
      amount: 100,
      date: "2024-03-28",
      status: "failure",
    },
  ];
};

interface data {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
}

interface onRamp {
  amount: number;
  provider: string;
  //   id: number;
}

export default function Component() {
  const session = useSession();
  const [transactions, setTransactions] = useState<data[]>();
  const [onRamp, setOnRamp] = useState<onRamp>({
    amount: 0,
    provider: "",
    // id: parseInt(session.data?.user?.id),
  });

  console.log(onRamp);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTransactions = async () => {
      setIsLoading(true);
      const data = await fetchTransactions();
      setTransactions(data);
      setIsLoading(false);
    };
    getTransactions();
  }, []);

  const getStatusStyle = (status: any) => {
    switch (status) {
      case "success":
        return "bg-green-900 text-green-300 border-green-500";
      case "processing":
        return "bg-yellow-900 text-yellow-300 border-yellow-500";
      case "failure":
        return "bg-red-900 text-red-300 border-red-500";
      default:
        return "bg-gray-700 text-gray-300 border-gray-500";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createOnRamp(onRamp);
    console.log(response);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-8 text-gray-100">PayTM</h1>
        <nav className="space-y-4">
          <a
            href="#"
            className="flex items-center space-x-2 text-gray-300 hover:text-gray-100"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 text-gray-300 hover:text-gray-100"
          >
            <RefreshCcw className="h-5 w-5" />
            <span>Transfer</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 text-gray-300 hover:text-gray-100"
          >
            <Clock className="h-5 w-5" />
            <span>Transactions</span>
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-100">Transfer</h2>
          <Button className="bg-red-600 hover:bg-red-700 text-gray-100">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Money */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Add Money</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium mb-1 text-gray-300"
                  >
                    Amount
                  </label>
                  <Input
                    id="amount"
                    placeholder="Enter amount"
                    className="bg-gray-700 text-gray-200 border-gray-600"
                    onChange={(e) =>
                      setOnRamp({
                        ...onRamp,
                        amount: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="bank"
                    className="block text-sm font-medium mb-1 text-gray-300"
                  >
                    Bank
                  </label>
                  <Select
                    value={onRamp.provider}
                    onValueChange={(value) =>
                      setOnRamp({ ...onRamp, provider: value })
                    }
                  >
                    <SelectTrigger
                      id="bank"
                      className="bg-gray-700 text-gray-200 border-gray-600"
                    >
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-gray-200 border-gray-700">
                      <SelectItem
                        value="hdfc"
                        className="focus:bg-gray-700 focus:text-gray-100"
                      >
                        HDFC Bank
                      </SelectItem>
                      <SelectItem
                        value="sbi"
                        className="focus:bg-gray-700 focus:text-gray-100"
                      >
                        SBI
                      </SelectItem>
                      <SelectItem
                        value="icici"
                        className="focus:bg-gray-700 focus:text-gray-100"
                      >
                        ICIC Bank
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-gray-100">
                  Add Money
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Balance */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-100 mb-2">
                200 INR
              </div>
              <div className="text-gray-400">Total Balance</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-300">Loading transactions...</p>
            ) : (
              <ul className="space-y-4">
                {transactions?.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-200">
                        {transaction.type} INR
                      </p>
                      <p className="text-sm text-gray-400">
                        {transaction.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getStatusStyle(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                      <span
                        className={
                          transaction.type === "Received"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {transaction.type === "Received" ? "+" : "-"} Rs{" "}
                        {transaction.amount}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
