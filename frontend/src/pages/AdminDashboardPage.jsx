import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, MessageSquare, LogOut, TrendingUp,
  DollarSign, ShoppingBag, Inbox,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { useFetch } from '../hooks/useFetch';
import { getOrders } from '../services/orderService';
import { getMessages } from '../services/messageService';
import { logout } from '../services/authService';
import { formatCurrency, formatDate } from '../utils';

const STATUS_VARIANT = {
  Pending: 'warning',
  'Measurements Received': 'gold',
  'In Production': 'gold',
  Shipped: 'success',
  Delivered: 'success',
};

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-luxury flex items-center gap-4 p-6"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-brown-400">{label}</p>
        <p className="font-serif text-2xl text-brown-900">{value}</p>
      </div>
    </motion.div>
  );
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const { data: orders, loading: ordersLoading } = useFetch(getOrders, []);
  const { data: messages, loading: messagesLoading } = useFetch(getMessages, []);

  const totalRevenue = (orders || []).reduce((sum, o) => sum + o.total, 0);
  const unreadCount = (messages || []).filter((m) => !m.read).length;

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const TABS = [
    { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', Icon: Package },
    { id: 'messages', label: 'Messages', Icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-cream-50 pt-24">
      <div className="container-luxury py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl text-brown-900">Dashboard</h1>
            <p className="text-sm text-brown-500">Welcome back, Administrator.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="btn-base border border-brown-300 px-5 py-2.5 text-sm text-brown-700 hover:border-gold-500">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="btn-base bg-brown-900 px-5 py-2.5 text-sm text-cream-50 hover:bg-brown-800"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-2 border-b border-brown-100">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'border-gold-500 text-gold-700'
                  : 'border-transparent text-brown-500 hover:text-brown-800'
              }`}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              <t.Icon className="h-4 w-4" />
              {t.label}
              {t.id === 'messages' && unreadCount > 0 && (
                <span className="ml-1 rounded-full bg-red-100 px-1.5 text-xs text-red-600">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={ShoppingBag} label="Total Orders" value={(orders || []).length} accent="bg-gold-100 text-gold-700" />
                <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(totalRevenue)} accent="bg-emerald-100 text-emerald-700" />
                <StatCard icon={Inbox} label="Unread Messages" value={unreadCount} accent="bg-blue-100 text-blue-700" />
                <StatCard icon={TrendingUp} label="Avg. Order" value={formatCurrency(Math.round(totalRevenue / (orders?.length || 1)))} accent="bg-brown-200 text-brown-700" />
              </div>

              <div className="card-luxury overflow-hidden">
                <div className="border-b border-brown-100 px-6 py-4">
                  <h2 className="font-serif text-xl text-brown-900">Recent Orders</h2>
                </div>
                {ordersLoading ? (
                  <div className="flex justify-center py-12"><Spinner /></div>
                ) : (
                  <OrdersTable orders={(orders || []).slice(0, 4)} />
                )}
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="card-luxury overflow-hidden">
              <div className="border-b border-brown-100 px-6 py-4">
                <h2 className="font-serif text-xl text-brown-900">All Orders</h2>
              </div>
              {ordersLoading ? (
                <div className="flex justify-center py-12"><Spinner /></div>
              ) : (
                <OrdersTable orders={orders || []} />
              )}
            </div>
          )}

          {tab === 'messages' && (
            <div className="space-y-4">
              {messagesLoading ? (
                <div className="flex justify-center py-12"><Spinner /></div>
              ) : (messages || []).length === 0 ? (
                <p className="text-center text-brown-500">No messages yet.</p>
              ) : (
                (messages || []).map((msg) => (
                  <motion.article
                    key={msg.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-luxury p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-brown-900">{msg.name}</h3>
                          {!msg.read && <Badge variant="error">New</Badge>}
                        </div>
                        <p className="text-sm text-brown-500">{msg.email}</p>
                      </div>
                      <span className="text-xs text-brown-400">{formatDate(msg.date)}</span>
                    </div>
                    <p className="mt-2 font-medium text-brown-800">{msg.subject}</p>
                    <p className="mt-2 text-sm leading-relaxed text-brown-600">{msg.message}</p>
                  </motion.article>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrdersTable({ orders }) {
  if (orders.length === 0) {
    return <p className="px-6 py-12 text-center text-brown-500">No orders to display.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-cream-50 text-xs uppercase tracking-wider text-brown-400">
          <tr>
            <th className="px-6 py-3 font-medium">Order</th>
            <th className="px-6 py-3 font-medium">Customer</th>
            <th className="px-6 py-3 font-medium">Product</th>
            <th className="px-6 py-3 font-medium">Date</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brown-50">
          {orders.map((order) => (
            <tr key={order.id} className="transition-colors hover:bg-cream-50/60">
              <td className="px-6 py-4 font-medium text-brown-900">{order.id}</td>
              <td className="px-6 py-4 text-brown-700">{order.customer}</td>
              <td className="px-6 py-4 text-brown-700">{order.product}</td>
              <td className="px-6 py-4 text-brown-500">{formatDate(order.date)}</td>
              <td className="px-6 py-4">
                <Badge variant={STATUS_VARIANT[order.status] || 'gold'}>{order.status}</Badge>
              </td>
              <td className="px-6 py-4 text-right font-medium text-brown-900">
                {formatCurrency(order.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboardPage;
