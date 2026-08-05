-- Create teachers table
create table public.teachers (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    profile_image text,
    profile jsonb not null default '{}'::jsonb,
    kelulusan jsonb not null default '[]'::jsonb,
    subjek jsonb not null default '[]'::jsonb,
    sejarah jsonb not null default '[]'::jsonb,
    owner_id uuid references auth.users(id) on delete cascade not null
);

-- Enable RLS
alter table public.teachers enable row level security;

-- Grant access
grant select, insert, update, delete on public.teachers to authenticated;
grant all on public.teachers to service_role;

-- Policies
create policy "Users can manage their own teachers"
on public.teachers for all
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);