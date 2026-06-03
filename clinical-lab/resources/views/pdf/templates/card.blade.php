<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
            margin: 0;
            padding: 20px;
        }

        .card-container {
            border: 3px solid #0056b3;
            /* Borde azul como en la imagen */
            padding: 25px 20px;
            width: 90%;
            height: 180px;
            /* Altura fija estilo tarjeta */
            margin: 20px auto;
            position: relative;
            box-sizing: border-box;
        }

        /* Logo en esquina superior derecha */
        .logo-corner {
            position: absolute;
            top: 15px;
            right: 20px;
            width: 60px;
            height: auto;
        }

        /* Encabezado */
        .header {
            text-align: center;
            margin-top: 10px;
        }

        .lab-name {
            font-size: 13px;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }

        .lab-sub {
            font-size: 15px;
            font-weight: bold;
            margin: 2px 0 5px;
        }

        .license {
            font-size: 9px;
            font-weight: bold;
            margin-top: 5px;
        }

        /* Línea de firma del encabezado */
        .header-sign {
            width: 80%;
            margin: 10px auto 0;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            font-weight: bold;
        }

        /* Cuerpo */
        .body-content {
            margin-top: 30px;
            text-align: center;
        }

        .label {
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        /* Línea roja para el nombre */
        .patient-line {
            width: 80%;
            margin: 0 auto 20px;
            border-bottom: 2px solid red;
            /* Línea roja como en referencia */
            padding-bottom: 2px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            min-height: 20px;
        }

        .blood-title {
            font-size: 12px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 15px;
            text-transform: uppercase;
        }

        .result-row {
            font-size: 13px;
            font-weight: bold;
            margin: 10px 0;
            text-transform: uppercase;
        }
    </style>
</head>

<body>

    <div class="card-container">
        <!-- LOGO ESQUINA SUPERIOR DERECHA -->
        @if($header_logo)
        <img src="{{ $header_logo }}" class="logo-corner">
        @endif

        <!-- ENCABEZADO -->
        <div class="header">
            <p class="lab-name">LABORATORIO DE ANÁLISIS CLÍNICO</p>
            <p class="lab-sub">“ALFARO”</p>
            <p class="license">C.S.S.P. N° 839</p>

            <!-- Línea de firma -->
            <div class="header-sign">
                <span>Lic. Luis Alejandro Alfaro Contreras</span>
                <span>J.V.P.L.C.1137</span>
            </div>
        </div>

        <!-- DATOS -->
        <div class="body-content">
            <p class="label">NOMBRE:</p>
            <div class="patient-name">{{ $order->patient->first_name }} {{ $order->patient->last_name }}</div>

            <p class="blood-title">GRUPO SANGUINEO</p>

            @php
            // Obtener valores del reporte
            $group = $reportData->firstWhere('name', 'GRUPO')?->value ?? '-';
            $rh = $reportData->firstWhere('name', 'FACTOR Rh')?->value ?? '-';
            @endphp

            <p class="result-row">GRUPO: <span style="font-style:italic;">"{{ $group }}"</span></p>
            <p class="result-row">FACTOR Rh: <span style="font-style:italic;">{{ $rh }}</span></p>
        </div>
    </div>

</body>

</html>