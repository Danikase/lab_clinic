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
            padding: 30px 40px;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
            line-height: 1.3;
        }

        .lab-name {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
        }

        .lab-sub {
            font-size: 16px;
            font-weight: bold;
            margin: 5px 0 10px;
        }

        .watermark {
            position: absolute;
            top: 45%;
            /* Centrado vertical (un poco más abajo del centro) */
            left: 50%;
            /* Centrado horizontal */
            transform: translate(-50%, -50%);
            width: 280px;
            /* Tamaño ajustado para que no tape el texto */
            opacity: 0.4;
            /* Muy transparente para que el texto se lea bien */
            z-index: 0;
            /* Se queda al fondo */
            pointer-events: none;
            /* No interfiere con clicks */
        }

        .lab-info {
            font-size: 9px;
            margin: 2px 0;
            line-height: 1.4;
        }

        .license {
            font-size: 10px;
            font-weight: bold;
            margin-top: 10px;
        }

        /* Datos del paciente */
        .patient-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .patient-table td {
            padding: 3px 5px;
            border-bottom: 1px solid #ccc;
            font-size: 11px;
        }

        .label {
            font-weight: bold;
            width: 120px;
        }

        /* Hora de muestra */
        .sample-time {
            margin: 10px 0;
            font-size: 11px;
        }

        /* Secciones del examen */
        .section-title {
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            margin: 20px 0 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #000;
        }

        /* Tabla de resultados */
        .result-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .result-table td {
            padding: 5px;
            border-bottom: 1px dotted #ccc;
            font-size: 11px;
        }

        .result-table td:first-child {
            font-weight: bold;
            width: 40%;
        }

        .result-table td:nth-child(2) {
            text-align: center;
            font-weight: bold;
            width: 20%;
        }

        .result-table td:last-child {
            color: #555;
            font-size: 10px;
        }

        /* Observaciones */
        .observations {
            margin-top: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            min-height: 60px;
        }

        .observations-title {
            font-weight: bold;
            margin-bottom: 5px;
        }

        /* Firma */
        .footer {
            margin-top: 50px;
            text-align: center;
        }

        .sign-line {
            width: 220px;
            border-top: 1px solid #000;
            margin: 0 auto 5px;
        }
    </style>
</head>

<body>
    <!-- LOGO COMO IMAGEN BASE64 -->
    @if($logo)
    <img src="{{ $logo }}" class="logo-header" alt="Logo Laboratorio Alfaro">
    @endif

    <!-- ENCABEZADO -->
    <div class="header">
        <div class="lab-name">LABORATORIO DE ANÁLISIS CLÍNICO</div>
        <div class="lab-sub">"ALFARO"</div>
        <div class="lab-info">
            Dirección: 1° Avenida Norte # 11 – B Barrio Las Ánimas, Chalchuapa<br>
            Horario: Lunes a Viernes 7:00 a.m. a 12:00 m. y 2:00 p.m. a 4:00 p.m.<br>
            Sábado: 7:00 a.m. – 12:00 m.
        </div>
        <div class="license">C.S.S.P. N° 839 &nbsp;&nbsp; Lic. Luis Alejandro Alfaro &nbsp;&nbsp; J.V.P.L.C.1137</div>
    </div>

    <!-- DATOS DEL PACIENTE -->
    <table class="patient-table">
        <tr>
            <td class="label">Paciente:</td>
            <td colspan="3">{{ $order->patient->first_name }} {{ $order->patient->last_name }}</td>
        </tr>
        <tr>
            <td class="label">Edad:</td>
            <td>{{ $ageText }}</td>
            <td class="label">Sexo:</td>
            <td>{{ $order->patient->gender }}</td>
        </tr>
        <tr>
            <td class="label">Fecha:</td>
            <td>{{ $date }}</td>
            <td class="label">Muestra de:</td>
            <td><strong>SEMEN</strong></td>
        </tr>
    </table>

    <!-- HORA DE TOMA DE MUESTRA -->
    <div class="sample-time">
        <strong>HORA TOMA DE MUESTRA:</strong>
        @php
        $timeField = $reportData->firstWhere('name', 'HORA TOMA DE MUESTRA');
        @endphp
        {{ $timeField ? $timeField['value'] : '_______' }}
    </div>

    <!-- EXAMEN MACROSCÓPICO -->
    <div class="section-title">EXAMEN MACROSCÓPICO</div>
    <table class="result-table">
        @php
        $macroFields = ['COLOR', 'OLOR', 'VOLUMEN', 'pH', 'LICUEFACCION', 'COAGULACION', 'VISCOSIDAD'];
        @endphp

        @foreach($reportData as $item)
        @if(in_array(strtoupper($item['name']), $macroFields))
        <tr>
            <td>{{ strtoupper($item['name']) }}</td>
            <td>{{ $item['value'] }} {{ $item['unit'] }}</td>
            <td>
                @if($item['ref_min'] || $item['ref_max'])
                VN: {{ $item['ref_min'] ?? '-' }} – {{ $item['ref_max'] ?? '-' }} {{ $item['unit'] }}
                @endif
            </td>
        </tr>
        @endif
        @endforeach
    </table>

    <!-- EXAMEN MICROSCÓPICO -->
    <div class="section-title">EXAMEN MICROSCÓPICO</div>
    <table class="result-table">
        @php
        $microFields = ['CONTEO DE ESPERMATOZOIDES', 'MOVILIDAD', 'ACTIVOS A LA EYACULACIÓN', 'ACTIVOS A LA MEDIA HORA', 'ACTIVOS A 1 HORA', 'ACTIVOS A LAS 2 HORAS', 'ACTIVOS A LAS 3 HORAS'];
        @endphp

        @foreach($reportData as $item)
        @if(in_array(strtoupper($item['name']), $microFields))
        <tr>
            <td>{{ strtoupper($item['name']) }}</td>
            <td>{{ $item['value'] }} {{ $item['unit'] }}</td>
            <td>
                @if($item['ref_min'] || $item['ref_max'])
                VN: {{ $item['ref_min'] ?? '-' }} – {{ $item['ref_max'] ?? '-' }} {{ $item['unit'] }}
                @endif
            </td>
        </tr>
        @endif
        @endforeach
    </table>

    <!-- FORMAS ANORMALES -->
    <div class="section-title">FORMAS ANORMALES</div>
    <table class="result-table">
        @php
        $abnormalFields = ['CABEZAS GIGANTES', 'DOS COLAS', 'CABEZAS AMORFAS'];
        @endphp

        @foreach($reportData as $item)
        @if(in_array(strtoupper($item['name']), $abnormalFields))
        <tr>
            <td>{{ strtoupper($item['name']) }}</td>
            <td>{{ $item['value'] }} {{ $item['unit'] }}</td>
            <td></td>
        </tr>
        @endif
        @endforeach
    </table>

    <!-- OBSERVACIONES -->
    @php
    $observations = $reportData->firstWhere('name', 'OBSERVACIONES');
    @endphp
    @if($observations && $observations['value'])
    <div class="observations">
        <div class="observations-title">OBSERVACIONES:</div>
        <div>{{ $observations['value'] }}</div>
    </div>
    @endif

    <!-- FIRMA -->
    <div class="footer">
        <br><br><br>
        <div class="sign-line"></div>
        <div style="font-weight: bold;">Lic. Luis Alejandro Alfaro</div>
        <div style="font-size: 9px;">C.S.S.P. N° 839 | J.V.P.L.C.1137</div>
    </div>
</body>

</html>