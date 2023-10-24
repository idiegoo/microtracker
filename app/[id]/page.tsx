import "bootstrap/dist/css/bootstrap.min.css"
import styles from "./page.module.css"

export const dynamic = 'force-dynamic'

type Services = {
  valid: boolean;
};

type MicroBus = {
  id: string;
  min_arrival_time: number;
  max_arrival_time: number;
  meters_distance: number;
  buses: Array<{
    id: string;
  }>;
};

type ParaderoData = {
  name: string;
  id: string;
  status_description: string;
  services: Array<Services>;
  buses: Array<MicroBus>;
  valid: boolean
};

export const runtime = 'edge';
export const preferredRegion = 'iad1';
export default async function Page(path: { params: { id: string, bus:string } }) {

  // Creamos una promesa que se resolverá después de 10 segundos
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Tiempo de espera agotado"));
    }, 24800);
  });

  // Creamos una promesa para el fetch
  const paraderoResPromise = fetch(`https://api.xor.cl/red/bus-stop/${path.params.id}`, {
    cache: "no-store",
  });

  try {
    // Usamos Promise.race para esperar ya sea el resultado del fetch o el timeout
    const response = await Promise.race([paraderoResPromise, timeoutPromise]);
    if (response instanceof Response) {
      const dataParadero = await response.json();

      let microsParadero;

      if (dataParadero.status_code === 0) {
        // Ordenando dataParadero para mostrar primero los servicios en horario hábil con sort()
        microsParadero = dataParadero.services.sort((a: Services, b: Services) => {
          if (a.valid === b.valid) {
            return 0;
          }
          return a.valid ? -1 : 1; // -1 = a.valid va antes que b.valid : 1 = b.valid va antes que el a.valid en la lista
        });

        return(
          <main className="container-xxl d-flex flex-column pt-2 text-center align-items-center">
            <h1 className="row fw-normal">{dataParadero.name}</h1>
            <h2 className="row shadow fw-bold text-light bg-success p-1 rounded-1">ID: {dataParadero.id}</h2>
            <table className="table table-dark table-striped">
              <thead>
              <tr>
                <th>Servicio</th>
                <th>Patente</th>
                <th>Llega entre</th>
                <th>Distancia</th>
              </tr>
              </thead>
              <tbody>

              {microsParadero?.map((data: ParaderoData) => {
                console.log(data)
                if(data.valid === true){
                  return(
                    <>
                      {data.buses.map((dataBus) =>{
                        let distanceText
                        const patente:string = dataBus.id
                        console.log(dataBus)
                        if (dataBus.min_arrival_time > 0 && dataBus.max_arrival_time >= 5 ) {
                          distanceText = `${dataBus.min_arrival_time} y ${dataBus.max_arrival_time} min`
                        }
                        else if (dataBus.meters_distance <= 500 && dataBus.max_arrival_time <= 3) {
                          distanceText = "Llegando"
                        }
                        else if (dataBus.min_arrival_time === 0 && dataBus.max_arrival_time <= 5){
                          distanceText = `Menos de ${dataBus.max_arrival_time} min`
                        }
                        else if (dataBus.min_arrival_time === 0) {
                          distanceText = `${dataBus.max_arrival_time} min`
                        }

                        // Datos de cada micro
                        return(
                          <tr key={patente}>
                            <td className="fw-bold" key={patente+data.id}>{data.id}</td>
                            <td key={patente+patente}>{patente}</td>
                            <td key={patente+distanceText}>{distanceText}</td>
                            <td key={patente+dataBus.meters_distance}>{dataBus.meters_distance} mts.</td>
                          </tr>
                          )
                        }
                      )
                    }
                  </>
                )
              } else if(data.valid === false){
                  return(
                    <tr className={styles.noStriped} key={data.id}>
                      <td className="fw-bold" key={data.id+data.id}>{data.id}</td>
                      <td colSpan={100} key={data.id+data.status_description}>{data.status_description}</td>
                    </tr>
                  )
                }
              }
            )}
            </tbody>
          </table>
          <a className="btn btn-success w-75 fw-bold align-self-center mb-5" href="./">Presiona para volver al inicio</a>
        </main>
        )
      } else {
        // En caso de error en el paradero
        return (
          <div className="d-flex flex-column bg-warning vh-100 text-center">
            <h1 className="fw-bolder text-bg-danger display-1 p-5">ERROR:</h1>
            <h2 className="display-3 p-4">{dataParadero.status_description}</h2>
            <a className="btn btn-lg btn-light fw-bold align-self-center" href=".././">Volver al inicio</a>
          </div>
        );
      }
    }
  } catch (error) {
    // Manejo de errores
    console.error("Error:", error);
    return (
      <div className="d-flex flex-column bg-danger vh-100 text-center">
        <h1 className="fw-bolder text-light display-1 p-3">Ups! :/</h1>
        <h2 className="display-3 text-warning p-4 fw-bolder">Tiempo de espera agotado (25 seg)</h2>
        <h3 className="p-3">Lo sentimos, el sistema se encuentra muy saturado en estos momentos, inténtalo de nuevo.</h3>
        <a className="btn btn-lg btn-light fw-bold align-self-center" href=".././">
          Volver al inicio
        </a>
      </div>
    );
  }
}