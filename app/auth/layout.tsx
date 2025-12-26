export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main className="pt-0">  
        {children}
      </main>
    </div>
  );
}