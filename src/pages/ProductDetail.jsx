import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Package, Tag, Box, Scale, Ruler, Truck, ShieldCheck } from 'lucide-react';
import { productApi } from '../services/productApi';
import { formatCurrency } from '../utils/formatters';
import { getStockStatus } from '../utils/productUtils';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProductById(id);
        setProduct(data);
        setActiveImage(data.images[0] || data.thumbnail);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex gap-8 flex-wrap">
        <Skeleton className="w-full md:w-[500px] h-[400px] rounded-[24px]" style={{ flex: 1, minWidth: '300px' }} />
        <div className="flex-1 flex-col gap-4 min-w-[300px]">
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="w-3/4 h-10" />
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="flex-col gap-6 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Products</span>
      </button>

      <div className="flex flex-wrap md:flex-nowrap gap-8">
        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 flex-col gap-4">
          <div className="card flex items-center justify-center p-6 bg-white dark:bg-[#1E293B]" style={{ height: '420px', borderRadius: '24px' }}>
            <img 
              src={activeImage} 
              alt={product.title} 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                className={`card flex-shrink-0 overflow-hidden ${activeImage === img ? 'ring-2 ring-accent' : ''}`}
                style={{ width: '72px', height: '72px', padding: '4px' }}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded-md" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="w-full md:w-1/2 flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="capitalize">{product.category}</Badge>
              {product.brand && <Badge variant="outline">{product.brand}</Badge>}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-warning font-medium">
                <Star size={18} fill="currentColor" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <Badge variant={stockStatus.variant}>{stockStatus.label} ({product.stock})</Badge>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-bold">{formatCurrency(product.price)}</span>
              {product.discountPercentage > 0 && (
                <span className="text-success font-medium mb-1">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <p className="text-secondary text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button size="lg" className="flex-1 min-w-[200px]">
                <ShoppingCart size={20} />
                <span>Add to Collection</span>
              </Button>
              <Button variant="outline" size="lg">
                <Heart size={20} />
                <span>Mark as Featured</span>
              </Button>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-8">
                <Tag size={16} className="text-secondary" />
                {product.tags.map(tag => (
                  <span key={tag} className="text-sm bg-bg-color px-3 py-1 rounded-full border border-color capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <MetaCard icon={Box} label="SKU" value={product.sku} />
        <MetaCard icon={Scale} label="Weight" value={`${product.weight}g`} />
        <MetaCard 
          icon={Ruler} 
          label="Dimensions" 
          value={`${product.dimensions?.width}x${product.dimensions?.height}x${product.dimensions?.depth}cm`} 
        />
        <MetaCard icon={Truck} label="Shipping" value={product.shippingInformation} />
        <MetaCard icon={ShieldCheck} label="Warranty" value={product.warrantyInformation} />
        <MetaCard icon={Package} label="Return Policy" value={product.returnPolicy} />
      </div>
    </div>
  );
};

const MetaCard = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="card p-4 flex items-start gap-3">
      <div className="p-2 bg-sidebar-hover-bg rounded-lg text-secondary">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-secondary mb-1 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
