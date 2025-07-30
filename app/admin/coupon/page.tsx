import AdminLayout from '@/components/admin/AdminLayout'
import Coupon from './Coupon'

export const metadata = {
  title: 'Create Coupons',
}
const AdminOrdersPage = () => {
  return (
    <AdminLayout activeItem="Create Coupons">
      <Coupon />
    </AdminLayout>
  )
}

export default AdminOrdersPage
