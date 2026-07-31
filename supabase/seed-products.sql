-- Run this once, AFTER schema.sql, to load the same demo products that were
-- previously hardcoded in data/products.ts. Safe to run again — it upserts
-- by id, so re-running just refreshes these rows rather than duplicating them.

insert into products (id, name, category, price, old_price, specs, rating, reviews, badge, image)
values
  ('p1', 'Nova X13 Smartphone, 256GB', 'Phones', 42999, 54999, array['256GB','5G','108MP'], 4.6, 812, 'Deal', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop'),
  ('p2', 'AeroBook 14 Laptop, i5 / 16GB', 'Laptops', 78999, 92999, array['16GB RAM','512GB SSD','14in'], 4.8, 356, 'Best Seller', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop'),
  ('p3', 'PulseFit Watch Series 3', 'Wearables', 8499, 12999, array['GPS','7-day battery','AMOLED'], 4.4, 604, 'Deal', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'),
  ('p4', 'EchoWave Wireless Earbuds', 'Audio', 3999, 5999, array['ANC','30hr case','IPX5'], 4.5, 1204, 'New', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop'),
  ('p5', 'OrbitCam 4K Action Camera', 'Cameras', 15999, null, array['4K/60fps','Waterproof','Stabilized'], 4.3, 219, null, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop'),
  ('p6', 'GlideBar Bluetooth Soundbar', 'Audio', 6499, 8999, array['2.1ch','Bluetooth 5.2','HDMI ARC'], 4.2, 143, 'Deal', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop')
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  old_price = excluded.old_price,
  specs = excluded.specs,
  rating = excluded.rating,
  reviews = excluded.reviews,
  badge = excluded.badge,
  image = excluded.image;
