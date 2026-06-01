"use client";

import { useActionState } from "react";
import { submitBidAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function BidForm({ projectId, minPrice, maxPrice }: { projectId: string, minPrice: number, maxPrice: number }) {
  const [state, formAction, isPending] = useActionState(submitBidAction, null);

  return (
    <form action={formAction} className="space-y-4 text-left">
      <input type="hidden" name="project_id" value={projectId} />
      
      {state?.message && !state.errors && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
          <AlertCircle className="w-4 h-4" />
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="bid_price">Tawaran Harga (Rp)</Label>
        <Input 
          id="bid_price" 
          name="bid_price" 
          type="number" 
          min={minPrice} 
          max={maxPrice} 
          placeholder={`Min ${minPrice.toLocaleString()}`} 
          required 
          disabled={isPending} 
        />
        {state?.errors?.bid_price && <p className="text-xs text-red-500">{state.errors.bid_price[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimated_days">Estimasi Pengerjaan (Hari)</Label>
        <Input 
          id="estimated_days" 
          name="estimated_days" 
          type="number" 
          min="1" 
          placeholder="Misal: 7" 
          required 
          disabled={isPending} 
        />
        {state?.errors?.estimated_days && <p className="text-xs text-red-500">{state.errors.estimated_days[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolio_link">Link Portofolio (Opsional)</Label>
        <Input 
          id="portfolio_link" 
          name="portfolio_link" 
          type="url" 
          placeholder="https://github.com/anda" 
          disabled={isPending} 
        />
        {state?.errors?.portfolio_link && <p className="text-xs text-red-500">{state.errors.portfolio_link[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="proposal_message">Pesan Proposal</Label>
        <textarea 
          id="proposal_message" 
          name="proposal_message" 
          className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Jelaskan mengapa Anda cocok untuk mengerjakan project ini..." 
          required 
          disabled={isPending} 
        />
        {state?.errors?.proposal_message && <p className="text-xs text-red-500">{state.errors.proposal_message[0]}</p>}
      </div>

      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isPending}>
        {isPending ? "Mengirim Bid..." : "Submit Bid"}
      </Button>
    </form>
  );
}
