-- Create tables for Asset Management System

-- Assets Table
CREATE TABLE IF NOT EXISTS public.assets (
    id SERIAL PRIMARY KEY,
    asset_id VARCHAR(50) UNIQUE NOT NULL,
    rig_name VARCHAR(100),
    category VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    serial_no VARCHAR(100),
    part_no VARCHAR(100),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    status VARCHAR(50),
    condition VARCHAR(50),
    date_installed DATE,
    acquisition_date DATE,
    value NUMERIC,
    location VARCHAR(255),
    system VARCHAR(100),
    criticality VARCHAR(50),
    notes TEXT,
    specs JSONB,
    docs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Rigs Table
CREATE TABLE IF NOT EXISTS public.rigs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(100),
    company VARCHAR(100),
    location VARCHAR(255),
    status VARCHAR(50),
    depth VARCHAR(100),
    manager VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Maintenance Table
CREATE TABLE IF NOT EXISTS public.maintenance (
    id VARCHAR(50) PRIMARY KEY, -- Using PM-001 style IDs
    asset_id VARCHAR(50) REFERENCES public.assets(asset_id) ON DELETE CASCADE,
    task VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    freq INTEGER,
    last_done DATE,
    next_due DATE,
    tech VARCHAR(100),
    hours NUMERIC,
    cost NUMERIC,
    priority VARCHAR(50),
    status VARCHAR(50),
    alert_days INTEGER,
    notes TEXT,
    logs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Transfers Table
CREATE TABLE IF NOT EXISTS public.transfers (
    id VARCHAR(50) PRIMARY KEY, -- e.g., TR-001
    asset_id VARCHAR(50) REFERENCES public.assets(asset_id) ON DELETE CASCADE,
    asset_name VARCHAR(255),
    current_loc VARCHAR(255),
    destination VARCHAR(255),
    dest_rig VARCHAR(100),
    dest_company VARCHAR(100),
    priority VARCHAR(50),
    type VARCHAR(100),
    requested_by VARCHAR(100),
    request_date DATE,
    required_date DATE,
    reason TEXT,
    instructions TEXT,
    status VARCHAR(50),
    ops_approval JSONB,
    mgr_approval JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50),
    department VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BOM Table
CREATE TABLE IF NOT EXISTS public.bom (
    id VARCHAR(50) PRIMARY KEY, -- e.g., BOM-123456
    asset_id VARCHAR(50) REFERENCES public.assets(asset_id) ON DELETE CASCADE,
    parent_id VARCHAR(50), -- Self-reference for tree
    name VARCHAR(255) NOT NULL,
    part_no VARCHAR(100),
    type VARCHAR(50), -- Serialized or Bulk
    serial_no VARCHAR(100),
    manufacturer VARCHAR(100),
    qty NUMERIC DEFAULT 1,
    uom VARCHAR(20) DEFAULT 'EA',
    unit_cost NUMERIC DEFAULT 0,
    lead_time INTEGER DEFAULT 0,
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
