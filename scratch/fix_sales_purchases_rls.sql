-- Run these 6 lines in Supabase SQL Editor to allow Delete & Update on Sales and Purchases:

DROP POLICY IF EXISTS "Allow delete sales" ON public.sales;
CREATE POLICY "Allow delete sales" ON public.sales FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow update sales" ON public.sales;
CREATE POLICY "Allow update sales" ON public.sales FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete purchases" ON public.purchases;
CREATE POLICY "Allow delete purchases" ON public.purchases FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow update purchases" ON public.purchases;
CREATE POLICY "Allow update purchases" ON public.purchases FOR UPDATE USING (true);
