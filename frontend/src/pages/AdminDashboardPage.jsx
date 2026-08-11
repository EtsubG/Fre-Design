import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, MessageSquare, LogOut, TrendingUp,
  DollarSign, ShoppingBag, Inbox, Image as ImageIcon, Album,
  Plus, Trash2, Pencil, X, Upload, RefreshCw,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { useFetch } from '../hooks/useFetch';
import { getOrders } from '../services/orderService';
import { getMessages } from '../services/messageService';
import { logout } from '../services/authService';
import {
  createAlbum, updateAlbum, deleteAlbum,
  getAllProductsAdmin, createProduct, updateProduct, deleteProduct,
  uploadProductImage, deleteProductImage, addProductImage, deleteProductImageRecord,
} from '../services/adminService';
import { getAlbums } from '../services/productService';
import { formatCurrency, formatDate } from '../utils';
import { useToast } from '../context/ToastContext';

const STATUS_VARIANT = {
  Pending:              'warning',
  Tailoring:            'gold',
  'Ready for Delivery': 'gold',
  Delivered:            'success',
  Cancelled:            'error',
  'Measurements Received': 'gold',
  'In Production':         'gold',
  Shipped:                 'success',
};

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

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
  const toast = useToast();
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
    { id: 'albums', label: 'Albums & Products', Icon: Album },
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

        <div className="mt-8 flex gap-2 overflow-x-auto border-b border-brown-100">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
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

          {tab === 'albums' && <AlbumManager toast={toast} />}

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

function AlbumManager({ toast }) {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumModal, setAlbumModal]     = useState(null);
  const [productModal, setProductModal] = useState(null);
  const [saving, setSaving]             = useState(false);

  const { data: albums,   loading: albumsLoading,   refetch: refetchAlbums   } = useFetch(getAlbums, []);
  const { data: products, loading: productsLoading, refetch: refetchProducts } = useFetch(getAllProductsAdmin, []);
  const refetchAll = () => { refetchAlbums(); refetchProducts(); };

  const handleSaveAlbum = async (data) => {
    setSaving(true);
    try {
      if (data.id) { await updateAlbum(data.id, data.name, data.slug || slugify(data.name)); toast.success('Album updated.'); }
      else         { await createAlbum(data.name, data.slug || slugify(data.name));           toast.success('Album created.'); }
      setAlbumModal(null);
      refetchAlbums();
    } catch (err) { toast.error(err.message || 'Could not save album.'); }
    finally { setSaving(false); }
  };

  const handleDeleteAlbum = async (album) => {
    if (!confirm(`Delete album "${album.name}" and all its products?`)) return;
    try {
      await deleteAlbum(album.id);
      if (selectedAlbum === album.id) setSelectedAlbum(null);
      toast.success('Album deleted.');
      refetchAll();
    } catch (err) { toast.error(err.message || 'Could not delete album.'); }
  };

  const handleSaveProduct = async (data) => {
    setSaving(true);
    try {
      let productId = data.id;
      if (data.id) { await updateProduct(data.id, data); toast.success('Product updated.'); }
      else { const { data: c } = await createProduct(data); productId = c.id; toast.success('Product created.'); }
      const newImgs = (data.images || []).filter((i) => i.url?.startsWith('blob:'));
      for (let i = 0; i < newImgs.length; i++) {
        try {
          const blob = await fetch(newImgs[i].url).then((r) => r.blob());
          const file = new File([blob], `img-${Date.now()}.jpg`, { type: blob.type });
          const { data: up } = await uploadProductImage(file, productId);
          await addProductImage(productId, up.url, i);
        } catch (e) { toast.error(`Image upload failed: ${e.message}`); }
      }
      setProductModal(null);
      refetchProducts();
    } catch (err) { toast.error(err.message || 'Could not save product.'); }
    finally { setSaving(false); }
  };

  const handleDeleteProduct = async (product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try { await deleteProduct(product.id); toast.success('Product deleted.'); refetchProducts(); }
    catch (err) { toast.error(err.message || 'Could not delete product.'); }
  };

  const handleRemoveImage = async (product, imageId) => {
    try { await deleteProductImageRecord(imageId); toast.success('Image removed.'); refetchProducts(); }
    catch (err) { toast.error(err.message || 'Could not remove image.'); }
  };

  const handleAddImages = async (product, files) => {
    for (const file of files) {
      try {
        const { data: up } = await uploadProductImage(file, product.id);
        await addProductImage(product.id, up.url, (product.images || []).length);
        toast.success('Image added.');
      } catch (err) { toast.error(err.message || 'Upload failed.'); }
    }
    refetchProducts();
  };

  if (albumsLoading || productsLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  const allAlbums   = albums   || [];
  const allProducts = products || [];
  const filtered    = selectedAlbum
    ? allProducts.filter((p) => p.album?.id === selectedAlbum)
    : allProducts;
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-brown-900">Albums</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={refetchAll} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button>
          <Button onClick={() => setAlbumModal({})} leftIcon={<Plus className="h-4 w-4" />} size="sm">New Album</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button onClick={() => setSelectedAlbum(null)} className={`card-luxury p-5 text-left transition-all ${!selectedAlbum ? 'ring-2 ring-gold-500' : ''}`}>
          <Album className="h-6 w-6 text-gold-600" />
          <p className="mt-3 font-medium text-brown-900">All Products</p>
          <p className="text-sm text-brown-500">{allProducts.length} items</p>
        </button>
        {allAlbums.map((album) => (
          <div key={album.id} className={`card-luxury p-5 transition-all ${selectedAlbum === album.id ? 'ring-2 ring-gold-500' : ''}`}>
            <div className="flex items-start justify-between">
              <button onClick={() => setSelectedAlbum(album.id)} className="flex-1 text-left">
                <Album className="h-6 w-6 text-gold-600" />
                <p className="mt-3 font-medium text-brown-900">{album.name}</p>
                <p className="text-sm text-brown-500">{allProducts.filter((p) => p.album?.id === album.id).length} items</p>
              </button>
              <div className="flex gap-1">
                <button onClick={() => setAlbumModal(album)} className="rounded-lg p-1.5 text-brown-400 hover:bg-brown-100 hover:text-brown-700" aria-label="Edit album"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDeleteAlbum(album)} className="rounded-lg p-1.5 text-brown-400 hover:bg-red-100 hover:text-red-600" aria-label="Delete album"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-brown-100 pt-6">
        <h2 className="font-serif text-xl text-brown-900">
          Products{selectedAlbum ? ` — ${allAlbums.find((a) => a.id === selectedAlbum)?.name || ''}` : ''}
        </h2>
        <Button onClick={() => setProductModal({ albumId: selectedAlbum || allAlbums[0]?.id })} leftIcon={<Plus className="h-4 w-4" />} size="sm">New Product</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full py-8 text-center text-brown-500">No products yet. Create one to get started.</p>
        ) : filtered.map((product) => (
          <div key={product.id} className="card-luxury overflow-hidden">
            <div className="relative aspect-[4/3] bg-cream-100">
              {product.images?.[0]?.url
                ? <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                : <div className="flex h-full items-center justify-center"><ImageIcon className="h-8 w-8 text-brown-200" /></div>}
            </div>
            <div className="p-4">
              <p className="font-medium text-brown-900">{product.name}</p>
              <p className="text-sm text-brown-500">{product.album?.name || 'Uncategorized'}</p>
              <p className="mt-1 font-serif text-lg text-brown-900">{formatCurrency(product.price)}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {(product.images || []).slice(0, 4).map((img) => (
                  <div key={img.id} className="group relative h-12 w-12 overflow-hidden rounded-lg">
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => handleRemoveImage(product, img.id)} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100" aria-label="Remove image">
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                <label className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-brown-200 text-brown-400 transition-colors hover:border-gold-400 hover:text-gold-600" aria-label="Add image">
                  <Plus className="h-4 w-4" />
                  <input type="file" accept="image/*" multiple className="sr-only"
                    onChange={(e) => { if (e.target.files?.length) handleAddImages(product, Array.from(e.target.files)); e.target.value = ''; }} />
                </label>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setProductModal(product)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brown-200 py-2 text-sm text-brown-700 hover:border-gold-400">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => handleDeleteProduct(product)} className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {albumModal !== null && <AlbumModal album={albumModal} saving={saving} onClose={() => setAlbumModal(null)} onSave={handleSaveAlbum} />}
      {productModal !== null && <ProductModal product={productModal} albums={allAlbums} saving={saving} onClose={() => setProductModal(null)} onSave={handleSaveProduct} />}
    </div>
  );
}

function AlbumModal({ album, saving, onClose, onSave }) {
  const [name, setName] = useState(album.name || '');
  const [slug, setSlug] = useState(album.slug || '');
  return (
    <Modal onClose={onClose} title={album.id ? 'Edit Album' : 'New Album'}>
      <div className="space-y-4">
        <Input label="Album Name" required value={name}
          onChange={(e) => { setName(e.target.value); if (!album.id) setSlug(slugify(e.target.value)); }}
          placeholder="e.g. Wedding" />
        <Input label="URL Slug" value={slug} onChange={(e) => setSlug(e.target.value)}
          placeholder="auto-generated from name" hint="Used in the URL, e.g. /albums/wedding" />
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ id: album.id, name, slug })} disabled={!name.trim() || saving} loading={saving}>
            {album.id ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ProductModal({ product, albums, saving, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product.name || '', description: product.description || '',
    fabric: product.fabric || '', price: product.price || '',
    tailoringTime: product.tailoringTime || '', deliveryTime: product.deliveryTime || '',
    featured: product.featured || false, badge: product.badge || '',
    albumId: product.albumId || product.album?.id || albums[0]?.id || '',
  });
  const [images, setImages] = useState((product.images || []).map((img) => ({ ...img })));
  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleFiles = (files) => {
    const previews = files.map((f) => ({ id: `new-${Date.now()}-${Math.random()}`, url: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...previews]);
  };
  return (
    <Modal onClose={onClose} title={product.id ? 'Edit Product' : 'New Product'} size="lg">
      <div className="space-y-4">
        <Input label="Dress Name" required value={form.name} onChange={update('name')} placeholder="e.g. Aurora Bridal Kemis" />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brown-800">Album</label>
          <select value={form.albumId} onChange={update('albumId')}
            className="w-full rounded-xl border border-brown-200 bg-white px-4 py-2.5 text-sm text-brown-800 focus:border-gold-500 focus:ring-2 focus:ring-gold-200">
            {albums.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <Textarea label="Description" rows={3} value={form.description} onChange={update('description')} placeholder="Describe the dress…" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Fabric" value={form.fabric} onChange={update('fabric')} placeholder="e.g. Handwoven Cotton" />
          <Input label="Price (USD)" type="number" min="0" value={form.price} onChange={update('price')} placeholder="420" />
          <Input label="Tailoring Time" value={form.tailoringTime} onChange={update('tailoringTime')} placeholder="e.g. 3-4 weeks" />
          <Input label="Delivery Time" value={form.deliveryTime} onChange={update('deliveryTime')} placeholder="e.g. 1-2 weeks" />
          <Input label="Badge (optional)" value={form.badge} onChange={update('badge')} placeholder="e.g. New, Bestseller" />
          <label className="flex items-center gap-3 pt-6">
            <input type="checkbox" checked={form.featured} onChange={update('featured')} className="h-4 w-4 accent-gold-600" />
            <span className="text-sm font-medium text-brown-800">Featured on homepage</span>
          </label>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-brown-800">Product Images {images.length > 0 && `(${images.length})`}</label>
          {images.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {images.map((img) => (
                <div key={img.id} className="group relative h-20 w-20 overflow-hidden rounded-lg">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <button onClick={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100" aria-label="Remove image">
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brown-200 bg-cream-50 px-6 py-6 text-center transition-colors hover:border-gold-400 hover:bg-gold-50/40">
            <Upload className="h-6 w-6 text-gold-500" />
            <p className="text-sm font-medium text-brown-800">Upload images from your device</p>
            <p className="text-xs text-brown-400">JPG, PNG — multiple allowed</p>
            <input type="file" accept="image/*" multiple className="sr-only"
              onChange={(e) => { if (e.target.files?.length) handleFiles(Array.from(e.target.files)); e.target.value = ''; }} />
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-brown-100 pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (form.name.trim() && form.albumId) onSave({ ...form, id: product.id, images }); }}
            disabled={!form.name.trim() || !form.albumId || saving} loading={saving}>
            {product.id ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AdminDashboardPage;
