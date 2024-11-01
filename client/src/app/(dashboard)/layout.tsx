import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <div>
        <Sidebar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
