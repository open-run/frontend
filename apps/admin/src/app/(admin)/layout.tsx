import AdminHeader from '@components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='scrollbar-web-hidden admin-bg h-full overflow-y-auto px-16 pb-48 pt-16 app:pt-64'>
      <section className='mx-auto flex min-h-full max-w-[1040px] flex-col gap-28'>
        <AdminHeader />
        {children}
      </section>
    </main>
  )
}
