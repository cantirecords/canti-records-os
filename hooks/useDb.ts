import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Project, Client, LeadIntake, Asset, Invoice, Payment } from '../types';

export const useDashboardData = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [leads, setLeads] = useState<LeadIntake[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [
                { data: pData, error: pError },
                { data: cData, error: cError },
                { data: lData, error: lError },
                { data: aData, error: aError },
                { data: iData, error: iError },
                { data: payData, error: payError }
            ] = await Promise.all([
                supabase.from('projects').select('*'),
                supabase.from('clients').select('*'),
                supabase.from('leads').select('*'),
                supabase.from('assets').select('*'),
                supabase.from('invoices').select('*'),
                supabase.from('payments').select('*')
            ]);

            if (pError || cError || lError || aError || iError || payError) {
                throw new Error('Error fetching dashboard data');
            }

            setProjects(pData || []);
            setClients(cData || []);
            setLeads(lData || []);
            setAssets(aData || []);
            setInvoices(iData || []);
            setPayments(payData || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Setup real-time subscriptions
        const projectSub = supabase.channel('schema-db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchData())
            .subscribe();

        return () => {
            supabase.removeChannel(projectSub);
        };
    }, []);

    return { projects, clients, leads, assets, invoices, payments, loading, error, refresh: fetchData };
};
