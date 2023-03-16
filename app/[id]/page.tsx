import "bootstrap/dist/css/bootstrap.min.css"
import styles from "./page.module.css"

export const dynamic = 'force-dynamic'

export default async function Page(path:any) {
  const paraderoRes = await fetch(`https://api.xor.cl/red/bus-stop/${path.params.id}`,{
    cache:"no-store",
  })
  const dataParadero = await paraderoRes.json()
  console.log(dataParadero)

  let microsParadero
  if (dataParadero.status_code === 0) {
    // Ordenando dataParadero para mostrar primero los servicios en horario hábil con sort()
    microsParadero = dataParadero.services.sort((a: any, b: any) => {
      if (a.valid === b.valid) {
        return 0;
      }
      return a.valid ? -1 : 1; // -1 = a.valid va antes que b.valid : 1 = b.valid va antes que el a.valid en la lista
    });

    return(
      <main className="container-xxl d-flex flex-column pt-2 text-center align-items-center">
        <h1 className="row fw-normal">{dataParadero.name}</h1>
        <h2 className="row fw-bold text-light bg-success p-1 rounded-1">ID: {dataParadero.id}</h2>
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

          {microsParadero?.map((data:any) => {
            if(data.valid === true){
              return(
                <>
                  {data.buses.map((dataBus:any) =>{
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
      <a className="btn btn-success w-75 fw-bold align-self-center mb-5" href="./">Click para volver al inicio</a>
    </main>
    )
  } else {
      return(
        <div className="d-flex flex-column bg-warning vh-100 text-center">
          <h1 className="fw-bolder text-bg-danger display-1 p-5">ERROR:</h1>
          <h2 className="display-3 p-4">{dataParadero.status_description}
          </h2>
          <a className="btn btn-lg btn-light fw-bold align-self-center" href="./">Volver al inicio</a>
        </div>
    )
  }
}