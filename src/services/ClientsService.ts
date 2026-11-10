import { supabase } from '../config/supabase';
import { Client } from '../interfaces/Client';

export class ClientsService {
    static async getClients() {

        const { data, error } = await supabase.from('clients').select('*');
        if (error) {
        throw error;
        }
        return data;
    }
    static async getClient(
    id: number
    ) {
        const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
        if (error) {
        throw error;
        }
        return data;
    }
    static async addClient(client: Client) {
        const { name, email, phone } = client;
        const { error } =await supabase.from('clients').insert([{ name, email, phone }]);
        if (error) {
        throw error;
        }
    }
    static async updateClient(
        id: number,
        client: Client
    ) {
        const { name, email, phone } = client;
        const { error } =await supabase.from('clients').update({ name, email, phone }).eq('id', id);
        if (error) {
            throw error;
        }
    }
    static async deleteClient(
        id: number
    ) {
        const { error } =await supabase.from('clients').delete().eq('id', id);
        if (error) {
            throw error;
        }
    }
}