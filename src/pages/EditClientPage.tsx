import { useEffect, useState, type JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ClientsService } from '../services/ClientsService';

export default function EditClientPage(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState({
    id: 0,
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    ClientsService.getClient(Number(id))
      .then((data) => {
        if (cancelled) return;
        setClient(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError('No se pudo cargar el cliente.');
        console.error(err);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await ClientsService.updateClient(Number(id), client);
      navigate('/clients');
    } catch (err) {
      setError('No se pudo actualizar el cliente.');
      console.error(err);
    }
  }

  return (
    <div className="container mt-4">
      <h2>Actualizar Cliente</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Nombre"
          value={client.name}
          onChange={(e) => setClient({ ...client, name: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          value={client.email}
          onChange={(e) => setClient({ ...client, email: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Teléfono"
          value={client.phone}
          onChange={(e) => setClient({ ...client, phone: e.target.value })}
        />
        <button type="submit" className="btn btn-success me-2">
          Salvar
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/clients')}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
