# Jelou Technical Challenge – AI Solution Engineer (Implementation)

## 🧠 Overview

Este proyecto implementa un sistema distribuido compuesto por:

* **Customers API** → gestión de clientes
* **Orders API** → gestión de productos y órdenes
* **Orchestrator (Lambda-like)** → flujo end-to-end de creación y confirmación

El sistema simula un flujo real donde una orden es:

1. Validada contra cliente
2. Creada con control transaccional
3. Confirmada de forma idempotente
4. Devuelta como respuesta consolidada

---

## 🏗️ Arquitectura

```
[Client]
   ↓
[Orchestrator]
   ↓
[Customers API] ←→ [Orders API] ←→ [MySQL]
```

* Comunicación vía HTTP (REST)
* Base de datos relacional (MySQL)
* Separación por servicios
* Orquestación externa (estilo Lambda)

---

## ⚙️ Tecnologías

* Node.js 22
* Express
* MySQL 8 (Docker)
* Axios
* Docker Compose

---

## 🚀 Cómo ejecutar el proyecto

### 1. Levantar base de datos

```bash
docker-compose up -d
```

---

### 2. Customers API

```bash
cd customers-api
npm install
node src/server.js
```

Disponible en:

```
http://localhost:3001
```

---

### 3. Orders API

```bash
cd orders-api
npm install
node src/server.js
```

Disponible en:

```
http://localhost:3002
```

---

### 4. Orchestrator

```bash
cd lambda-orchestrator
npm install
node handler.js
```

Disponible en:

```
http://localhost:3000
```

---

## 🧪 Prueba del flujo completo

```bash
curl -X POST http://localhost:3000/orchestrator/create-and-confirm-order \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"items":[{"product_id":4,"qty":1}]}'
```

### Respuesta esperada

```json
{
  "order": {
    "id": 2,
    "status": "CREATED",
    "total_cents": 1000
  },
  "confirmation": {
    "id": 2,
    "status": "CONFIRMED",
    "total_cents": 1000
  }
}
```

---

## 🔐 Idempotencia

La confirmación de órdenes implementa idempotencia mediante:

* Header: `X-Idempotency-Key`
* Tabla: `idempotency_keys`
* Persistencia de respuesta

Esto garantiza que múltiples requests con la misma key no generen efectos duplicados.

---

## 🧩 Decisiones técnicas

### Orchestrator sin Serverless Framework

Aunque el enunciado menciona `serverless-offline`, se implementó el orquestador como un endpoint HTTP en Node.js por las siguientes razones:

* Evitar dependencias externas (login/licencias)
* Garantizar reproducibilidad inmediata
* Reducir fricción para evaluación técnica
* Mantener compatibilidad total con Node.js 22

El comportamiento es equivalente a un Lambda expuesto vía API Gateway.

---

### Transacciones y consistencia

* Uso de transacciones (`BEGIN`, `COMMIT`, `ROLLBACK`)
* Lock de filas (`FOR UPDATE`)
* Validación de stock en tiempo real

---

### Diseño modular

Separación en capas:

* Controllers → manejo HTTP
* Services → lógica de negocio
* Repositories → acceso a datos

Esto mejora mantenibilidad y escalabilidad.

---

## 📌 Endpoints principales

### Customers API

* `POST /api/customers`
* `GET /api/customers/:id`
* `GET /api/internal/customers/:id`

---

### Orders API

* `POST /api/products`
* `GET /api/products/:id`
* `PATCH /api/products/:id`
* `POST /api/orders`
* `POST /api/orders/:id/confirm`

---

### Orchestrator

* `POST /orchestrator/create-and-confirm-order`

---

## 🧠 Conclusión

Este sistema demuestra:

* Implementación end-to-end
* Orquestación entre servicios
* Manejo de consistencia y concurrencia
* Patrones clave de fintech (idempotencia)

Diseñado con enfoque en entornos reales donde la confiabilidad y la trazabilidad son críticas.

This implementation prioritizes reproducibility, transactional integrity, and idempotency, which are critical in financial and order-processing systems.


## 🧪 Testing rápido (1 comando)

```bash
npm run db
npm run dev


##  Notas para evaluación

- No requiere login externo
- No requiere configuración adicional
- Todo el sistema levanta en menos de 1 minuto
- APIs desacopladas y orquestadas correctamente

