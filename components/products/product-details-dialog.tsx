'use client';

import Image from 'next/image';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductDetailsDialog({
  open,
  onOpenChange,
  product,
  onEdit,
  onDelete,
}: ProductDetailsDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>

          {/* Product Info */}
          <div className="grid gap-4">
            {/* Name */}
            <div>
              <h3 className="text-2xl font-bold">{product.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">ID: {product.id}</p>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="mt-1">{product.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Price */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Price</label>
                <p className="mt-1 text-2xl font-bold">${product.price}</p>
              </div>

              {/* Stock */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Stock</label>
                <div className="mt-1">
                  <Badge
                    variant={
                      product.stock === 0
                        ? 'destructive'
                        : product.stock < 10
                          ? 'secondary'
                          : 'default'
                    }
                    className="text-base"
                  >
                    {product.stock} units
                  </Badge>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Category
                </label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-base">
                    {product.category}
                  </Badge>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge
                    variant={product.status ? 'default' : 'secondary'}
                    className="text-base"
                  >
                    {product.status ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onDelete(product);
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(product);
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}