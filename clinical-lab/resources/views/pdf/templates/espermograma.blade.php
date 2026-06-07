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
            position: relative;
        }

        /* Encabezado de 3 columnas */
        .header-table {
            width: 100%;
            margin-bottom: 8px;
            color: #1e3a8a;
        }

        .header-table td {
            vertical-align: top;
            padding: 2px;
        }

        .lab-title {
            font-family: 'Times New Roman', Times, serif;
            font-size: 15px;
            font-weight: bold;
            text-align: center;
            margin: 0;
            text-transform: uppercase;
            color: #1e3a8a;
        }

        .lab-sub {
            font-family: 'Times New Roman', Times, serif;
            font-size: 17px;
            font-weight: bold;
            text-align: center;
            margin: 2px 0 4px;
            color: #1e3a8a;
        }

        .license-text {
            font-family: 'Times New Roman', Times, serif;
            font-size: 10px;
            text-align: center;
            font-style: italic;
            margin-top: 4px;
            color: #1e3a8a;
        }

        .schedule-text,
        .address-text {
            font-family: 'Times New Roman', Times, serif;
            font-size: 9px;
            line-height: 1.4;
            color: #1e3a8a;
        }

        .schedule-text {
            text-align: right;
        }

        .address-text {
            text-align: left;
        }

        /* Línea separadora */
        .separator {
            border-bottom: 2px solid #1e3a8a;
            margin: 8px 0 15px 0;
        }

        /* Datos del paciente con líneas inferiores */
        .patient-table {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
        }

        .patient-table td {
            padding: 4px 2px;
            font-family: 'Times New Roman', Times, serif;
            font-size: 11px;
            color: #1e3a8a;
            vertical-align: bottom;
        }

        /* Marca de agua */
        .watermark {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 280px;
            opacity: 0.35;
            z-index: 0;
            pointer-events: none;
        }

        /* Hora de muestra */
        .sample-time {
            margin: 10px 0;
            font-size: 11px;
            font-family: 'Times New Roman', Times, serif;
            color: #1e3a8a;
            position: relative;
            z-index: 1;
        }

        /* Secciones del examen */
        .section-title {
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            margin: 20px 0 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #1e3a8a;
            color: #1e3a8a;
            position: relative;
            z-index: 1;
        }

        /* Tabla de resultados */
        .result-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
        }

        .result-table td {
            padding: 5px;
            border-bottom: 1px dotted #1e3a8a;
            font-size: 11px;
            color: #000;
        }

        .result-table td:first-child {
            font-weight: bold;
            width: 40%;
            color: #1e3a8a;
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
            border: 1px solid #1e3a8a;
            background-color: #f0f4f8;
            min-height: 60px;
            font-size: 10px;
            position: relative;
            z-index: 1;
        }

        .observations-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #1e3a8a;
            font-family: 'Times New Roman', Times, serif;
        }

        /* Firma */
        .footer {
            margin-top: 50px;
            text-align: center;
            font-family: 'Times New Roman', Times, serif;
            color: #1e3a8a;
            position: relative;
            z-index: 1;
        }

        .sign-line {
            width: 220px;
            border-top: 1px solid #1e3a8a;
            margin: 0 auto 5px;
        }
    </style>
</head>

<body>
    <!-- LOGO / MARCA DE AGUA -->
    @if($logo)
    <img src="{{ $logo }}" class="watermark" alt="Logo Laboratorio Alfaro">
    @endif

    <!-- ENCABEZADO 3 COLUMNAS -->
    <table class="header-table">
        <tr>
            <!-- Izquierda: Dirección -->
            <td width="30%" class="address-text">
                <strong>DIRECCIÓN</strong><br>
                1° Avenida Norte # 11 – B<br>
                Barrio Las Ánimas, Chalchuapa
            </td>

            <!-- Centro: Título y Licencias -->
            <td width="40%">
                <h1 class="lab-title">LABORATORIO DE ANÁLISIS CLÍNICO</h1>
                <h2 class="lab-sub">"ALFARO"</h2>
                <div style="text-align: center; font-weight: bold; font-size: 11px; color: #1e3a8a;">C.S.S.P. N° 839</div>
                <div class="license-text">Lic. Luis Alejandro Alfaro &nbsp; J.V.P.L.C.1137</div>
            </td>

            <!-- Derecha: Horario -->
            <td width="30%" class="schedule-text">
                <strong>HORARIO</strong><br>
                Lunes a Viernes<br>
                7:00 a.m. a 12:00 m.<br>
                2:00 p.m. a 4:00 p.m.<br>
                Sábado: 7:00 a.m. – 12:00 m
            </td>
        </tr>
    </table>

    <!-- LÍNEA SEPARADORA -->
    <div class="separator"></div>

    <!-- DATOS DEL PACIENTE (Líneas inferiores) -->
    <table class="patient-table">
        <tr>
            <td width="15%"><strong>Paciente:</strong></td>
            <td style="border-bottom: 1px solid #1e3a8a; padding-left: 8px;">
                {{ $order->patient->first_name }} {{ $order->patient->last_name }}
            </td>
        </tr>
        <tr>
            <td><strong>Edad:</strong></td>
            <td style="border-bottom: 1px solid #1e3a8a; padding-left: 8px;">{{ $ageText }}</td>
            <td width="10%"><strong>Sexo:</strong></td>
            <td width="10%" style="border-bottom: 1px solid #1e3a8a; text-align: center;">
                @php
                $gender = strtoupper($order->patient->gender ?? 'O');
                $displayGender = ($gender === 'M') ? 'M' : (($gender === 'F') ? 'F' : '-');
                @endphp
                {{ $displayGender }}
            </td>
            <td width="12%"><strong>Fecha:</strong></td>
            <td style="border-bottom: 1px solid #1e3a8a; padding-left: 8px;">{{ $date }}</td>
        </tr>
        <tr>
            <td><strong>Muestra de:</strong></td>
            <td colspan="5" style="border-bottom: 1px solid #1e3a8a; padding-left: 8px;">
                <strong>SEMEN</strong>
            </td>
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