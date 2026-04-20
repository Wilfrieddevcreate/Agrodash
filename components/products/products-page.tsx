"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Edit3,
  Grid3x3,
  List,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { useT } from "@/components/providers/language-provider";
import { products } from "@/lib/mock-data";
import type { Product, ProductCategory, ProductStatus } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { useCurrency } from "@/components/providers/currency-provider";
import { ProductForm } from "@/components/products/product-form";

const statusVariant: Record<
  ProductStatus,
  "success" | "warning" | "destructive"
> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "destructive",
};

const PAGE_SIZE = 8;

export function ProductsPage() {
  const t = useT();
  const { format: formatCurrency } = useCurrency();
  const [view, setView] = React.useState<"table" | "grid">("table");
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<"all" | ProductCategory>("all");
  const [status, setStatus] = React.useState<"all" | ProductStatus>("all");
  const [page, setPage] = React.useState(1);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (status !== "all" && p.status !== status) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.sku.toLowerCase().includes(q) &&
        !p.supplier.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [search, category, status]);

  React.useEffect(() => setPage(1), [search, category, status, view]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const categoryOptions = [
    { label: t.products.allCategories, value: "all" },
    ...(Object.keys(t.products.categories) as ProductCategory[]).map((k) => ({
      label: t.products.categories[k],
      value: k,
    })),
  ];
  const statusOptions = [
    { label: t.products.allStatuses, value: "all" },
    { label: t.products.status.in_stock, value: "in_stock" },
    { label: t.products.status.low_stock, value: "low_stock" },
    { label: t.products.status.out_of_stock, value: "out_of_stock" },
  ];

  function handleEdit(p: Product) {
    setEditing(p);
    setFormOpen(true);
  }

  function handleDelete(p: Product) {
    toast.success(t.common.toast.deleted, { description: p.name });
  }

  return (
    <>
      <PageHeader
        eyebrow={t.products.eyebrow}
        title={t.products.title}
        description={t.products.subtitle}
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus />
            {t.products.add}
          </Button>
        }
      />

      <Card variant="flat" className="border-[color:var(--color-border)] bg-[color:var(--color-muted)]/30 shadow-none">
        <CardContent className="flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center lg:gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.products.searchPlaceholder}
              className="pl-9"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-row">
            <div className="flex gap-3">
              <div className="flex-1 sm:min-w-[170px]">
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as typeof category)}
                  options={categoryOptions}
                />
              </div>
              <div className="flex-1 sm:min-w-[160px]">
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as typeof status)}
                  options={statusOptions}
                />
              </div>
            </div>
            <div className="inline-flex items-center gap-0 self-start rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-0.5 sm:self-center">
              <button
                type="button"
                onClick={() => setView("table")}
                aria-label={t.products.table}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-md transition-all",
                  view === "table"
                    ? "bg-[color:var(--color-muted)] text-[color:var(--color-foreground)] shadow-sm"
                    : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
                )}
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label={t.products.grid}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-md transition-all",
                  view === "grid"
                    ? "bg-[color:var(--color-muted)] text-[color:var(--color-foreground)] shadow-sm"
                    : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
                )}
              >
                <Grid3x3 className="size-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package />}
            title={t.products.empty.title}
            description={t.products.empty.subtitle}
            action={
              <Button
                size="sm"
                onClick={() => {
                  setCategory("all");
                  setStatus("all");
                  setSearch("");
                }}
              >
                {t.products.resetFilters}
              </Button>
            }
          />
        ) : view === "table" ? (
          <Card className="overflow-hidden">
            {/* Mobile: stacked cards */}
            <div className="divide-y divide-[color:var(--color-border)] md:hidden">
              {paged.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.02 }}
                  className="flex gap-3 p-4"
                >
                  <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-primary)]/12 to-[color:var(--color-accent)]/20 ring-1 ring-inset ring-[color:var(--color-border)]">
                    <CategoryIcon category={p.category} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{p.name}</div>
                        <div className="truncate font-mono text-[11px] text-[color:var(--color-muted-foreground)]">
                          {p.sku}
                        </div>
                      </div>
                      <Dropdown
                        trigger={
                          <Button variant="ghost" size="iconSm" aria-label="Actions">
                            <MoreHorizontal />
                          </Button>
                        }
                      >
                        <DropdownItem icon={<Edit3 className="size-4" />} onClick={() => handleEdit(p)}>
                          {t.common.edit}
                        </DropdownItem>
                        <DropdownItem icon={<Trash2 className="size-4" />} variant="destructive" onClick={() => handleDelete(p)}>
                          {t.common.delete}
                        </DropdownItem>
                      </Dropdown>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="secondary" className="capitalize">
                        {t.products.categories[p.category]}
                      </Badge>
                      <Badge variant={statusVariant[p.status]}>
                        {t.products.status[p.status]}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
                          {t.products.stockLabel}
                        </div>
                        <div className="font-mono text-sm tabular-nums">
                          {formatNumber(p.stock)}{" "}
                          <span className="text-[11px] text-[color:var(--color-muted-foreground)]">
                            {p.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
                          {t.products.priceLabel}
                        </div>
                        <div className="font-mono text-base font-semibold tabular-nums">
                          {formatCurrency(p.price)}
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(100, (p.stock / Math.max(p.reorderPoint * 3, 1)) * 100)}
                      className="mt-2 h-1"
                      indicatorClassName={
                        p.status === "out_of_stock"
                          ? "bg-[color:var(--color-destructive)]"
                          : p.status === "low_stock"
                          ? "bg-[color:var(--color-warning)]"
                          : "bg-[color:var(--color-success)]"
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t.products.columns.product}</TableHead>
                  <TableHead>{t.products.columns.category}</TableHead>
                  <TableHead>{t.products.columns.stock}</TableHead>
                  <TableHead>{t.products.columns.price}</TableHead>
                  <TableHead>{t.products.columns.status}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t.products.columns.supplier}</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                    className="border-b border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-muted)]/40"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-primary)]/12 to-[color:var(--color-accent)]/20 ring-1 ring-inset ring-[color:var(--color-border)]">
                          <CategoryIcon category={p.category} />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {p.name}
                          </div>
                          <div className="truncate font-mono text-[11px] text-[color:var(--color-muted-foreground)]">
                            {p.sku}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {t.products.categories[p.category]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5 min-w-[120px]">
                        <div className="flex items-baseline gap-1 font-mono text-sm tabular-nums">
                          {formatNumber(p.stock)}
                          <span className="text-[11px] text-[color:var(--color-muted-foreground)]">
                            {p.unit}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            100,
                            (p.stock / Math.max(p.reorderPoint * 3, 1)) * 100
                          )}
                          className="h-1"
                          indicatorClassName={
                            p.status === "out_of_stock"
                              ? "bg-[color:var(--color-destructive)]"
                              : p.status === "low_stock"
                              ? "bg-[color:var(--color-warning)]"
                              : "bg-[color:var(--color-success)]"
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {formatCurrency(p.price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[p.status]}>
                        {t.products.status[p.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-[color:var(--color-muted-foreground)] lg:table-cell">
                      {p.supplier}
                    </TableCell>
                    <TableCell>
                      <Dropdown
                        trigger={
                          <Button variant="ghost" size="iconSm" aria-label="Actions">
                            <MoreHorizontal />
                          </Button>
                        }
                      >
                        <DropdownItem
                          icon={<Edit3 className="size-4" />}
                          onClick={() => handleEdit(p)}
                        >
                          {t.common.edit}
                        </DropdownItem>
                        <DropdownItem
                          icon={<Trash2 className="size-4" />}
                          variant="destructive"
                          onClick={() => handleDelete(p)}
                        >
                          {t.common.delete}
                        </DropdownItem>
                      </Dropdown>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {paged.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                whileHover={{ y: -2 }}
                className="group flex flex-col rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-primary)]/15 to-[color:var(--color-accent)]/25 ring-1 ring-inset ring-[color:var(--color-border)]">
                    <CategoryIcon category={p.category} />
                  </div>
                  <Badge variant={statusVariant[p.status]}>
                    {t.products.status[p.status]}
                  </Badge>
                </div>
                <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug">
                  {p.name}
                </h3>
                <div className="mt-1 font-mono text-[11px] text-[color:var(--color-muted-foreground)]">
                  {p.sku}
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="font-mono text-lg font-semibold tabular-nums">
                      {formatCurrency(p.price)}
                    </div>
                    <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
                      {t.products.costLabel} {formatCurrency(p.cost)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm tabular-nums">
                      {formatNumber(p.stock)} {p.unit}
                    </div>
                    <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
                      {p.supplier}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(p)}
                  >
                    <Edit3 />
                    {t.common.edit}
                  </Button>
                  <Button
                    size="iconSm"
                    variant="ghost"
                    onClick={() => handleDelete(p)}
                    className="text-[color:var(--color-destructive)]"
                    aria-label={t.common.delete}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
            labels={{
              showing: t.common.pagination.showing,
              of: t.common.pagination.of,
              results: t.common.pagination.results,
              prev: t.common.pagination.prev,
              next: t.common.pagination.next,
            }}
            className="mt-5"
          />
        )}
      </div>

      <ProductForm
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditing(null);
        }}
        product={editing}
      />
    </>
  );
}

function CategoryIcon({ category }: { category: ProductCategory }) {
  const label: Record<ProductCategory, string> = {
    seeds: "🌱",
    fertilizer: "🧪",
    pesticide: "🧴",
    equipment: "🛠️",
    feed: "🌾",
    harvest: "🧺",
  };
  return <span className="text-lg">{label[category]}</span>;
}
