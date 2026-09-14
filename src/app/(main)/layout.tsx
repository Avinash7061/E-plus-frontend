import BottomTabBar from "@/components/BottomTabBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex-1 w-full max-w-5xl mx-auto bg-white min-h-screen shadow-sm border-x border-zinc-100 pb-24">
        {children}
      </div>
      <BottomTabBar />
    </>
  );
}
