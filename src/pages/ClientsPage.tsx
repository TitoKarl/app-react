import { useEffect, useState, type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type { Client } from '../interfaces/Client';
import { ClientsService } from '../services/ClientsService';

export default function ClientsPage(): JSX.Element {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    try {
      const data = await ClientsService.getClients();
      setClients(data ?? []);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los clientes.');
      console.error(err);
    }
  };

  const handleDelete = async (id?: number) => {
    if (id === undefined) return;
    if (!window.confirm('¿Seguro que quieres eliminar este cliente?')) return;

    try {
      await ClientsService.deleteClient(id);
      await loadClients();
    } catch (err) {
      setError('No se pudo eliminar el cliente.');
      console.error(err);
    }
  };

  useEffect(() => {
    let cancelled = false;

    ClientsService.getClients()
      .then((data) => {
        if (cancelled) return;
        setClients(data ?? []);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError('No se pudieron cargar los clientes.');
        console.error(err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container mt-4">
      <h2>Clientes</h2>

      <Link to="/addclient" className="btn btn-primary mb-3">
        Nuevo Cliente
      </Link>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => navigate(`/edit-client/${client.id}`)}
                >
                  Actualizar
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(client.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">
                No hay clientes registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
