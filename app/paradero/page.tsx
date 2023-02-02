"use client"
import React from 'react';

interface Micro {
  id: string;
  status_description?: string;
  valid?: boolean;
  buses: Array<{
    id: string;
    min_arrival_time: number;
    max_arrival_time: number;
    meters_distance: number;
  }>;
}

async function fetchParadero() {
  const paraderoResponse = await fetch(`https://api.xor.cl/red/bus-stop/pf88`, {
    cache: 'no-store',
  });

  return paraderoResponse.json();
}

const Page: React.FC = () => {
  const [paradero, setParadero] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchParadero();
      setParadero(data);
    };

    fetchData();
  }, []);

  if (!paradero) {
    return <div>Loading...</div>;
  }

  const microsParadero = paradero.services;

  return (
    <main>
      <div>
        <p>
          Paradero: {paradero.id} {paradero.name}
        </p>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Patente</th>
            <th>Llega entre</th>
            <th>Distancia</th>
          </tr>
        </thead>

        <tbody>
          {microsParadero.map((data: Micro) => {
            if (data.valid === true) {
              return (
                <>
                  {data.buses.map((dataBus: any) => {
                    let distanceText;

                    if (dataBus.min_arrival_time === 0) {
                      distanceText = `Llegando`;
                    } else if (dataBus.min_arrival_time > 0) {
                      distanceText = `${dataBus.min_arrival_time} y ${dataBus.max_arrival_time} min`;
                    }

                    return (
                      <tr key={data.id}>
                        <td>{data.id}</td>
                        <td>{dataBus.id}</td>
                        <td>{distanceText}</td>
                        <td>{dataBus.meters_distance} mts.</td>
                      </tr>
                    );
                  })}
                </>
              );
            } else if (data.valid === false) {
              return (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{data.status_description}</td>
                  <td />
                  <td />
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </main>
  );
};

export default Page;