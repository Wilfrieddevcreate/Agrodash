"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Product, ProductCategory } from "@/lib/types";
import { useT } from "@/components/providers/language-provider";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductForm({ open, onOpenChange, product }: ProductFormProps) {
  const t = useT();
  const [category, setCategory] = React.useState<ProductCategory>(
    product?.category ?? "seeds"
  );

  React.useEffect(() => {
    if (product) setCategory(product.category);
  }, [product]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onOpenChange(false);
    toast.success(product ? t.common.toast.saved : t.common.toast.created, {
      description: product
        ? `${product.name} was updated.`
        : "Your new product has been added.",
    });
  }

  const categoryOptions = (Object.keys(t.products.categories) as ProductCategory[]).map(
    (k) => ({ label: t.products.categories[k], value: k })
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={product ? t.products.form.editTitle : t.products.form.addTitle}
        description={
          product
            ? `SKU · ${product.sku}`
            : "Fill in the details to add a product to your catalog."
        }
        widthClass="max-w-2xl"
      >
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <DialogBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name" className="mb-1.5 block">
                {t.products.form.name}
              </Label>
              <Input
                id="name"
                defaultValue={product?.name ?? ""}
                placeholder="NPK 20-10-10 Fertilizer"
                required
              />
            </div>
            <div>
              <Label htmlFor="sku" className="mb-1.5 block">
                {t.products.form.sku}
              </Label>
              <Input
                id="sku"
                defaultValue={product?.sku ?? ""}
                placeholder="FERT-NPK-201010"
                required
              />
            </div>
            <div>
              <Label className="mb-1.5 block">{t.products.form.category}</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as ProductCategory)}
                options={categoryOptions}
              />
            </div>
            <div>
              <Label htmlFor="price" className="mb-1.5 block">
                {t.products.form.price}
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                defaultValue={product?.price ?? 0}
                required
              />
            </div>
            <div>
              <Label htmlFor="cost" className="mb-1.5 block">
                {t.products.form.cost}
              </Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                defaultValue={product?.cost ?? 0}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock" className="mb-1.5 block">
                {t.products.form.stock}
              </Label>
              <Input
                id="stock"
                type="number"
                defaultValue={product?.stock ?? 0}
                required
              />
            </div>
            <div>
              <Label htmlFor="reorder" className="mb-1.5 block">
                {t.products.form.reorder}
              </Label>
              <Input
                id="reorder"
                type="number"
                defaultValue={product?.reorderPoint ?? 0}
              />
            </div>
            <div>
              <Label htmlFor="unit" className="mb-1.5 block">
                {t.products.form.unit}
              </Label>
              <Input
                id="unit"
                defaultValue={product?.unit ?? ""}
                placeholder="kg / bag / L / unit"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="supplier" className="mb-1.5 block">
                {t.products.form.supplier}
              </Label>
              <Input
                id="supplier"
                defaultValue={product?.supplier ?? ""}
                placeholder="Supplier name"
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {t.products.form.cancel}
            </Button>
            <Button type="submit" size="sm">
              {t.products.form.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
