-- =====================================================================
-- awmhv_sport.sql — Base de datos de A.W.M.H.V Sport
-- Cómo importarla (una sola vez):
--   1. Enciendan MySQL en XAMPP y abran http://localhost/phpmyadmin
--   2. Pestaña "Importar" → "Seleccionar archivo" → escojan este archivo
--   3. Presionen "Importar" (abajo). Aparece la base awmhv_sport con la tabla pedidos.
-- Se puede importar otra vez sin miedo: no borra los pedidos que ya existan.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS awmhv_sport
    CHARACTER SET utf8mb4            -- utf8mb4: acepta tildes, ñ y emojis
    COLLATE utf8mb4_spanish_ci;

USE awmhv_sport;

-- Una sola tabla: cada fila es un pedido del personalizador.
CREATE TABLE IF NOT EXISTS pedidos (
    id             INT AUTO_INCREMENT PRIMARY KEY,   -- el número del pedido: 1, 2, 3...
    fecha          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Quién pide
    cliente        VARCHAR(80)  NOT NULL,
    celular        VARCHAR(15)  NOT NULL,            -- para responderle por WhatsApp

    -- Qué camiseta
    corte          ENUM('Hombre', 'Mujer') NOT NULL,
    talla          ENUM('S', 'M', 'L', 'XL') NOT NULL,
    color_tela     VARCHAR(40)  NOT NULL,            -- ej: "Morado A.W.M.H.V (#5b1a9e)"
    color_detalle  VARCHAR(40)  NOT NULL,
    nombre_dorsal  VARCHAR(12)  NULL,                -- NULL = sin nombre en la espalda
    numero_dorsal  VARCHAR(2)   NULL,
    descripcion    TEXT         NOT NULL,

    -- Archivos: en la tabla solo va el NOMBRE del archivo.
    -- Las imágenes quedan guardadas en la carpeta subidas/
    imagen         VARCHAR(60)  NULL,                -- la imagen que subió el cliente (puede no haber)
    lugar_imagen   ENUM('frente', 'espalda') NULL,
    vista_previa   VARCHAR(60)  NOT NULL,            -- la camiseta como se veía al hacer el pedido

    -- En qué va el pedido
    estado         ENUM('nuevo', 'estampando', 'listo', 'entregado', 'cancelado')
                   NOT NULL DEFAULT 'nuevo'
);
