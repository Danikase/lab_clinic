<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            color: #000;
            margin: 0;
            padding: 25px 35px;
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
            margin-bottom: 20px;
            border-collapse: collapse;
        }

        .patient-table td {
            padding: 4px 2px;
            font-family: 'Times New Roman', Times, serif;
            font-size: 11px;
            color: #1e3a8a;
            vertical-align: bottom;
        }

        .patient-line {
            border-bottom: 1px solid #1e3a8a;
            width: 100%;
            display: inline-block;
            min-height: 14px;
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

        /* Título del examen */
        .exam-title {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
            margin: 15px 0 10px;
            text-decoration: underline;
            color: #000;
            position: relative;
            z-index: 1;
        }

        /* Tabla de resultados en 2 columnas */
        .results-container {
            width: 100%;
            position: relative;
            z-index: 1;
        }

        .results-table-wrapper {
            width: 100%;
            border-collapse: collapse;
        }

        .results-table-wrapper td {
            width: 50%;
            vertical-align: top;
            padding: 0 10px 0 0;
        }

        .results-table-wrapper td:last-child {
            padding-right: 0;
        }

        .result-table {
            width: 100%;
            border-collapse: collapse;
        }

        .result-table td {
            border: 1px solid #1e3a8a;
            padding: 4px 6px;
            text-align: left;
            font-size: 10px;
            color: #000;
        }

        .result-table td:first-child {
            font-weight: bold;
            text-transform: uppercase;
            width: 60%;
            color: #1e3a8a;
        }

        .result-table td:nth-child(2) {
            text-align: center;
            font-weight: bold;
            width: 20%;
        }

        .result-table td:last-child {
            text-align: center;
            font-style: italic;
            color: #555;
            width: 20%;
        }

        /* Firma */
        .footer {
            margin-top: 50px;
            text-align: right;
            padding-right: 40px;
            font-family: 'Times New Roman', Times, serif;
            color: #1e3a8a;
            position: relative;
            z-index: 1;
        }

        .sign-line {
            width: 200px;
            border-top: 1px solid #1e3a8a;
            margin: 0 auto 5px;
        }

        .sign-name {
            font-weight: bold;
            font-size: 10px;
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
                <strong>
                    @if(!empty($order->sample_type))
                    {{ strtoupper($order->sample_type) }}
                    @else
                    <span style="color: #999; font-style: italic;">No especificado</span>
                    @endif
                </strong>
            </td>
        </tr>
    </table>

    <!-- ... (todo el encabezado y datos del paciente igual que antes) ... -->

    <!-- TÍTULO DEL EXAMEN -->
    <div class="exam-title">{{ strtoupper($order->exam->name) }}</div>

    <!-- RESULTADOS EN 2 COLUMNAS (CORREGIDO PARA DOMPDF) -->
    <div class="results-container">
        <table class="results-table-wrapper">
            <tr>
                <!-- Columna izquierda -->
                <td>
                    <table class="result-table">
                        @php $half = ceil(count($reportData) / 2); @endphp
                        @foreach($reportData->take($half) as $item)
                        <tr>
                            <td>{{ strtoupper($item['name']) }}</td>
                            <td>{{ $item['value'] }}</td>
                            <td>{{ $item['unit'] }}</td>
                        </tr>
                        @endforeach
                    </table>
                </td>

                <!-- Columna derecha -->
                <td>
                    <table class="result-table">
                        @foreach($reportData->skip($half) as $item)
                        <tr>
                            <td>{{ strtoupper($item['name']) }}</td>
                            <td>{{ $item['value'] }}</td>
                            <td>{{ $item['unit'] }}</td>
                        </tr>
                        @endforeach
                    </table>
                </td>
            </tr>
        </table>
    </div>

    <!-- FIRMA -->
    <div class="footer">
        <br><br>
        <div class="sign-line"></div>
        <div class="sign-name">RESPONSABLE</div>
    </div>
</body>

</html>