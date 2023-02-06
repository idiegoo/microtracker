import "bootstrap/dist/css/bootstrap.min.css"


export const dynamic = 'force-dynamic'

export default async function Page(path:any) {
  const paraderoRes = await fetch(`https://api.xor.cl/red/bus-stop/${path.params.id}`,{
    cache:"no-store",
  })
  const dataParadero = await paraderoRes.json()

  let microsParadero
  if (dataParadero) {
    // Ordenando dataParadero para mostrar primero los servicios en horario hábil con sort()
    microsParadero = dataParadero.services.sort((a: any, b: any) => {
      if (a.valid === b.valid) {
        return 0;
      }
      return a.valid ? -1 : 1; // -1 = a.valid va antes que b.valid : 1 = b.valid va antes que el a.valid en la lista
    });
  }

    return(
      <main>
        <h1>{dataParadero.name} ID: {dataParadero.id}</h1>
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

                    if(dataBus.min_arrival_time === 0){
                      distanceText = `Llegando`
                    } else if(dataBus.min_arrival_time > 0) {
                      distanceText = `${dataBus.min_arrival_time} y ${dataBus.max_arrival_time} min`
                    }

                    // Datos de cada micro
                    return(
                      <tr key={patente}>
                        <td key={patente+data.id}>{data.id}</td>
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
                <tr key={data.id}>
                  <td key={data.id+data.id}>{data.id}</td>
                  <td key={data.id+data.status_description}>{data.status_description}</td>
                  <td key={data.id+"0"}></td>
                  <td key={data.id+"1"}></td>
                </tr>
              )
            }
          }
        )}
        </tbody>
      </table>
    </main>
    )
}