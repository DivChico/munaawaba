# Database Schema Setup Guide

## 📋 How to Apply the Schema

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for completion (should take ~5 seconds)

### Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

## 📊 Database Tables Created

### 1. **profiles**
Extends `auth.users` with additional user information
- `id` - Links to auth.users
- `full_name` - User's full name
- `role` - admin | employee | technician
- `phone` - Contact number
- `avatar_url` - Profile picture

### 2. **services**
Service types offered (Installation, Maintenance, etc.)
- Pre-populated with 4 default services in Arabic
- Configurable duration and pricing
- Color coding for calendar display

### 3. **customers**
Customer database with location tracking
- Contact information
- Google Maps integration fields
- Notes and history

### 4. **appointments**
Core booking system
- Links to customer, technician, and service
- Time slots (morning/evening periods)
- Status tracking (scheduled → completed)
- Completion code system
- Invoice tracking

### 5. **feedback**
Customer satisfaction ratings
- Links to appointments
- 4-level rating system (excellent → bad)
- Optional comments

## 🔒 Security Features

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Role-based access** (admin can manage services)
- ✅ **Auto-profile creation** on user signup
- ✅ **Secure policies** for data access

## 🚀 What Happens After Running

1. All tables will be created
2. RLS policies will be active
3. Triggers will be set up for auto-updates
4. 4 default services will be inserted:
   - كشف موقع (Site Inspection)
   - صيانة (Maintenance)
   - تركيب (Installation)
   - عقد صيانة شهري (Monthly Contract)

## ✅ Verify Setup

After running the schema, verify in Supabase Dashboard:
1. Go to **Table Editor**
2. You should see: profiles, services, customers, appointments, feedback
3. Go to **Authentication** → **Policies** to see RLS rules

## 🔜 Next Steps

After schema is applied:
1. Test user registration (profile will auto-create)
2. Build authentication pages
3. Create appointment booking interface
