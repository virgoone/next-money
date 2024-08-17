import { ReactNode, Suspense, useEffect } from "react";
import { redirect } from "next/navigation";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { auth, currentUser } from "@clerk/nextjs/server";

import Loading from "@/components/loading";
import AntdThemeProvider from "@/components/theme/theme-provider";

import Header from "./Header";
import { Sidebar } from "./Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // const { userId } = auth()

  // if (!userId) {
  //   redirect('/')
  // }
  try {
    const user = await currentUser();
    if (!user || !user.publicMetadata.siteOwner) {
      redirect("/");
    }
  } catch (error) {
    console.log("error-->", error);
  }

  return (
    <AntdRegistry>
      <AntdThemeProvider>
        <div className="fixed inset-0 flex overflow-hidden">
          <Sidebar />
          <section className="flex w-full min-w-0 flex-1">
            <main className="relative flex w-full flex-1 flex-col items-stretch">
              <Header />
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center p-6">
                    <Loading />
                  </div>
                }
              >
                {children}
              </Suspense>
            </main>
          </section>
        </div>
      </AntdThemeProvider>
    </AntdRegistry>
  );
}
