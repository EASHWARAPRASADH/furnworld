export const metadata = { title: "Furn World admin", robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <>{children}</>;
}
