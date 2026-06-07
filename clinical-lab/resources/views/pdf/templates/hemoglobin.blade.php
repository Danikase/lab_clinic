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

        /* Sección de examen */
        .exam-section {
            margin-top: 20px;
            border-top: 2px solid #1e3a8a;
            padding-top: 10px;
            position: relative;
            z-index: 1;
        }

        .exam-title {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
            margin-bottom: 15px;
            color: #1e3a8a;
        }

        .result-label {
            font-weight: bold;
            margin-top: 15px;
            text-transform: uppercase;
            color: #000;
        }

        .result-value {
            font-size: 14px;
            font-weight: bold;
            margin: 5px 0;
            color: #000;
        }

        /* Caja de referencias */
        .references-box {
            margin-top: 25px;
            border: 1px solid #1e3a8a;
            padding: 10px;
            background-color: #f0f4f8;
            font-size: 10px;
            position: relative;
            z-index: 1;
        }

        .ref-title {
            text-align: center;
            font-weight: bold;
            margin-bottom: 8px;
            text-transform: uppercase;
            font-size: 10px;
            color: #1e3a8a;
        }

        .ref-row {
            font-size: 10px;
            margin-bottom: 4px;
            line-height: 1.5;
            color: #000;
        }

        /* Firma */
        .footer {
            margin-top: 40px;
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

    <!-- EXAMEN Y RESULTADO -->
    <div class="exam-section">
        <div class="exam-title">Examen Realizado: {{ strtoupper($order->exam->name) }}</div>

        <div class="result-label">Resultado</div>
        @foreach($reportData as $item)
        @if($item['value'] && $item['value'] !== '-' && $item['value'] !== '')
        <div class="result-value">
            {{ $item['value'] }} {{ $item['unit'] }}
        </div>
        @endif
        @endforeach
    </div>

    <!-- VALORES DE REFERENCIA -->
    @php
    // Verificar si hay valores de referencia configurados
    $hasReferences = false;
    foreach($reportData as $item) {
    if(!empty($item['ref_min']) || !empty($item['ref_max'])) {
    $hasReferences = true;
    break;
    }
    }
    @endphp

    @if($hasReferences)
    <div class="references-box">
        <div class="ref-title">Valores de Referencia</div>
        @foreach($reportData as $item)
        @if(!empty($item['ref_min']) || !empty($item['ref_max']))
        <div class="ref-row">
            <strong>{{ strtoupper($item['name']) }}:</strong> {{ $item['ref_min'] ?? '-' }} – {{ $item['ref_max'] ?? '-' }} {{ $item['unit'] }}
        </div>
        @endif
        @endforeach
    </div>
    @endif

    <!-- FIRMA -->
    <div class="footer">
        <br><br><br>
        <div class="sign-line"></div>
        <div style="font-weight: bold;">Licenciado Luis Alejandro Alfaro</div>
        <div style="font-size: 9px;">J.V.P.L.C.1137</div>
    </div>
</body>

</html>