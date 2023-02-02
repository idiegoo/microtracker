"use client"
import "bootstrap/dist/css/bootstrap.min.css"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"

export default function DataDisplayer(pathname:any){
  const [dataParadero, setDataParadero] = useState<{ services: any[], id: string, name:string } | null>(null);
  const currentPathname = usePathname()

  useEffect(() => {
    const fetchParadero = async () => {
      pathname = currentPathname
      const paraderoResponse = await fetch(`https://api.xor.cl/red/bus-stop${pathname}`,{
        cache:"no-store"
      })
      console.log(pathname)
      const newDataParadero = await paraderoResponse.json()
      setDataParadero(newDataParadero) //Actualizamos el dataParadero con la constante tmp
    }

    fetchParadero()
  }, [pathname])

  if (dataParadero) {
    // Ordenando dataParadero para mostrar primero los servicios en horario hábil con sort()
    const microsParadero = dataParadero.services.sort((a: any, b: any) => {
      if (a.valid === b.valid) {
        return 0;
      }
      return a.valid ? -1 : 1; // -1 = a.valid va antes que b.valid : 1 = b.valid va antes que el a.valid en la lista
    });

    console.log(microsParadero)
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
            {/* Mapeamos en .reverse para que muestre primero los datos de data.valid true */}
          {microsParadero.map((data:any) => {
            if(data.valid === true){
              return(
                <>
                  {data.buses.map((dataBus:any) =>{
                    let distanceText
                    const patente = dataBus.id

                    if(dataBus.min_arrival_time === 0){
                      distanceText = `Llegando`
                    } else if(dataBus.min_arrival_time > 0) {
                      distanceText = `${dataBus.min_arrival_time} y ${dataBus.max_arrival_time} min`
                    }

                    // Datos de cada micro
                    return(
                      <tr key={patente}>
                        <td>{data.id}</td>
                        <td>{patente}</td>
                        <td>{distanceText}</td>
                        <td>{dataBus.meters_distance} mts.</td>
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
                  <td>{data.id}</td>
                  <td>{data.status_description}</td>
                  <td></td>
                  <td></td>
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
}