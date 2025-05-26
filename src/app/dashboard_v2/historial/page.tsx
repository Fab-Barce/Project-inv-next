"use client";
import Header_user from "@/app/components/header_user";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon, 
  ArrowsUpDownIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  TruckIcon,
  WrenchIcon,
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Button from "@/app/components/Button";


type Movimiento = {
  id_movimiento: number;
  nombre_refaccion?: string | null;
  nombre?: string | null;
  placas?: string | null;
  placa_vehiculo?: string | null;
  cantidad?: string | null;
  fecha: string;
  hora: string;
  motivo?: string | null;
  tipo_movimiento: string;
  user_nombre: string;
  cantidad_restante?: number | null;
  num_unidad?: string | null;
  num_parte?: string | null; // <-- Agrega este campo
};

type CampoBusqueda = keyof Movimiento;

const campos: { label: string; value: CampoBusqueda; icon: any }[] = [
  { label: "ID Movimiento", value: "id_movimiento", icon: TagIcon },
  { label: "Refacción", value: "nombre_refaccion", icon: WrenchIcon },
  { label: "Número de Parte", value: "num_parte", icon: TagIcon }, // <-- Agrega aquí
  { label: "Vehículo", value: "num_unidad", icon: TruckIcon },
  { label: "Cantidad", value: "cantidad", icon: ArrowPathIcon },
  { label: "Fecha", value: "fecha", icon: CalendarIcon },
  { label: "Hora", value: "hora", icon: ClockIcon },
  { label: "Motivo", value: "motivo", icon: TagIcon },
  { label: "Tipo Movimiento", value: "tipo_movimiento", icon: ArrowPathIcon },
  { label: "Usuario", value: "user_nombre", icon: UserIcon },
];

const HistorialMovimientos = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<CampoBusqueda>("nombre_refaccion");
  const [sortField, setSortField] = useState<CampoBusqueda | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"timeline" | "table">("timeline");
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [tipoFilter, setTipoFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [inventarioActual, setInventarioActual] = useState<Record<string, number>>({});
  const [movementType, setMovementType] = useState<"all" | "vehicles" | "inventory">("all");

  useEffect(() => {
    axios.get("http://localhost:8000/Movimientos/")
      .then(response => {
        const movimientosData = response.data;
        setMovimientos(movimientosData);
        
        // Calculate current inventory based on movements
        const inventario: Record<string, number> = {};
        
        // Sort movements by date and time to process them chronologically
        const movimientosOrdenados = [...movimientosData].sort((a, b) => {
          const fechaA = new Date(`${a.fecha} ${a.hora}`);
          const fechaB = new Date(`${b.fecha} ${b.hora}`);
          return fechaB.getTime() - fechaA.getTime(); // Orden descendente
        });
        
        // Process each movement to calculate remaining inventory
        movimientosOrdenados.forEach(movimiento => {
          const nombre = movimiento.nombre || movimiento.nombre_refaccion;
          if (!nombre) return;
          
          if (!inventario[nombre]) {
            inventario[nombre] = 0;
          }
          
          const cantidad = parseInt(movimiento.cantidad || "0");
          
          if (movimiento.tipo_movimiento.toLowerCase() === "entrada") {
            inventario[nombre] += cantidad;
          } else if (movimiento.tipo_movimiento.toLowerCase() === "salida") {
            inventario[nombre] -= cantidad;
          }
          
          // Add the remaining quantity to the movement object
          movimiento.cantidad_restante = inventario[nombre];
        });
        
        setInventarioActual(inventario);
        setMovimientos(movimientosOrdenados);
      })
      .catch(error => console.error("Error al obtener los movimientos:", error));
  }, []);

  const handleSort = (campo: CampoBusqueda) => {
    if (sortField === campo) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(campo);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter({ start: "", end: "" });
    setTipoFilter("");
  };

  const movimientosFiltrados = movimientos.filter((movimiento) => {
    // Text search filter
    const textMatch = (movimiento[searchField] ?? "").toString().toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    const fecha = new Date(movimiento.fecha);
    const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
    const endDate = dateFilter.end ? new Date(dateFilter.end) : null;
    
    const dateMatch = (!startDate || fecha >= startDate) && (!endDate || fecha <= endDate);
    
    // Type filter
    const typeMatch = !tipoFilter || movimiento.tipo_movimiento === tipoFilter;
    
    // Movement type filter (vehicles vs inventory)
    let movementTypeMatch = true;
    if (movementType === "vehicles") {
      movementTypeMatch = !!(movimiento.num_unidad);
    } else if (movementType === "inventory") {
      movementTypeMatch = !(movimiento.num_unidad);
    }
    
    return textMatch && dateMatch && typeMatch && movementTypeMatch;
  });

  // Agrega esta función antes del componente principal
const extraerNumero = (str: string) => {
  const matches = str.match(/\d+/);
  return matches ? parseInt(matches[0]) : 0;
};

// (Opcional) Si quieres ordenamiento natural más avanzado, agrega también:
const compararNatural = (a: string, b: string) => {
  const regex = /(\d+|\D+)/g;
  const partesA = a.match(regex) || [];
  const partesB = b.match(regex) || [];

  for (let i = 0; i < Math.max(partesA.length, partesB.length); i++) {
    const parteA = partesA[i] || "";
    const parteB = partesB[i] || "";

    const numA = parseInt(parteA, 10);
    const numB = parseInt(parteB, 10);

    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA !== numB) return numA - numB;
    } else if (parteA !== parteB) {
      return parteA.localeCompare(parteB);
    }
  }
  return 0;
};

  const movimientosOrdenados = sortField
    ? [...movimientosFiltrados].sort((a, b) => {
        const aValue = a[sortField] ?? "";
        const bValue = b[sortField] ?? "";

        // Ordenamiento natural para num_unidad
        if (sortField === "num_unidad") {
          // Si quieres solo por número:
          const numA = extraerNumero(aValue?.toString() || "0");
          const numB = extraerNumero(bValue?.toString() || "0");
          return sortDirection === "asc" ? numA - numB : numB - numA;

          // Si quieres ordenamiento natural completo, usa esto en vez de lo de arriba:
          // return sortDirection === "asc"
          //   ? compararNatural(aValue?.toString() || "", bValue?.toString() || "")
          //   : compararNatural(bValue?.toString() || "", aValue?.toString() || "");
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return sortDirection === "asc"
          ? aValue.toString().localeCompare(bValue.toString())
          : bValue.toString().localeCompare(aValue.toString());
      })
  : movimientosFiltrados;

  // Group movements by date for timeline view
  const movimientosAgrupados = movimientosOrdenados.reduce((acc, movimiento) => {
    const fecha = movimiento.fecha;
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(movimiento);
    return acc;
  }, {} as Record<string, Movimiento[]>);

  const fechasOrdenadas = Object.keys(movimientosAgrupados).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Get unique movement types for filter
  const tiposMovimiento = [...new Set(movimientos.map(m => m.tipo_movimiento))];

  // Get color based on movement type
  const getColorForType = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "entrada":
        return "bg-green-100 text-green-800 border-green-300";
      case "salida":
        return "bg-red-100 text-red-800 border-red-300";
      case "ajuste":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  // Format quantity with sign for better readability
  const formatQuantity = (cantidad: string | null | undefined, tipo: string) => {
    if (!cantidad) return "0";
    const num = parseInt(cantidad);
    if (tipo.toLowerCase() === "salida") {
      return `-${num}`;
    }
    return `+${num}`;
  };

  return (
    <div>
      <Header_user />

      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
            Historial de Movimientos
          </h1>

          {/* Botón Volver */}
          <div className="flex justify-end mb-6">
            <Link href="/dashboard_v2">
              <Button variant="blue">
                Volver
              </Button>
            </Link>
          </div>

          {/* Movement Type Toggle */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-3">Tipo de Movimientos</h3>
            <div className="flex gap-3">
              <Button 
                variant={movementType === "all" ? "blue" : "gray"}
                onClick={() => setMovementType("all")}
              >
                Todos los Movimientos
              </Button>
              <Button 
                variant={movementType === "vehicles" ? "blue" : "gray"}
                onClick={() => setMovementType("vehicles")}
              >
                <TruckIcon className="w-5 h-5 mr-1" />
                Movimientos de Vehículos
              </Button>
              <Button 
                variant={movementType === "inventory" ? "blue" : "gray"}
                onClick={() => setMovementType("inventory")}
              >
                <WrenchIcon className="w-5 h-5 mr-1" />
                Movimientos de Inventario
              </Button>
            </div>
          </div>

          {/* View Toggle and Filters */}
          <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button 
                variant={viewMode === "timeline" ? "blue" : "gray"}
                onClick={() => setViewMode("timeline")}
              >
                Vista Timeline
              </Button>
              <Button 
                variant={viewMode === "table" ? "blue" : "gray"}
                onClick={() => setViewMode("table")}
              >
                Vista Tabla
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="gray"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="w-5 h-5 mr-1" />
                Filtros
              </Button>
              {showFilters && (
                <Button 
                  variant="red"
                  onClick={clearFilters}
                >
                  <XMarkIcon className="w-5 h-5 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white p-4 rounded shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Filtros Avanzados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por</label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as CampoBusqueda)}
                    className="w-full p-2 border rounded"
            >
              {campos.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Término de búsqueda</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimiento</label>
                  <select
                    value={tipoFilter}
                    onChange={(e) => setTipoFilter(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Todos</option>
                    {tiposMovimiento.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                    className="w-full p-2 border rounded"
            />
          </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Timeline View */}
          {viewMode === "timeline" && (
            <div className="space-y-8">
              {fechasOrdenadas.map((fecha) => (
                <div key={fecha} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-blue-600 text-white p-3 font-semibold">
                    {new Date(fecha).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {movimientosAgrupados[fecha].map((movimiento) => (
                        <div 
                          key={movimiento.id_movimiento} 
                          className={`border-l-4 p-4 rounded-md ${getColorForType(movimiento.tipo_movimiento)}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {movementType === "vehicles" 
                                  ? `Vehículo: ${movimiento.num_unidad || "Sin unidad"}`
                                  : (movimiento.nombre || movimiento.nombre_refaccion || "Sin nombre")}
                              </h3>
                              <p className="text-sm mt-1">
                                {movimiento.num_unidad ? 
                                  (movementType === "vehicles" 
                                    ? `Tipo: ${movimiento.tipo_movimiento}`
                                    : `Vehículo: ${movimiento.num_unidad}`) : 
                                  `Cantidad: ${formatQuantity(movimiento.cantidad, movimiento.tipo_movimiento)}`}
                              </p>
                              {movimiento.motivo && (
                                <p className="text-sm mt-1">Motivo: {movimiento.motivo}</p>
                              )}
                              {movimiento.nombre_refaccion && (
                                <p className="text-sm mt-1 font-medium">
                                  Inventarios restante: <span className="font-bold">{movimiento.cantidad_restante || 0}</span>
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-white">
                                {movimiento.tipo_movimiento}
                              </span>
                              <p className="text-sm mt-1">{movimiento.hora}</p>
                              <p className="text-sm">Por: {movimiento.user_nombre}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && (
          <div className="bg-white rounded-lg shadow-md overflow-auto border border-gray-300">
              <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 border-b">
                <tr>
                  {movementType !== "vehicles" && (
                    <>
                      <th
                        className="px-4 py-3 cursor-pointer select-none text-center"
                        onClick={() => handleSort("nombre_refaccion")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <WrenchIcon className="w-4 h-4" />
                          Refacción
                          {sortField === "nombre_refaccion" ? (
                            sortDirection === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4" />
                            ) : (
                              <ArrowDownIcon className="w-4 h-4" />
                            )
                          ) : (
                            <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 cursor-pointer select-none text-center"
                        onClick={() => handleSort("num_parte")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <TagIcon className="w-4 h-4" />
                          Núm. Parte
                          {sortField === "num_parte" ? (
                            sortDirection === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4" />
                            ) : (
                              <ArrowDownIcon className="w-4 h-4" />
                            )
                          ) : (
                            <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                    </>
                  )}
                    {movementType !== "inventory" && (
                      <th
                        className="px-4 py-3 cursor-pointer select-none text-center"
                        onClick={() => handleSort("num_unidad")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <TruckIcon className="w-4 h-4" />
                          Vehículo
                          {sortField === "num_unidad" ? (
                            sortDirection === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4" />
                            ) : (
                              <ArrowDownIcon className="w-4 h-4" />
                            )
                          ) : (
                            <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                    )}
                    {movementType !== "vehicles" && (
                      <>
                        <th
                          className="px-4 py-3 cursor-pointer select-none text-center"
                          onClick={() => handleSort("cantidad")}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <ArrowPathIcon className="w-4 h-4" />
                            Cantidad
                            {sortField === "cantidad" ? (
                              sortDirection === "asc" ? (
                                <ArrowUpIcon className="w-4 h-4" />
                              ) : (
                                <ArrowDownIcon className="w-4 h-4" />
                              )
                            ) : (
                              <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 cursor-pointer select-none text-center"
                          onClick={() => handleSort("cantidad_restante")}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <ArrowPathIcon className="w-4 h-4" />
                            Inventario Restante
                            {sortField === "cantidad_restante" ? (
                              sortDirection === "asc" ? (
                                <ArrowUpIcon className="w-4 h-4" />
                              ) : (
                                <ArrowDownIcon className="w-4 h-4" />
                              )
                            ) : (
                              <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </th>
                      </>
                    )}
                    <th
                      className="px-4 py-3 cursor-pointer select-none text-center"
                      onClick={() => handleSort("fecha")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        Fecha
                        {sortField === "fecha" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer select-none text-center"
                      onClick={() => handleSort("hora")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        Hora
                        {sortField === "hora" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                      <th
                        className="px-4 py-3 cursor-pointer select-none text-center"
                        onClick={() => handleSort("motivo")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <TagIcon className="w-4 h-4" />
                          Motivo
                          {sortField === "motivo" ? (
                            sortDirection === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4" />
                            ) : (
                              <ArrowDownIcon className="w-4 h-4" />
                            )
                          ) : (
                            <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                    <th
                      className="px-4 py-3 cursor-pointer select-none text-center"
                      onClick={() => handleSort("tipo_movimiento")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <ArrowPathIcon className="w-4 h-4" />
                        Tipo Movimiento
                        {sortField === "tipo_movimiento" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer select-none text-center"
                      onClick={() => handleSort("user_nombre")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        Usuario
                        {sortField === "user_nombre" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {movimientosOrdenados.map((m) => (
                  <tr key={m.id_movimiento} className="hover:bg-gray-100">
      {movementType !== "vehicles" && (
        <>
          <td className="px-4 py-2 text-center">{m.nombre || m.nombre_refaccion || "-"}</td>
          <td className="px-4 py-2 text-center">{m.num_parte || "-"}</td>
        </>
      )}
      {movementType !== "inventory" && (
        <td className="px-4 py-2 text-center">{m.num_unidad || "-"}</td>
      )}
      {movementType !== "vehicles" && (
        <>
          <td className="px-4 py-2 text-center">{formatQuantity(m.cantidad, m.tipo_movimiento)}</td>
          <td className="px-4 py-2 text-center font-medium">
            {m.cantidad_restante || 0}
          </td>
        </>
      )}
      <td className="px-4 py-2 text-center">{m.fecha}</td>
      <td className="px-4 py-2 text-center">{m.hora}</td>
      <td className="px-4 py-2 text-center">{m.motivo || "-"}</td>
      <td className="px-4 py-2 text-center">
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getColorForType(m.tipo_movimiento)}`}>
          {m.tipo_movimiento}
        </span>
      </td>
      <td className="px-4 py-2 text-center">{m.user_nombre}</td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
          )}

          {movimientos.length === 0 && (
            <div className="mt-4 text-center text-gray-500">No hay movimientos registrados.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialMovimientos;
