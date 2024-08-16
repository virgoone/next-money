import React from "react";

import { motion } from "framer-motion";

import StatisticsCard from "@/components/StatisticsCard";

export default async function AdminPage() {
  return (
    <>
      <div className="flex flex-col">
        {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
            </div>
          </div>
        </div> */}
        <div className="flex-1 space-y-4 p-4">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-3">
            {/* {count && "subscribers" in count && (
              <StatisticsCard title="总订阅" count={count.subscribers} />
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}
